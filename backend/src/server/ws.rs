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
    proto::sync::{ClientSyncRequest, MutationOp, ServerSyncResponse},
    storage::{postgres::{ApplyResult, PostgresStorage}, redis_pubsub::RedisBroadcaster},
};

#[derive(Clone)]
pub struct AppState {
    pub storage: Arc<PostgresStorage>,
    pub broadcaster: Arc<RedisBroadcaster>,
}

pub async fn ws_handler(
    ws: WebSocketUpgrade,
    State(state): State<AppState>,
) -> impl IntoResponse {
    ws.on_upgrade(move |socket| handle_socket(socket, state))
}

async fn handle_socket(mut socket: WebSocket, state: AppState) {
    println!("[WS] Nueva conexión activa.");
    let mut rx_broadcast = state.broadcaster.subscribe();

    loop {
        tokio::select! {
            // 1. Recepción de mensajes enviados por el cliente conectado
            incoming = socket.recv() => {
                match incoming {
                    Some(Ok(Message::Binary(bin_data))) => {
                        if let Ok(request) = ClientSyncRequest::decode(&bin_data[..]) {
                            let response = process_sync_request(
                                request, 
                                &state.storage, 
                                &state.broadcaster
                            ).await;

                            let mut out_buffer = Vec::new();
                            if response.encode(&mut out_buffer).is_ok() {
                                if socket.send(Message::Binary(out_buffer)).await.is_err() {
                                    break;
                                }
                            }
                        }
                    }
                    Some(Ok(Message::Ping(payload))) => {
                        if socket.send(Message::Pong(payload)).await.is_err() {
                            break;
                        }
                    }
                    Some(Ok(Message::Close(_))) | None => {
                        break;
                    }
                    _ => {}
                }
            }

            // 2. Retransmisión de deltas generados por otros clientes en tiempo real
            broadcast_msg = rx_broadcast.recv() => {
                if let Ok(mutation) = broadcast_msg {
                    let update_response = ServerSyncResponse {
                        acknowledged_mutation_ids: Vec::new(),
                        applied_deltas: vec![mutation],
                    };

                    let mut out_buffer = Vec::new();
                    if update_response.encode(&mut out_buffer).is_ok() {
                        if socket.send(Message::Binary(out_buffer)).await.is_err() {
                            break;
                        }
                    }
                }
            }
        }
    }

    println!("[WS] Conexión cerrada.");
}

async fn process_sync_request(
    request: ClientSyncRequest,
    storage: &PostgresStorage,
    broadcaster: &RedisBroadcaster,
) -> ServerSyncResponse {
    let mut acked_ids = Vec::with_capacity(request.pending_mutations.len());

    for mutation in request.pending_mutations {
        let mutation_id = mutation.mutation_id.clone();

        match storage.apply_mutation(&mutation).await {
            Ok(ApplyResult::Applied { fields_updated }) => {
                acked_ids.push(mutation_id);
                
                // Si la mutación ganó campos y alteró el estado, se propaga por Redis
                if fields_updated > 0 {
                    let _ = broadcaster.publish_delta(&mutation).await;
                }
            }
            Ok(ApplyResult::AlreadyProcessed) => {
                // Si ya fue procesada, confirmamos recepción pero no retransmitimos
                acked_ids.push(mutation_id);
            }
            Err(e) => {
                eprintln!("[Sync] Error aplicando mutación {:?}: {:?}", mutation_id, e);
            }
        }
    }

    ServerSyncResponse {
        acknowledged_mutation_ids: acked_ids,
        applied_deltas: Vec::new(),
    }
}
