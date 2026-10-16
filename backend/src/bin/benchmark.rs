use backend::proto::sync::{
    ClientSyncRequest, FieldMutation, HlcTimestamp, MutationOp, OperationType, ServerSyncResponse,
};
use futures_util::{SinkExt, StreamExt};
use prost::Message as ProstMessage;
use std::sync::atomic::{AtomicUsize, Ordering};
use std::sync::Arc;
use std::time::{Duration, Instant, SystemTime, UNIX_EPOCH};
use tokio_tungstenite::connect_async;
use tokio_tungstenite::tungstenite::protocol::Message;
use uuid::Uuid;

// Parámetros de carga
const CONCURRENT_CLIENTS: usize = 50;   // Conexiones WebSocket simultáneas
const BATCHES_PER_CLIENT: usize = 40;   // Ráfagas por cliente
const MUTATIONS_PER_BATCH: usize = 25;  // Mutaciones empaquetadas por paquete Protobuf
const TARGET_WS_URL: &str = "ws://127.0.0.1:3000/ws";

#[derive(Debug)]
#[allow(dead_code)]
struct BatchMetric {
    duration: Duration,
    mutations_count: usize,
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let total_expected_mutations = CONCURRENT_CLIENTS * BATCHES_PER_CLIENT * MUTATIONS_PER_BATCH;
    println!("============================================================");
    println!("     DELTAMESH STRESS TEST & THROUGHPUT BENCHMARK           ");
    println!("============================================================");
    println!("Destino:               {}", TARGET_WS_URL);
    println!("Clientes concurrentes: {}", CONCURRENT_CLIENTS);
    println!("Batches por cliente:   {}", BATCHES_PER_CLIENT);
    println!("Mutaciones por batch:  {}", MUTATIONS_PER_BATCH);
    println!("Total de operaciones:  {}", total_expected_mutations);
    println!("------------------------------------------------------------\n");

    let successful_mutations = Arc::new(AtomicUsize::new(0));
    let start_total = Instant::now();
    let mut handles = Vec::with_capacity(CONCURRENT_CLIENTS);

    for client_idx in 0..CONCURRENT_CLIENTS {
        let counter_ref = Arc::clone(&successful_mutations);

        let handle = tokio::spawn(async move {
            let mut client_latencies: Vec<Duration> = Vec::with_capacity(BATCHES_PER_CLIENT);

            // 1. Conexión WebSocket
            let (ws_stream, _) = match connect_async(TARGET_WS_URL).await {
                Ok(conn) => conn,
                Err(e) => {
                    eprintln!("[Cliente #{}] Error de conexión: {:?}", client_idx, e);
                    return client_latencies;
                }
            };

            let (mut write, mut read) = ws_stream.split();
            let node_id = format!("bench-node-{:03}", client_idx);

            // 2. Envío en ráfaga de batches Protobuf
            for batch_seq in 0..BATCHES_PER_CLIENT {
                let mut ops = Vec::with_capacity(MUTATIONS_PER_BATCH);
                let now_ms = SystemTime::now()
                    .duration_since(UNIX_EPOCH)
                    .unwrap()
                    .as_millis() as u64;

                for mut_seq in 0..MUTATIONS_PER_BATCH {
                    let mutation_id = Uuid::new_v4().to_string();
                    let task_id = format!("task-{}-{}", client_idx, mut_seq);

                    let ts = HlcTimestamp {
                        wall_time: now_ms,
                        counter: (batch_seq * MUTATIONS_PER_BATCH + mut_seq) as u32,
                        node_id: node_id.clone(),
                    };

                    ops.push(MutationOp {
                        mutation_id,
                        entity_id: task_id,
                        entity_type: "task".to_string(),
                        op_type: OperationType::Update as i32,
                        fields: vec![FieldMutation {
                            field_name: "status".to_string(),
                            value_json: "\"IN_PROGRESS\"".to_string(),
                            timestamp: Some(ts.clone()),
                        }],
                        timestamp: Some(ts),
                    });
                }

                let req = ClientSyncRequest {
                    client_id: node_id.clone(),
                    pending_mutations: ops,
                    last_synced_timestamp: None,
                };

                let mut out_buffer = Vec::new();
                req.encode(&mut out_buffer).unwrap();

                let batch_start = Instant::now();

                // Enviar tramas binarias
                if write.send(Message::Binary(out_buffer.into())).await.is_err() {
                    break;
                }

                // Esperar ACK desde Rust
                if let Some(Ok(Message::Binary(in_buffer))) = read.next().await {
                    if let Ok(res) = ServerSyncResponse::decode(&in_buffer[..]) {
                        let ack_count = res.acknowledged_mutation_ids.len();
                        counter_ref.fetch_add(ack_count, Ordering::Relaxed);
                        client_latencies.push(batch_start.elapsed());
                    }
                }
            }

            client_latencies
        });

        handles.push(handle);
    }

    // Esperar finalización de todos los clientes concurrentes
    let mut all_latencies = Vec::new();
    for handle in handles {
        if let Ok(mut latencies) = handle.await {
            all_latencies.append(&mut latencies);
        }
    }

    let elapsed_total = start_total.elapsed();
    let total_applied = successful_mutations.load(Ordering::SeqCst);

    // ------------------------------------------------------------
    // Reporte de Rendimiento y Percentiles
    // ------------------------------------------------------------
    all_latencies.sort();
    let total_batches = all_latencies.len();

    let p50 = all_latencies.get(total_batches * 50 / 100).copied().unwrap_or_default();
    let p95 = all_latencies.get(total_batches * 95 / 100).copied().unwrap_or_default();
    let p99 = all_latencies.get(total_batches * 99 / 100).copied().unwrap_or_default();
    let avg_ms = if total_batches > 0 {
        all_latencies.iter().map(|d| d.as_secs_f64() * 1000.0).sum::<f64>() / total_batches as f64
    } else {
        0.0
    };

    let throughput_ops_sec = total_applied as f64 / elapsed_total.as_secs_f64();

    println!("\n=================== RESULTADOS DEL BENCHMARK ===================");
    println!("Operaciones exitosas:  {}/{}", total_applied, total_expected_mutations);
    println!("Tiempo total:          {:.3} segundos", elapsed_total.as_secs_f64());
    println!("THROUGHPUT:            {:.2} ops/segundo (mutaciones/seg)", throughput_ops_sec);
    println!("------------------- LATENCIA ROUND-TRIP (RTT) ------------------");
    println!("Promedio por batch:    {:.2} ms", avg_ms);
    println!("Percentil 50 (p50):    {:.2} ms", p50.as_secs_f64() * 1000.0);
    println!("Percentil 95 (p95):    {:.2} ms", p95.as_secs_f64() * 1000.0);
    println!("Percentil 99 (p99):    {:.2} ms", p99.as_secs_f64() * 1000.0);
    println!("================================================================");

    Ok(())
}
