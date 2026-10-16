pub mod session;
pub mod ws;

use axum::{routing::get, Router};
use ws::AppState;

pub fn router(state: AppState) -> Router {
    Router::new()
        .route("/ws", get(ws::ws_handler))
        .with_state(state)
}
