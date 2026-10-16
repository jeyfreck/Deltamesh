#![allow(dead_code)]
use sqlx::PgPool;

use crate::proto::sync::MutationOp;

/// Idempotent insert: one row per field mutation, keyed by "<mutation_id>:<field_name>".
/// Returns true if at least one row was new.
pub async fn insert_mutation(pool: &PgPool, m: &MutationOp) -> Result<bool, sqlx::Error> {
    let mut inserted = false;
    for f in &m.fields {
        let hlc = f.timestamp.clone().or_else(|| m.timestamp.clone()).unwrap_or_default();
        let res = sqlx::query(
            "INSERT INTO mutations (id, entity_id, field, value, hlc_physical, hlc_logical, hlc_node)
             VALUES ($1,$2,$3,$4,$5,$6,$7) ON CONFLICT (id) DO NOTHING",
        )
        .bind(format!("{}:{}", m.mutation_id, f.field_name))
        .bind(&m.entity_id)
        .bind(&f.field_name)
        .bind(&f.value_json)
        .bind(hlc.wall_time as i64)
        .bind(hlc.counter as i32)
        .bind(&hlc.node_id)
        .execute(pool)
        .await?;
        inserted |= res.rows_affected() > 0;
    }
    Ok(inserted)
}
