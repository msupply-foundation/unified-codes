use async_graphql::*;

use graphql_core::{standard_graphql_error::StandardGraphqlError, ContextExt};
use service::user_account::passwords::PasswordResetError;

#[derive(PartialEq, Debug, Clone)]
pub struct PasswordResetResponseMessage {
    pub message: String,
}

#[Object]
impl PasswordResetResponseMessage {
    pub async fn message(&self) -> &str {
        &self.message
    }
}

#[derive(Union)]
pub enum PasswordResetResponse {
    Response(PasswordResetResponseMessage),
}

pub fn initiate_password_reset(
    ctx: &Context<'_>,
    email_or_user_id: &str,
) -> Result<PasswordResetResponse> {
    let service_context = ctx.service_context(None)?;
    match service_context
        .service_provider
        .user_account_service
        .initiate_password_reset(&service_context, email_or_user_id)
    {
        Ok(_) => Ok(PasswordResetResponse::Response(
            PasswordResetResponseMessage {
                message: "Password reset initiated".to_string(),
            },
        )),
        Err(e) => map_error(e),
    }
}

pub fn validate_password_reset_token(
    ctx: &Context<'_>,
    token: &str,
) -> Result<PasswordResetResponse> {
    let service_context = ctx.service_context(None)?;
    match service_context
        .service_provider
        .user_account_service
        .validate_password_reset_token(&service_context, token)
    {
        Ok(_) => Ok(PasswordResetResponse::Response(
            PasswordResetResponseMessage {
                message: "Valid Token".to_string(),
            },
        )),
        Err(e) => map_error(e),
    }
}

pub fn reset_password_using_token(
    ctx: &Context<'_>,
    token: &str,
    password: &str,
) -> Result<PasswordResetResponse> {
    let service_context = ctx.service_context(None)?;
    match service_context
        .service_provider
        .user_account_service
        .reset_password(&service_context, token, password)
    {
        Ok(_) => Ok(PasswordResetResponse::Response(
            PasswordResetResponseMessage {
                message: "Password reset completed".to_string(),
            },
        )),
        Err(e) => map_error(e),
    }
}

fn map_error(error: PasswordResetError) -> Result<PasswordResetResponse> {
    use StandardGraphqlError::*;

    let graphql_error = match error {
        PasswordResetError::EmailDoesNotExist => BadUserInput("This email address doesn't appear in our system".to_string()),
        PasswordResetError::UnableToSendEmail(_) => InternalError(
            "Unable to send email. Please try again later or contact mSupply Support for assistance".to_string()),
        PasswordResetError::ResetTooSoon => BadUserInput(
            "A reset link was created recently, please wait before re-trying".to_string()
        ),
        PasswordResetError::TokenExpired => {
            BadUserInput("This reset link is no longer valid".to_string())
        }
        PasswordResetError::InvalidToken => {
            BadUserInput("This reset link is not valid".to_string())
        }
        PasswordResetError::DatabaseError(_) => {
            InternalError("Database error while creating password reset link".to_string())
        }
        PasswordResetError::PasswordHashError => {
            BadUserInput("An error occured with your password".to_string())
        }
    };

    Err(graphql_error.extend())
}
