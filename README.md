# DeltaMesh

<div align="center">

![DeltaMesh Banner](https://raw.githubusercontent.com/jeyfreck/Deltamesh/main/frontend/public/vite.svg)

**High-Throughput, Local-First Collaborative Synchronization Engine**  
*Powered by Rust, Hybrid Logical Clocks, Conflict-Free Replicated Data Types (CRDTs), and Binary Protobuf Streaming.*

[![Rust](https://img.shields.io/badge/Rust-1.80%2B-orange?logo=rust)](https://www.rust-lang.org/)
[![Tokio](https://img.shields.io/badge/Async-Tokio-blue?logo=tokio)](https://tokio.rs/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue?logo=postgresql)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Redis-7.x%20Pub%2FSub-red?logo=redis)](https://redis.io/)
[![React](https://img.shields.io/badge/React-18%20%2B%20TypeScript-61dafb?logo=react)](https://react.dev/)
[![Dexie](https://img.shields.io/badge/IndexedDB-Dexie.js-green)](https://dexie.org/)
[![Protocol Buffers](https://img.shields.io/badge/Protocol%20Buffers-v3-4285F4?logo=google)](https://protobuf.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Key Architectural Features](#key-architectural-features)
- [System Architecture](#system-architecture)
- [Conflict Resolution & CRDT Semantics](#conflict-resolution--crdt-semantics)
  - [Hybrid Logical Clock (HLC)](#1-hybrid-logical-clock-hlc)
  - [Field-Level Last-Write-Wins (LWW)](#2-field-level-last-write-wins-lww)
  - [Deterministic Mathematical Ordering](#3-deterministic-mathematical-ordering)
- [Protocol Buffers Schema](#protocol-buffers-schema)
- [Repository Structure](#repository-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [1. Backend Setup](#1-backend-setup)
  - [2. Frontend Setup](#2-frontend-setup)
- [Verification & Benchmarks](#verification--benchmarks)
  - [Concurrency & Commutativity Test (100 Clients)](#concurrency--commutativity-test-100-clients)
  - [Native Stress-Testing Benchmark (50,000 Ops)](#native-stress-testing-benchmark-50000-ops)
- [Production Hardening](#production-hardening)
  - [JWT Handshake Authentication](#jwt-handshake-authentication)
  - [Workspace Isolation](#workspace-isolation)
  - [Cold-Start State Snapshots](#cold-start-state-snapshots)
  - [Background Idempotency Garbage Collection](#background-idempotency-garbage-collection)
- [License](#license)

---

## Overview

**DeltaMesh** is a local-first, distributed real-time synchronization framework designed for high-concurrency collaborative applications (such as Notion, Linear, Figma, or multi-user Kanban systems). 

DeltaMesh completely decouples UI responsiveness from network availability:
1. **Zero-Latency Client Updates**: Every mutation is applied immediately to the client's local database (IndexedDB via Dexie) and rendered reactively at 0ms.
2. **Offline Mutation Queue & Auto-Reconnection**: Changes made while offline accumulate in a durable persistent queue and are automatically dispatched via WebSocket using exponential backoff with randomized jitter upon reconnect.
3. **Provable Convergence**: The Rust backend and browser clients resolve concurrent, out-of-order, or conflicting updates deterministically using field-level **Last-Write-Wins (LWW)** CRDTs governed by **Hybrid Logical Clocks (HLC)**.

---

## Key Architectural Features

- **🚀 Sub-Millisecond Event Pipeline**: Built on Axum 0.7 and Tokio async runtimes with zero garbage collection pauses.
- **⚡ Compact Protobuf Serialization**: Binary streaming using `prost` (Rust) and `protobufjs` (TypeScript), reducing wire payload sizes by up to 80% compared to JSON.
- **🕒 Monotonic Hybrid Logical Clocks**: Guarantees total causal ordering across distributed nodes with physical clock drift mitigation and counter-based tie-breakers.
- **🛡️ Atomic Database Upsert & Idempotency**: PostgreSQL transactions verify mutation IDs (`ON CONFLICT (mutation_id) DO NOTHING`) and execute attribute-level conditional updates.
- **📡 Multi-Node Pub/Sub**: Redis Pub/Sub fans out verified delta mutations to all connected server nodes and subscribers, segregated by `workspace_id`.
- **🔐 JWT WebSocket Handshake**: Extracted during initial HTTP handshake negotiation via URL query parameters (`?token=...`) or `Authorization: Bearer` headers.
- **📦 State Compaction & Snapshots**: Automated snapshot reconstruction from PostgreSQL `entity_fields` for instant cold-start state synchronization.
- **🧹 Background Garbage Collection**: Asynchronous Tokio background worker periodically purges idempotency tracking rows older than the retention threshold.

---

## System Architecture

```mermaid
graph TD
    subgraph Browser Client (Local-First)
        UI[React Kanban UI] -->|0ms Reactive Query| Dexie[(IndexedDB: Dexie)]
        UI -->|Generate Event| HLC_C[Client HLC]
        UI -->|Enqueue| Q[Mutation Queue]
        Q -->|Flush Protobuf Frame| WS_C[Sync Engine WebSocket]
    end

    WS_C <==>|Binary WebSocket (Protobuf)| WS_S[Axum WebSocket Handler]

    subgraph Backend Infrastructure (Rust)
        WS_S -->|Verify JWT| Auth[JWT Extractor]
        WS_S -->|Cold-Start Sync| Snap[State Snapshot Engine]
        WS_S -->|Apply Mutation| PG_Store[PostgreSQL Storage]
        
        subgraph PostgreSQL
            PG_Store -->|Atomic Check| PM[(processed_mutations)]
            PG_Store -->|LWW Conditional Upsert| EF[(entity_fields)]
        end

        PG_Store -->|On Winning Delta| R_Pub[RedisBroadcaster]
        R_Pub -->|Publish Delta to Workspace Channel| Redis[(Redis Pub/Sub)]
        Redis -->|Fanout Deltas| WS_S
    end
```

---

## Conflict Resolution & CRDT Semantics

### 1. Hybrid Logical Clock (HLC)
Physical wall clocks alone suffer from drift and NTP jumps. Logical Lamport clocks lack physical time correspondence. DeltaMesh uses **Hybrid Logical Clocks** representing timestamps as:

$$\text{Timestamp} = (\text{wall\_time}, \text{counter}, \text{node\_id})$$

- $\text{wall\_time}$: Monotonic milliseconds since Unix epoch (bounded against physical clock drift).
- $\text{counter}$: Incremented when successive events occur within the same millisecond or during clock rollbacks.
- $\text{node\_id}$: Unique machine or client identifier serving as a deterministic mathematical tie-breaker.

### 2. Field-Level Last-Write-Wins (LWW)
Rather than locking or overwriting entire documents/entities, DeltaMesh applies conflict resolution at the **field level**:
- Concurrent edits to disjoint attributes (e.g., Client A changes `title`, Client B changes `status`) merge seamlessly without conflict.
- Concurrent edits to the same attribute resolve deterministically to whichever timestamp is strictly greater according to total ordering.

### 3. Deterministic Mathematical Ordering
Given two timestamps $T_A = (w_A, c_A, n_A)$ and $T_B = (w_B, c_B, n_B)$:

$$T_A > T_B \iff (w_A > w_B) \lor (w_A = w_B \land c_A > c_B) \lor (w_A = w_B \land c_A = c_B \land n_A > n_B)$$

---

## Protocol Buffers Schema

The binary sync contract is defined in `proto/sync.proto`:

```protobuf
syntax = "proto3";

package sync;

message HlcTimestamp {
  uint64 wall_time = 1;
  uint32 counter = 2;
  string node_id = 3;
}

enum OperationType {
  INSERT = 0;
  UPDATE = 1;
  DELETE = 2;
}

message FieldMutation {
  string field_name = 1;
  string value_json = 2;
  HlcTimestamp timestamp = 3;
}

message MutationOp {
  string mutation_id = 1;
  string entity_id = 2;
  string entity_type = 3;
  OperationType op_type = 4;
  repeated FieldMutation fields = 5;
  HlcTimestamp timestamp = 6;
}

message ClientSyncRequest {
  string client_id = 1;
  repeated MutationOp pending_mutations = 2;
  HlcTimestamp last_synced_timestamp = 3;
}

message ServerSyncResponse {
  repeated string acknowledged_mutation_ids = 1;
  repeated MutationOp applied_deltas = 2;
}
```

---

## Repository Structure

```text
deltamesh/
├── proto/
│   └── sync.proto               # Shared binary schema definition
├── backend/
│   ├── Cargo.toml               # Rust dependencies (Axum, Tokio, SQLx, Redis, Prost)
│   ├── migrations/
│   │   ├── 0001_init.sql        # Tables: processed_mutations & entity_fields
│   │   └── 0002_gc_indexes.sql  # Index on applied_at for GC worker
│   ├── tests/
│   │   └── concurrency_test.rs  # Tokio 100-client extreme concurrency test
│   └── src/
│       ├── bin/
│       │   └── benchmark.rs     # Native 50,000-op async load generator
│       ├── crdt/
│       │   ├── hlc.rs           # Hybrid Logical Clock implementation & unit tests
│       │   └── lww.rs           # Last-Write-Wins entity engine & tombstones
│       ├── storage/
│       │   ├── postgres.rs      # SQL upserts, snapshots, & GC purge logic
│       │   └── redis_pubsub.rs  # Redis pub/sub isolated by workspace_id
│       ├── server/
│       │   ├── auth.rs          # JWT verification & AuthenticatedSession extractor
│       │   └── ws.rs            # Binary WebSocket multiplexer & streaming loop
│       ├── lib.rs               # Exported backend library targets
│       └── main.rs              # Axum server entry point & Tokio GC worker
└── frontend/
    ├── package.json             # Vite, React, Dexie, Tailwind CSS, ProtobufJS
    ├── tailwind.config.js       # Minimalist Notion/Linear dark theme
    └── src/
        ├── db/
        │   └── index.ts         # Dexie database (tasks, mutation_queue)
        ├── proto/
        │   ├── sync.js          # Compiled static Protobuf encoders/decoders
        │   └── sync.d.ts        # Generated TypeScript typings
        ├── sync/
        │   ├── hlc.ts           # Browser Hybrid Logical Clock generator
        │   └── engine.ts        # Sync engine with exponential backoff & jitter
        ├── App.tsx              # Reactive Kanban UI with telemetry badges
        └── index.css            # Typography & design system styles
```

---

## Getting Started

### Prerequisites

- **Rust**: `1.80+` (`cargo`, `rustc`)
- **Node.js**: `v18+` (`npm`)
- **PostgreSQL**: `14+`
- **Redis**: `5.0+` or `7.x`

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Configure environment variables in `backend/.env`:
   ```ini
   DATABASE_URL=postgresql://user:password@localhost:5432/deltamesh_db
   REDIS_URL=redis://127.0.0.1:6379
   JWT_SECRET=super_secret_jwt_key_123
   BIND_ADDR=0.0.0.0:3000
   ```

3. Run migrations and start the server:
   ```bash
   cargo run
   ```
   *The server will automatically apply pending SQL migrations and bind to `ws://0.0.0.0:3000/ws`.*

### 2. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. (Optional) Recompile Protobuf definitions from `proto/sync.proto`:
   ```bash
   npm run proto:generate
   ```

4. Launch the development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Verification & Benchmarks

### Concurrency & Commutativity Test (100 Clients)

To verify the mathematical correctness and order-independence of the CRDT implementation, DeltaMesh includes a strict integration test:
- **Part A (Extreme Concurrency)**: 100 parallel Tokio tasks acquire write locks concurrently to update the same entity.
- **Part B (Strict Commutativity)**: 50 randomized permutations of the 100 mutations are applied to independent replicas.

Run the test:
```bash
cd backend
cargo test --test concurrency_test -- --nocapture
```

**Output:**
```text
running 1 test

[Test] Expected mathematical winner -> Node: node-099, WallTime: 10045, Counter: 9, Value: "STATUS_FROM_CLIENT_099"
[Test] Successfully verified 50 randomized arrival permutations: Mathematical convergence proven.
test test_100_concurrent_offline_clients_deterministic_convergence ... ok

test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; finished in 0.04s
```

### Native Stress-Testing Benchmark (50,000 Ops)

DeltaMesh includes a native Rust benchmark generator (`backend/src/bin/benchmark.rs`) utilizing `tokio-tungstenite` to evaluate real-world round-trip throughput:

1. **Terminal 1 (Production Server)**:
   ```bash
   cd backend
   cargo run --release --bin backend
   ```

2. **Terminal 2 (Load Generator)**:
   ```bash
   cd backend
   cargo run --release --bin benchmark
   ```

**Metrics Evaluated:**
- **p50 Latency**: `~0.10 ms` (sub-millisecond frame decoding and event-loop dispatch).
- **Throughput**: Between `8,000` and `35,000+` ops/sec when executed with local PostgreSQL and Redis instances.
- **Tail Latency (p95/p99)**: Sub-35ms with zero garbage collection stops.

---

## Production Hardening

### JWT Handshake Authentication
Browser WebSockets do not support custom request headers. DeltaMesh extracts and validates HMAC-SHA256 tokens directly during the HTTP upgrade negotiation:
- **Query Parameter**: `ws://domain/ws?token=<jwt>`
- **Authorization Header**: `Authorization: Bearer <jwt>` (supported for server-to-server or CLI clients)

### Workspace Isolation
Redis Pub/Sub channels are segregated by workspace ID:
```text
deltamesh:workspace:{workspace_id}:deltas
```
Clients subscribed to Workspace A will never receive delta traffic or notifications from Workspace B.

### Cold-Start State Snapshots
When a client connects without prior state or after an extended offline period, the backend executes `fetch_workspace_snapshot()`, consolidating the latest values for every entity into a single unified `ServerSyncResponse` before real-time streaming commences.

### Background Idempotency Garbage Collection
To prevent unbounded storage growth in `processed_mutations`, `main.rs` initializes a lightweight Tokio background task:
- Executes every 24 hours.
- Evaluates indexed timestamps (`applied_at < NOW() - INTERVAL '14 days'`).
- Prevents database performance degradation without locking active transactions.

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
