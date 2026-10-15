use std::time::{SystemTime, UNIX_EPOCH};

/// Hybrid Logical Clock timestamp. Ordering: physical, logical, node_id.
#[derive(Debug, Clone, PartialEq, Eq, PartialOrd, Ord)]
pub struct Hlc {
    pub physical: u64,
    pub logical: u32,
    pub node_id: String,
}

fn now_ms() -> u64 {
    SystemTime::now().duration_since(UNIX_EPOCH).unwrap().as_millis() as u64
}

impl Hlc {
    pub fn new(node_id: impl Into<String>) -> Self {
        Self { physical: now_ms(), logical: 0, node_id: node_id.into() }
    }

    /// Local event / send.
    pub fn tick(&mut self) -> Hlc {
        let now = now_ms();
        if now > self.physical {
            self.physical = now;
            self.logical = 0;
        } else {
            self.logical += 1;
        }
        self.clone()
    }

    /// Receive a remote timestamp.
    pub fn recv(&mut self, remote: &Hlc) -> Hlc {
        let now = now_ms();
        let max_p = now.max(self.physical).max(remote.physical);
        self.logical = if max_p == self.physical && max_p == remote.physical {
            self.logical.max(remote.logical) + 1
        } else if max_p == self.physical {
            self.logical + 1
        } else if max_p == remote.physical {
            remote.logical + 1
        } else {
            0
        };
        self.physical = max_p;
        self.clone()
    }
}
