use futures_util::StreamExt;
use prost::Message as ProstMessage;
use redis::aio::ConnectionManager;
use redis::AsyncCommands;
use std::sync::Arc;
use tokio::sync::broadcast;
use crate::proto::sync::MutationOp;

const DELTA_CHANNEL: &str = "deltamesh:workspace:deltas";

#[derive(Clone)]
pub struct RedisBroadcaster {
    conn: ConnectionManager,
    broadcast_tx: broadcast::Sender<MutationOp>,
}

impl RedisBroadcaster {
    pub async fn new(
        redis_client: redis::Client,
        broadcast_tx: broadcast::Sender<MutationOp>,
    ) -> Result<Self, redis::RedisError> {
        let conn = ConnectionManager::new(redis_client.clone()).await?;

        // Iniciar el listener de suscripción en una tarea Tokio independiente
        let listener_tx = broadcast_tx.clone();
        tokio::spawn(async move {
            if let Err(e) = Self::subscription_loop(redis_client, listener_tx).await {
                eprintln!("[Redis PubSub] Error crítico en el loop de suscripción: {:?}", e);
            }
        });

        Ok(Self { conn, broadcast_tx })
    }

    /// Publica un delta confirmado en Redis serializado en Protobuf
    pub async fn publish_delta(&self, mutation: &MutationOp) -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
        let mut buffer = Vec::new();
        mutation.encode(&mut buffer)?;

        let mut conn = self.conn.clone();
        conn.publish::<_, _, ()>(DELTA_CHANNEL, buffer).await?;
        Ok(())
    }

    /// Obtiene un receptor para que una conexión WebSocket escuche deltas locales
    pub fn subscribe(&self) -> broadcast::Receiver<MutationOp> {
        self.broadcast_tx.subscribe()
    }

    /// Bucle en background que recibe mensajes de Redis y los despacha al broadcast local
    async fn subscription_loop(
        client: redis::Client,
        tx: broadcast::Sender<MutationOp>,
    ) -> Result<(), redis::RedisError> {
        let conn = client.get_async_pubsub().await?;
        let mut pubsub = conn;
        pubsub.subscribe(DELTA_CHANNEL).await?;

        println!("[Redis PubSub] Suscrito al canal '{}'", DELTA_CHANNEL);

        let mut stream = pubsub.on_message();

        while let Some(msg) = stream.next().await {
            let payload: Vec<u8> = msg.get_payload()?;
            if let Ok(mutation) = MutationOp::decode(&payload[..]) {
                // Se envía al canal local de broadcast; si no hay receptores activos, se ignora el error
                let _ = tx.send(mutation);
            }
        }

        Ok(())
    }
}
