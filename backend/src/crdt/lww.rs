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
