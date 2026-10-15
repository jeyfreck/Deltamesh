#![allow(dead_code)]
use std::env;

pub struct Config {
    pub bind_addr: String,
    pub database_url: String,
    pub redis_url: String,
}

impl Config {
    pub fn from_env() -> Self {
        let _ = dotenvy::dotenv();
        Self {
            bind_addr: env::var("BIND_ADDR").unwrap_or_else(|_| "0.0.0.0:3000".into()),
            database_url: env::var("DATABASE_URL")
                .unwrap_or_else(|_| "postgres://dev_user:dev_password@localhost:5432/deltamesh_db".into()),
            redis_url: env::var("REDIS_URL").unwrap_or_else(|_| "redis://localhost:6379".into()),
        }
    }
}
