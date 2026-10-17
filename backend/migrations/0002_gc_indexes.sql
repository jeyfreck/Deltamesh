-- backend/migrations/0002_gc_indexes.sql
CREATE INDEX IF NOT EXISTS idx_processed_mutations_applied_at 
ON processed_mutations (applied_at);
