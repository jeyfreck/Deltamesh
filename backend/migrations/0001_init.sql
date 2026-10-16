-- 1. Registro de Idempotencia: previene reprocesar mutaciones duplicadas
CREATE TABLE IF NOT EXISTS processed_mutations (
    mutation_id UUID PRIMARY KEY,
    entity_id TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Almacén de Campos LWW: resuelve concurrencia atributo por atributo
CREATE TABLE IF NOT EXISTS entity_fields (
    entity_id TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    field_name TEXT NOT NULL,
    field_value TEXT NOT NULL,
    wall_time BIGINT NOT NULL,
    counter INT NOT NULL,
    node_id TEXT NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (entity_id, field_name)
);

-- Índice para consultas rápidas por entidad
CREATE INDEX IF NOT EXISTS idx_entity_fields_lookup 
ON entity_fields (entity_id, entity_type);
