mod proto;
mod crdt;
mod storage;
mod server;

use axum::{routing::get, Router};
use sqlx::postgres::PgPoolOptions;
use std::{env, sync::Arc};
use tokio::net::TcpListener;
use tokio::sync::broadcast;
use tower_http::cors::CorsLayer;

use server::ws::{ws_handler, AppState};
use storage::{postgres::PostgresStorage, redis_pubsub::RedisBroadcaster};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let _ = dotenvy::dotenv();

    println!("Iniciando Deltamesh Backend...");

    let database_url = env::var("DATABASE_URL")
        .unwrap_or_else(|_| "postgres://dev_user:dev_password@localhost:5432/deltamesh_db".to_string());

    let redis_url = env::var("REDIS_URL")
        .unwrap_or_else(|_| "redis://127.0.0.1:6379".to_string());

    // 1. PostgreSQL y Migraciones
    let pool = PgPoolOptions::new()
        .max_connections(50)
        .acquire_timeout(std::time::Duration::from_secs(60))
        .connect(&database_url)
        .await?;
    println!("Conexión a PostgreSQL establecida.");

    sqlx::migrate!("./migrations").run(&pool).await?;
    println!("Migraciones SQL verificadas.");

    // 2. Redis Pub/Sub y Broadcast local
    let redis_client = redis::Client::open(redis_url)?;
    let (broadcast_tx, _) = broadcast::channel(1024);
    let broadcaster = RedisBroadcaster::new(redis_client, broadcast_tx).await?;
    println!("Conexión a Redis Pub/Sub inicializada.");

    let state = AppState {
        storage: Arc::new(PostgresStorage::new(pool)),
        broadcaster: Arc::new(broadcaster),
    };

    // 3. Servidor Web y WebSocket
    let app = Router::new()
        .route("/ws", get(ws_handler))
        .layer(CorsLayer::permissive())
        .with_state(state);

    let host = "0.0.0.0:3000";
    let listener = TcpListener::bind(host).await?;
    println!("Servidor Deltamesh escuchando en ws://{}", host);

    axum::serve(listener, app).await?;

    Ok(())
}
