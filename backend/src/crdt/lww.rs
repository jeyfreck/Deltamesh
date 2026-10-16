use std::collections::HashMap;
use crate::crdt::hlc::Timestamp;
use crate::proto::sync::{MutationOp, OperationType};

/// Estado de un campo individual gestionado por LWW
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct LwwField {
    pub value: String,
    pub timestamp: Timestamp,
}

/// Entidad reactiva compuesta por un mapa de campos independientes
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct LwwEntity {
    pub id: String,
    pub entity_type: String,
    pub fields: HashMap<String, LwwField>,
    pub is_deleted: bool,
    pub deleted_at: Option<Timestamp>,
}

impl LwwEntity {
    pub fn new(id: impl Into<String>, entity_type: impl Into<String>) -> Self {
        Self {
            id: id.into(),
            entity_type: entity_type.into(),
            fields: HashMap::new(),
            is_deleted: false,
            deleted_at: None,
        }
    }

    /// Intenta aplicar una mutación sobre un campo específico.
    /// Retorna `true` si el cambio ganó y se aplicó, o `false` si era obsoleto.
    pub fn set_field(&mut self, field_name: String, value: String, timestamp: Timestamp) -> bool {
        // Si la entidad fue eliminada con un timestamp posterior a esta mutación, se ignora
        if let Some(ref del_ts) = self.deleted_at {
            if del_ts >= &timestamp {
                return false;
            }
        }

        match self.fields.get(&field_name) {
            Some(existing) if &existing.timestamp >= &timestamp => {
                // El campo existente es más reciente o empató ganando
                false
            }
            _ => {
                self.fields.insert(field_name, LwwField { value, timestamp });
                true
            }
        }
    }

    /// Marca la entidad como eliminada mediante un tombstone LWW
    pub fn mark_deleted(&mut self, timestamp: Timestamp) -> bool {
        match &self.deleted_at {
            Some(existing_ts) if existing_ts >= &timestamp => false,
            _ => {
                self.is_deleted = true;
                self.deleted_at = Some(timestamp);
                true
            }
        }
    }

    /// Aplica una operación de mutación completa generada por Protocol Buffers
    pub fn apply_mutation_op(&mut self, op: &MutationOp) -> Vec<String> {
        let mut modified_fields = Vec::new();

        if op.op_type == OperationType::Delete as i32 {
            if let Some(proto_ts) = &op.timestamp {
                let ts = Timestamp::from(proto_ts.clone());
                if self.mark_deleted(ts) {
                    modified_fields.push("__deleted__".to_string());
                }
            }
            return modified_fields;
        }

        for field_mut in &op.fields {
            if let Some(proto_ts) = &field_mut.timestamp {
                let ts = Timestamp::from(proto_ts.clone());
                if self.set_field(field_mut.field_name.clone(), field_mut.value_json.clone(), ts) {
                    modified_fields.push(field_mut.field_name.clone());
                }
            }
        }

        modified_fields
    }

    pub fn get(&self, field_name: &str) -> Option<&str> {
        if self.is_deleted {
            return None;
        }
        self.fields.get(field_name).map(|f| f.value.as_str())
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_concurrent_independent_fields_merge_cleanly() {
        let mut task = LwwEntity::new("task-101", "task");

        let ts_user_a = Timestamp {
            wall_time: 1000,
            counter: 0,
            node_id: "user-a".to_string(),
        };

        let ts_user_b = Timestamp {
            wall_time: 1002,
            counter: 0,
            node_id: "user-b".to_string(),
        };

        // Usuario A cambia el título
        assert!(task.set_field("title".into(), "\"Diseñar arquitectura\"".into(), ts_user_a));
        // Usuario B cambia el estado en paralelo
        assert!(task.set_field("status".into(), "\"IN_PROGRESS\"".into(), ts_user_b));

        // Ambos cambios deben coexistir sin pisarse
        assert_eq!(task.get("title"), Some("\"Diseñar arquitectura\""));
        assert_eq!(task.get("status"), Some("\"IN_PROGRESS\""));
    }

    #[test]
    fn test_same_field_conflict_favors_higher_timestamp() {
        let mut task = LwwEntity::new("task-102", "task");

        let older_ts = Timestamp {
            wall_time: 2000,
            counter: 1,
            node_id: "client-1".to_string(),
        };

        let newer_ts = Timestamp {
            wall_time: 2000,
            counter: 2,
            node_id: "client-2".to_string(),
        };

        // Se aplica primero el cambio más reciente
        assert!(task.set_field("status".into(), "\"DONE\"".into(), newer_ts));

        // Llega con retraso por la red el cambio más viejo
        let applied = task.set_field("status".into(), "\"TODO\"".into(), older_ts);

        assert!(!applied, "La mutación vieja no debe sobreescribir la reciente");
        assert_eq!(task.get("status"), Some("\"DONE\""));
    }

    #[test]
    fn test_deterministic_tie_breaker_on_exact_collision() {
        let mut task = LwwEntity::new("task-103", "task");

        // Mismo wall_time y mismo counter; desempata node_id alfabéticamente
        let ts_client_a = Timestamp {
            wall_time: 3000,
            counter: 0,
            node_id: "client-a".to_string(),
        };

        let ts_client_z = Timestamp {
            wall_time: 3000,
            counter: 0,
            node_id: "client-z".to_string(),
        };

        task.set_field("assignee".into(), "\"Alice\"".into(), ts_client_a);
        let applied = task.set_field("assignee".into(), "\"Zoe\"".into(), ts_client_z);

        assert!(applied, "client-z debe ganar a client-a en caso de colisión idéntica");
        assert_eq!(task.get("assignee"), Some("\"Zoe\""));
    }

    #[test]
    fn test_tombstone_deletion_masks_data() {
        let mut task = LwwEntity::new("task-104", "task");

        let create_ts = Timestamp {
            wall_time: 4000,
            counter: 0,
            node_id: "node-1".to_string(),
        };

        let delete_ts = Timestamp {
            wall_time: 4010,
            counter: 0,
            node_id: "node-1".to_string(),
        };

        task.set_field("title".into(), "\"Tarea a borrar\"".into(), create_ts);
        assert_eq!(task.get("title"), Some("\"Tarea a borrar\""));

        assert!(task.mark_deleted(delete_ts));
        assert!(task.is_deleted);
        assert_eq!(task.get("title"), None, "Una entidad eliminada no debe retornar campos");
    }
}

