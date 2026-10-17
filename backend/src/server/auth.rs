use axum::{
    async_trait,
    extract::{FromRequestParts, Query},
    http::{request::Parts, StatusCode},
};
use jsonwebtoken::{decode, DecodingKey, Validation, Algorithm};
use serde::{Deserialize, Serialize};
use std::env;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Claims {
    pub sub: String,          // user_id
    pub workspace_id: String, // ID del espacio de trabajo
    pub exp: usize,           // Unix timestamp de expiración
}

#[derive(Debug, Clone)]
pub struct AuthenticatedSession {
    pub user_id: String,
    pub workspace_id: String,
}

#[derive(Deserialize)]
struct AuthQuery {
    token: Option<String>,
}

#[async_trait]
impl<S> FromRequestParts<S> for AuthenticatedSession
where
    S: Send + Sync,
{
    type Rejection = (StatusCode, &'static str);

    async fn from_request_parts(parts: &mut Parts, _state: &S) -> Result<Self, Self::Rejection> {
        let jwt_secret = env::var("JWT_SECRET").unwrap_or_else(|_| "secret_desarrollo_inseguro_123".to_string());

        // 1. Intentar extraer el token desde la Query String (?token=xxx)
        let query_token = Query::<AuthQuery>::try_from_uri(&parts.uri)
            .ok()
            .and_then(|Query(q)| q.token);

        // 2. Si no viene en la URL, buscar en la cabecera 'Authorization'
        let header_token = parts
            .headers
            .get("Authorization")
            .and_then(|h| h.to_str().ok())
            .and_then(|h| h.strip_prefix("Bearer ").map(|s| s.to_string()));

        let token = query_token
            .or(header_token)
            .ok_or((StatusCode::UNAUTHORIZED, "Token JWT no provisto"))?;

        let mut validation = Validation::new(Algorithm::HS256);
        validation.validate_exp = true;

        let token_data = decode::<Claims>(
            &token,
            &DecodingKey::from_secret(jwt_secret.as_bytes()),
            &validation,
        )
        .map_err(|_| (StatusCode::UNAUTHORIZED, "Token JWT inválido o expirado"))?;

        Ok(AuthenticatedSession {
            user_id: token_data.claims.sub,
            workspace_id: token_data.claims.workspace_id,
        })
    }
}
