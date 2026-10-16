mod proto;
mod crdt;
mod storage;
mod server;

use sqlx::postgres::PgPoolOptions;
use std::env;
use storage::postgres::PostgresStorage;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let _ = dotenvy::dotenv();

    println!("Iniciando Deltamesh Backend...");

    let database_url = env::var("DATABASE_URL")
        .unwrap_or_else(|_| "postgres://dev_user:dev_password@localhost:5432/deltamesh_db".to_string());

    // Crear pool de conexiones asíncronas
    let pool = PgPoolOptions::new()
        .max_connections(10)
        .connect(&database_url)
        .await?;

    println!("Conexión a PostgreSQL establecida.");

    // Aplicar migraciones SQL pendientes automáticamente
    sqlx::migrate!("./migrations")
        .run(&pool)
        .await?;

    println!("Migraciones de base de datos ejecutadas correctamente.");

    let _storage = PostgresStorage::new(pool);

    Ok(())
}
