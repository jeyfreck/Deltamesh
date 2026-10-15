CREATE TABLE IF NOT EXISTS mutations (
    id          TEXT PRIMARY KEY,
    entity_id   TEXT NOT NULL,
    field       TEXT NOT NULL,
    value       TEXT NOT NULL,
    hlc_physical BIGINT NOT NULL,
    hlc_logical  INTEGER NOT NULL,
    hlc_node     TEXT NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_mutations_hlc ON mutations (hlc_physical, hlc_logical);
