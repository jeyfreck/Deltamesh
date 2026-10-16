mod proto;
mod crdt;
mod storage;
mod server;

use axum::{routing::get, Router};
use sqlx::postgres::PgPoolOptions;
use std::{env, sync::Arc};
use tokio::net::TcpListener;
use tower_http::cors::CorsLayer;

use server::ws::{ws_handler, AppState};
use storage::postgres::PostgresStorage;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let _ = dotenvy::dotenv();

    println!("Iniciando Deltamesh Backend...");

    let database_url = env::var("DATABASE_URL")
        .unwrap_or_else(|_| "postgres://dev_user:dev_password@localhost:5432/deltamesh_db".to_string());

    let pool = PgPoolOptions::new()
        .max_connections(10)
        .connect(&database_url)
        .await?;

    println!("Conexión a PostgreSQL establecida.");

    sqlx::migrate!("./migrations")
        .run(&pool)
        .await?;

    println!("Migraciones ejecutadas exitosamente.");

    let storage = Arc::new(PostgresStorage::new(pool));
    let state = AppState { storage };

    // Configuración de rutas y middlewares
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
