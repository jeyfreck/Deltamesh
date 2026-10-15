#![allow(dead_code)]
use sqlx::PgPool;

use crate::proto::Mutation;

/// Idempotent insert: returns true if the mutation was new.
pub async fn insert_mutation(pool: &PgPool, m: &Mutation) -> Result<bool, sqlx::Error> {
    let hlc = m.hlc.clone().unwrap_or_default();
    let res = sqlx::query(
        "INSERT INTO mutations (id, entity_id, field, value, hlc_physical, hlc_logical, hlc_node)
         VALUES ($1,$2,$3,$4,$5,$6,$7) ON CONFLICT (id) DO NOTHING",
    )
    .bind(&m.id)
    .bind(&m.entity_id)
    .bind(&m.field)
    .bind(&m.value)
    .bind(hlc.physical as i64)
    .bind(hlc.logical as i32)
    .bind(&hlc.node_id)
    .execute(pool)
    .await?;
    Ok(res.rows_affected() > 0)
}
