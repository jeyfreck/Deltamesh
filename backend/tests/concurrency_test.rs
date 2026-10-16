use backend::crdt::hlc::Timestamp;
use backend::crdt::lww::LwwEntity;
use backend::proto::sync::{FieldMutation, HlcTimestamp, MutationOp, OperationType};
use rand::seq::SliceRandom;
use rand::thread_rng;
use std::sync::Arc;
use tokio::sync::RwLock;

/// Construye una mutación simulada de un cliente desconectado
fn build_mutation(
    mutation_id: &str,
    task_id: &str,
    new_status: &str,
    wall_time: u64,
    counter: u32,
    node_id: &str,
) -> MutationOp {
    let ts = HlcTimestamp {
        wall_time,
        counter,
        node_id: node_id.to_string(),
    };

    MutationOp {
        mutation_id: mutation_id.to_string(),
        entity_id: task_id.to_string(),
        entity_type: "task".to_string(),
        op_type: OperationType::Update as i32,
        fields: vec![FieldMutation {
            field_name: "status".to_string(),
            value_json: format!("\"{}\"", new_status),
            timestamp: Some(ts.clone()),
        }],
        timestamp: Some(ts),
    }
}

#[tokio::test]
async fn test_100_concurrent_offline_clients_deterministic_convergence() {
    const CLIENT_COUNT: usize = 100;
    let target_task_id = "task-distributed-kanban-42";

    // 1. Generar 100 mutaciones de clientes con variaciones de tiempo y reloj lógico
    let mut mutations: Vec<MutationOp> = Vec::with_capacity(CLIENT_COUNT);

    for i in 0..CLIENT_COUNT {
        // Simular drift de reloj físico (entre 10000ms y 10050ms)
        let wall_time = 10_000 + ((i % 10) as u64 * 5);
        // Generar contadores con colisiones forzadas
        let counter = (i / 10) as u32;
        let node_id = format!("node-{:03}", i);
        let status_value = format!("STATUS_FROM_CLIENT_{:03}", i);

        let mutation = build_mutation(
            &format!("mut-uuid-{:04}", i),
            target_task_id,
            &status_value,
            wall_time,
            counter,
            &node_id,
        );
        mutations.push(mutation);
    }

    // 2. Determinar analíticamente el ganador matemático absoluto
    let winning_mutation = mutations
        .iter()
        .max_by(|a, b| {
            let ts_a: Timestamp = a.timestamp.as_ref().unwrap().clone().into();
            let ts_b: Timestamp = b.timestamp.as_ref().unwrap().clone().into();
            ts_a.cmp(&ts_b)
        })
        .expect("La lista de mutaciones no puede estar vacía");

    let expected_winner_status = winning_mutation.fields[0].value_json.clone();
    let winning_ts: Timestamp = winning_mutation.timestamp.as_ref().unwrap().clone().into();

    println!(
        "\n[Test] Ganador matemático esperado -> Nodo: {}, WallTime: {}, Counter: {}, Valor: {}",
        winning_ts.node_id, winning_ts.wall_time, winning_ts.counter, expected_winner_status
    );

    // -------------------------------------------------------------------------
    // TEST PARTE A: Concurrencia Asíncrona Extrema con Tokio Tasks
    // -------------------------------------------------------------------------
    let shared_entity = Arc::new(RwLock::new(LwwEntity::new(target_task_id, "task")));
    let mut handles = Vec::with_capacity(CLIENT_COUNT);

    for op in mutations.clone() {
        let entity_ref = Arc::clone(&shared_entity);
        let handle = tokio::spawn(async move {
            let mut lock = entity_ref.write().await;
            lock.apply_mutation_op(&op);
        });
        handles.push(handle);
    }

    // Esperar que las 100 tareas concurrentes finalicen
    for handle in handles {
        handle.await.expect("La tarea tokio falló");
    }

    let final_concurrent_state = shared_entity.read().await;
    let actual_concurrent_status = final_concurrent_state
        .get("status")
        .expect("El campo status debe existir");

    assert_eq!(
        actual_concurrent_status, expected_winner_status,
        "Fallo bajo concurrencia: el valor final no coincide con el ganador LWW-HLC"
    );

    // -------------------------------------------------------------------------
    // TEST PARTE B: Conmutatividad Estricta (50 permutaciones de llegada)
    // -------------------------------------------------------------------------
    const PERMUTATIONS: usize = 50;
    let mut rng = thread_rng();

    for perm_idx in 0..PERMUTATIONS {
        let mut shuffled_ops = mutations.clone();
        shuffled_ops.shuffle(&mut rng);

        let mut replica = LwwEntity::new(target_task_id, "task");
        for op in &shuffled_ops {
            replica.apply_mutation_op(op);
        }

        let replica_status = replica.get("status").expect("Campo ausente");
        assert_eq!(
            replica_status, expected_winner_status,
            "Violación de convergencia en permutación #{}: el orden de llegada alteró el resultado",
            perm_idx
        );
    }

    println!("[Test] Verificadas exitosamente las 50 permutaciones aleatorias: Convergencia matemática demostrada.");
}
