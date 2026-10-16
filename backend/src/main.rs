mod proto;
mod crdt;

use crdt::hlc::HybridClock;

#[tokio::main]
async fn main() {
    println!("Deltamesh backend inicializado.");

    let mut clock = HybridClock::new("server-core");
    let initial_ts = clock.send();

    println!(
        "Reloj HLC inicializado: [wall_time={}, counter={}, node={}]",
        initial_ts.wall_time, initial_ts.counter, initial_ts.node_id
    );
}
