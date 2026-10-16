mod proto;

use proto::sync::{ClientSyncRequest, MutationOp, HlcTimestamp};

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
}
