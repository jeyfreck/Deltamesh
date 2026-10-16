use super::hlc::Timestamp;

/// Last-Write-Wins register.
#[derive(Debug, Clone)]
pub struct Lww<T> {
    pub value: T,
    pub hlc: Timestamp,
}

impl<T: Clone> Lww<T> {
    pub fn new(value: T, hlc: Timestamp) -> Self {
        Self { value, hlc }
    }

    /// Merge: higher HLC wins (commutative, associative, idempotent).
    pub fn merge(&self, other: &Lww<T>) -> Lww<T> {
        if other.hlc > self.hlc { other.clone() } else { self.clone() }
    }
}
