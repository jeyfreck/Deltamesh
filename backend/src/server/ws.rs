use axum::{
    extract::ws::{Message, WebSocket, WebSocketUpgrade},
    response::IntoResponse,
};

pub async fn ws_handler(ws: WebSocketUpgrade) -> impl IntoResponse {
    ws.on_upgrade(handle_socket)
}

async fn handle_socket(mut socket: WebSocket) {
    while let Some(Ok(msg)) = socket.recv().await {
        // TODO: decode ClientMessage, persist, fan out.
        if let Message::Binary(data) = msg {
            if socket.send(Message::Binary(data)).await.is_err() {
                break;
            }
        }
    }
}
