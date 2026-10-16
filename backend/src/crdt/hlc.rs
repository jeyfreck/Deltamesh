use std::cmp::{max, Ordering};
use std::time::{SystemTime, UNIX_EPOCH};
use crate::proto::sync::HlcTimestamp;

/// Estructura inmutable de marca de tiempo HLC lista para comparaciones deterministas
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct Timestamp {
    pub wall_time: u64,
    pub counter: u32,
    pub node_id: String,
}

impl Ord for Timestamp {
    fn cmp(&self, other: &Self) -> Ordering {
        // Orden total estricto: tiempo físico -> contador lógico -> identificador de nodo
        self.wall_time
            .cmp(&other.wall_time)
            .then_with(|| self.counter.cmp(&other.counter))
            .then_with(|| self.node_id.cmp(&other.node_id))
    }
}

impl PartialOrd for Timestamp {
    fn partial_cmp(&self, other: &Self) -> Option<Ordering> {
        Some(self.cmp(other))
    }
}

// Conversiones transparentes con las estructuras Protobuf generadas
impl From<HlcTimestamp> for Timestamp {
    fn from(proto: HlcTimestamp) -> Self {
        Self {
            wall_time: proto.wall_time,
            counter: proto.counter,
            node_id: proto.node_id,
        }
    }
}

impl From<Timestamp> for HlcTimestamp {
    fn from(ts: Timestamp) -> Self {
        Self {
            wall_time: ts.wall_time,
            counter: ts.counter,
            node_id: ts.node_id,
        }
    }
}

/// Estado mutable del reloj HLC por nodo o réplica
#[derive(Debug)]
pub struct HybridClock {
    node_id: String,
    latest: Timestamp,
}

impl HybridClock {
    pub fn new(node_id: impl Into<String>) -> Self {
        let node_id = node_id.into();
        let now = Self::system_time_ms();
        Self {
            latest: Timestamp {
                wall_time: now,
                counter: 0,
                node_id: node_id.clone(),
            },
            node_id,
        }
    }

    /// Retorna los milisegundos Unix actuales del sistema
    fn system_time_ms() -> u64 {
        SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .expect("El reloj del sistema retrocedió")
            .as_millis() as u64
    }

    /// Genera una nueva marca temporal para una mutación local (evento Send)
    pub fn send(&mut self) -> Timestamp {
        let pt = Self::system_time_ms();
        self.send_with_time(pt)
    }

    /// Actualiza el reloj local al recibir un mensaje remoto (evento Receive)
    pub fn receive(&mut self, remote: &Timestamp) -> Timestamp {
        let pt = Self::system_time_ms();
        self.receive_with_time(remote, pt)
    }

    /// Método interno con inyección de tiempo para pruebas unitarias deterministas
    pub(crate) fn send_with_time(&mut self, physical_time: u64) -> Timestamp {
        if physical_time > self.latest.wall_time {
            self.latest.wall_time = physical_time;
            self.latest.counter = 0;
        } else {
            self.latest.counter += 1;
        }

        self.latest.clone()
    }

    /// Método interno con inyección de tiempo para pruebas unitarias deterministas
    pub(crate) fn receive_with_time(&mut self, remote: &Timestamp, physical_time: u64) -> Timestamp {
        let max_wall = max(self.latest.wall_time, max(remote.wall_time, physical_time));

        if max_wall == self.latest.wall_time && max_wall == remote.wall_time {
            self.latest.counter = max(self.latest.counter, remote.counter) + 1;
        } else if max_wall == self.latest.wall_time {
            self.latest.counter += 1;
        } else if max_wall == remote.wall_time {
            self.latest.counter = remote.counter + 1;
        } else {
            self.latest.counter = 0;
        }

        self.latest.wall_time = max_wall;
        self.latest.clone()
    }

    pub fn current(&self) -> &Timestamp {
        &self.latest
    }
}
