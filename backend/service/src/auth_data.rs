use crate::token_bucket::TokenBucket;
use std::sync::{Arc, RwLock};

pub struct AuthData {
    /// Secret to sign and verify auth (JWT) tokens.
    pub auth_token_secret: String,
    pub token_bucket: Arc<RwLock<TokenBucket>>,
}

#[derive(Debug, Clone)]
pub struct AuthenticationContext {
    pub user_id: String,
}
