mod crdt;
mod proto;

use crdt::hlc::HybridClock;
use proto::sync::{ClientSyncRequest, HlcTimestamp};

#[tokio::main]
async fn main() {
    println!("Deltamesh backend inicializado.");
    
    // Verificación de tipos generados
    let dummy_request = ClientSyncRequest {
        client_id: "client-test-1".to_string(),
        pending_mutations: vec![],
        last_synced_timestamp: Some(HlcTimestamp {
            wall_time: 1717000000000,
            counter: 0,
            node_id: "node-a".to_string(),
        }),
    };

    println!("Estructura protobuf enlazada: {:?}", dummy_request.client_id);

    // Verificación del reloj HLC
    let mut clock = HybridClock::new("node-server-1");
    let ts1 = clock.send();
    println!("HLC local generado: {:?}", ts1);
}
