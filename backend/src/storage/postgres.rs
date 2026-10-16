use sqlx::{PgPool, Postgres, Transaction};
use uuid::Uuid;
use crate::proto::sync::MutationOp;

#[derive(Debug)]
pub enum ApplyResult {
    /// La mutación fue procesada y se aplicaron 0 o más campos ganadores
    Applied { fields_updated: usize },
    /// La mutación ya había sido procesada con anterioridad (idempotente)
    AlreadyProcessed,
}

#[derive(Clone)]
pub struct PostgresStorage {
    pool: PgPool,
}

impl PostgresStorage {
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }

    /// Aplica una mutación dentro de una transacción atómica verificando idempotencia
    pub async fn apply_mutation(&self, op: &MutationOp) -> Result<ApplyResult, sqlx::Error> {
        let mutation_uuid = Uuid::parse_str(&op.mutation_id)
            .map_err(|e| sqlx::Error::Protocol(format!("UUID inválido: {}", e)))?;

        let mut tx: Transaction<'_, Postgres> = self.pool.begin().await?;

        // 1. Paso de Idempotencia: INSERT con ON CONFLICT DO NOTHING
        let insert_mutation = sqlx::query!(
            r#"
            INSERT INTO processed_mutations (mutation_id, entity_id, entity_type)
            VALUES ($1, $2, $3)
            ON CONFLICT (mutation_id) DO NOTHING
            "#,
            mutation_uuid,
            op.entity_id,
            op.entity_type
        )
        .execute(&mut *tx)
        .await?;

        // Si 0 filas fueron afectadas, la mutación ya existía en la base de datos
        if insert_mutation.rows_affected() == 0 {
            tx.rollback().await?;
            return Ok(ApplyResult::AlreadyProcessed);
        }

        let mut updated_count = 0;

        // 2. Aplicar cada campo con la regla matemática LWW en SQL
        for field in &op.fields {
            let ts = match &field.timestamp {
                Some(t) => t,
                None => continue,
            };

            let rows_affected = sqlx::query!(
                r#"
                INSERT INTO entity_fields (
                    entity_id, entity_type, field_name, field_value, 
                    wall_time, counter, node_id
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                ON CONFLICT (entity_id, field_name) DO UPDATE
                SET 
                    field_value = EXCLUDED.field_value,
                    wall_time   = EXCLUDED.wall_time,
                    counter     = EXCLUDED.counter,
                    node_id     = EXCLUDED.node_id,
                    updated_at  = NOW()
                WHERE 
                    (entity_fields.wall_time < EXCLUDED.wall_time) OR
                    (entity_fields.wall_time = EXCLUDED.wall_time AND entity_fields.counter < EXCLUDED.counter) OR
                    (entity_fields.wall_time = EXCLUDED.wall_time AND entity_fields.counter = EXCLUDED.counter AND entity_fields.node_id < EXCLUDED.node_id)
                "#,
                op.entity_id,
                op.entity_type,
                field.field_name,
                field.value_json,
                ts.wall_time as i64,
                ts.counter as i32,
                ts.node_id
            )
            .execute(&mut *tx)
            .await?
            .rows_affected();

            if rows_affected > 0 {
                updated_count += 1;
            }
        }

        tx.commit().await?;
        Ok(ApplyResult::Applied { fields_updated: updated_count })
    }
}
