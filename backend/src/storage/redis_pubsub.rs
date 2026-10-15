#![allow(dead_code)]
use redis::AsyncCommands;

pub const CHANNEL: &str = "deltamesh:mutations";

pub async fn publish(client: &redis::Client, payload: &[u8]) -> redis::RedisResult<()> {
    let mut conn = client.get_multiplexed_async_connection().await?;
    conn.publish::<_, _, ()>(CHANNEL, payload).await
}
