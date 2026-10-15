pub mod session;
pub mod ws;

use axum::{routing::get, Router};

pub fn router() -> Router {
    Router::new().route("/ws", get(ws::ws_handler))
}
