mod config;
mod crdt;
mod proto;
mod server;
mod storage;

#[tokio::main]
async fn main() {
    let cfg = config::Config::from_env();
    let app = server::router();
    let listener = tokio::net::TcpListener::bind(&cfg.bind_addr).await.unwrap();
    println!("DeltaMesh listening on {}", cfg.bind_addr);
    axum::serve(listener, app).await.unwrap();
}
