use async_graphql::*;
use graphql_core::{
    simple_generic_errors::{AccessDenied, InternalError},
    ContextExt,
};

use service::settings::is_develop;
use service::token::TokenService;

use super::set_refresh_token_cookie;

pub struct Logout {
    pub user_id: String,
}

#[Object]
impl Logout {
    /// User id of the logged out user
    pub async fn user_id(&self) -> &str {
        &self.user_id
    }
}

pub struct MissingAuthToken;
#[Object]
impl MissingAuthToken {
    pub async fn description(&self) -> &'static str {
        "Auth token was not provided"
    }
}

pub struct ExpiredSignature;
#[Object]
impl ExpiredSignature {
    pub async fn description(&self) -> &'static str {
        "Provided token is expired"
    }
}

pub struct InvalidToken;
#[Object]
impl InvalidToken {
    pub async fn description(&self) -> &'static str {
        "Provided token is invalid"
    }
}

pub struct TokenInvalided;
#[Object]
impl TokenInvalided {
    pub async fn description(&self) -> &'static str {
        "Token has been invalidated by the server"
    }
}

pub struct NotAnApiToken;
#[Object]
impl NotAnApiToken {
    pub async fn description(&self) -> &'static str {
        "Not an api token"
    }
}

#[derive(Interface)]
#[graphql(field(name = "description", type = "&str"))]
pub enum LogoutErrorInterface {
    AccessDenied(AccessDenied),
    InternalError(InternalError),
}

#[derive(SimpleObject)]
pub struct LogoutError {
    pub error: LogoutErrorInterface,
}

#[derive(Union)]
pub enum LogoutResponse {
    Error(LogoutError),
    Response(Logout),
}

pub fn logout(ctx: &Context<'_>) -> LogoutResponse {
    let auth_data = ctx.get_auth_data();
    // invalid the refresh token cookie first (just in case an error happens before we do so)
    set_refresh_token_cookie(ctx, "logged out", 0, false);

    let auth_context = match ctx.get_auth_context() {
        Some(auth_context) => auth_context,
        None => {
            return LogoutResponse::Error(LogoutError {
                error: LogoutErrorInterface::InternalError(InternalError(
                    "No Auth Context".to_string(),
                )),
            });
        }
    };

    // invalidate all tokens of the user on the server
    let user_id = auth_context.user_id;
    let mut service = TokenService::new(
        &auth_data.token_bucket,
        auth_data.auth_token_secret.as_bytes(),
        !is_develop(),
    );
    match service.logout(&user_id) {
        Ok(_) => {}
        Err(e) => match e {
            service::token::JWTLogoutError::ConcurrencyLockError(_) => {
                return LogoutResponse::Error(LogoutError {
                    error: LogoutErrorInterface::InternalError(InternalError(
                        "Lock error".to_string(),
                    )),
                });
            }
        },
    };

    LogoutResponse::Response(Logout { user_id })
}
