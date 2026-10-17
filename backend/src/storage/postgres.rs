use sqlx::{PgPool, Postgres, Transaction};
use uuid::Uuid;
use crate::proto::sync::{FieldMutation, HlcTimestamp, MutationOp, OperationType};

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

    /// Lee el estado consolidado de todas las entidades activas para sincronizar clientes nuevos
    pub async fn fetch_workspace_snapshot(&self) -> Result<Vec<MutationOp>, sqlx::Error> {
        // Obtenemos el registro más reciente por cada campo individual
        let records = sqlx::query!(
            r#"
            SELECT entity_id, entity_type, field_name, field_value, wall_time, counter, node_id
            FROM entity_fields
            ORDER BY entity_id
            "#
        )
        .fetch_all(&self.pool)
        .await?;

        // Agrupamos campos por entidad para reconstruir mutaciones consolidadas
        let mut grouped: std::collections::HashMap<String, (String, Vec<FieldMutation>)> = std::collections::HashMap::new();

        for row in records {
            let entry = grouped
                .entry(row.entity_id.clone())
                .or_insert_with(|| (row.entity_type.clone(), Vec::new()));

            entry.1.push(FieldMutation {
                field_name: row.field_name,
                value_json: row.field_value,
                timestamp: Some(HlcTimestamp {
                    wall_time: row.wall_time as u64,
                    counter: row.counter as u32,
                    node_id: row.node_id,
                }),
            });
        }

        let mut snapshot_deltas = Vec::new();
        for (entity_id, (entity_type, fields)) in grouped {
            snapshot_deltas.push(MutationOp {
                mutation_id: format!("snapshot-{}", entity_id),
                entity_id,
                entity_type,
                op_type: OperationType::Update as i32,
                fields,
                timestamp: None,
            });
        }

        Ok(snapshot_deltas)
    }
}
