#![allow(dead_code)]
use std::collections::HashMap;

/// Tracks connected clients (client_id -> sender channel to be added).
#[derive(Default)]
pub struct Sessions {
    pub clients: HashMap<String, ()>,
}
