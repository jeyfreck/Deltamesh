use axum::{
    extract::{
        ws::{Message, WebSocket, WebSocketUpgrade},
        State,
    },
    response::IntoResponse,
};
use prost::Message as ProstMessage;
use std::sync::Arc;
use crate::{
    proto::sync::{ClientSyncRequest, ServerSyncResponse},
    storage::postgres::PostgresStorage,
};

#[derive(Clone)]
pub struct AppState {
    pub storage: Arc<PostgresStorage>,
}

pub async fn ws_handler(
    ws: WebSocketUpgrade,
    State(state): State<AppState>,
) -> impl IntoResponse {
    ws.on_upgrade(move |socket| handle_socket(socket, state))
}

async fn handle_socket(mut socket: WebSocket, state: AppState) {
    println!("[WS] Nueva conexión entrante.");

    while let Some(Ok(msg)) = socket.recv().await {
        match msg {
            Message::Binary(bin_data) => {
                // Decodificación directa del buffer binario con prost
                match ClientSyncRequest::decode(&bin_data[..]) {
                    Ok(request) => {
                        let response = process_sync_request(request, &state.storage).await;

                        let mut out_buffer = Vec::new();
                        if let Err(e) = response.encode(&mut out_buffer) {
                            eprintln!("[WS] Error al serializar ServerSyncResponse: {:?}", e);
                            continue;
                        }

                        if socket.send(Message::Binary(out_buffer)).await.is_err() {
                            eprintln!("[WS] Cliente desconectado abruptamente durante el envío.");
                            break;
                        }
                    }
                    Err(e) => {
                        eprintln!("[WS] Paquete Protobuf inválido o corrupto: {:?}", e);
                    }
                }
            }
            Message::Close(_) => {
                println!("[WS] El cliente cerró la sesión.");
                break;
            }
            Message::Ping(payload) => {
                if socket.send(Message::Pong(payload)).await.is_err() {
                    break;
                }
            }
            _ => {
                // Ignorar tramas de texto; el protocolo opera exclusivamente en binario
            }
        }
    }

    println!("[WS] Sesión terminada.");
}

async fn process_sync_request(
    request: ClientSyncRequest,
    storage: &PostgresStorage,
) -> ServerSyncResponse {
    let mut acked_ids = Vec::with_capacity(request.pending_mutations.len());

    for mutation in request.pending_mutations {
        let mutation_id = mutation.mutation_id.clone();
        
        match storage.apply_mutation(&mutation).await {
            Ok(result) => {
                // La mutación se confirma tanto si aplicó cambios nuevos como si ya era idempotente
                acked_ids.push(mutation_id);
                println!(
                    "[Sync] Mutación {:?} confirmada. Resultado: {:?}",
                    mutation.mutation_id, result
                );
            }
            Err(e) => {
                eprintln!(
                    "[Sync] Error procesando mutación {:?}: {:?}",
                    mutation_id, e
                );
            }
        }
    }

    ServerSyncResponse {
        acknowledged_mutation_ids: acked_ids,
        applied_deltas: Vec::new(), // Se poblará con Redis Pub/Sub en la siguiente fase
    }
}
