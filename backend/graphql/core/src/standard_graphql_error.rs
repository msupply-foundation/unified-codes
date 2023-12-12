use crate::ContextExt;

use async_graphql::{Context, ErrorExtensions, Result};
use repository::RepositoryError;
use service::{
    auth::{AuthorisationDeniedKind, AuthorisationError, ResourceAccessRequest, ValidatedUser},
    ListError,
};
use thiserror::Error;

#[derive(Debug, Error, Clone)]
pub enum StandardGraphqlError {
    #[error("Internal error")]
    InternalError(String),

    #[error("Bad user input")]
    BadUserInput(String),

    #[error("Unauthenticated")]
    Unauthenticated(String),

    #[error("Forbidden")]
    Forbidden(String),
}

impl ErrorExtensions for StandardGraphqlError {
    // lets define our base extensions
    fn extend(&self) -> async_graphql::Error {
        async_graphql::Error::new(format!("{}", self)).extend_with(|_, e| match self {
            StandardGraphqlError::InternalError(details) => e.set("details", details.clone()),
            StandardGraphqlError::BadUserInput(details) => e.set("details", details.clone()),
            StandardGraphqlError::Unauthenticated(details) => e.set("details", details.clone()),
            StandardGraphqlError::Forbidden(details) => e.set("details", details.clone()),
        })
    }
}

impl From<RepositoryError> for StandardGraphqlError {
    fn from(err: RepositoryError) -> Self {
        StandardGraphqlError::InternalError(format!("{:?}", err))
    }
}

impl StandardGraphqlError {
    pub fn from_list_error(error: ListError) -> async_graphql::Error {
        let formatted_error = format!("{:#?}", error);
        let graphql_error = match error {
            ListError::DatabaseError(error) => error.into(),
            ListError::InvalidRequest(s) => StandardGraphqlError::BadUserInput(s),
            ListError::LimitBelowMin(_) => StandardGraphqlError::BadUserInput(formatted_error),
            ListError::LimitAboveMax(_) => StandardGraphqlError::BadUserInput(formatted_error),
            ListError::InternalError(_) => StandardGraphqlError::InternalError(formatted_error),
        };
        graphql_error.extend()
    }

    pub fn from_repository_error(error: RepositoryError) -> async_graphql::Error {
        StandardGraphqlError::from(error).extend()
    }

    pub fn internal_error_from_str(str_slice: &str) -> async_graphql::Error {
        StandardGraphqlError::InternalError(str_slice.to_string()).extend()
    }

    pub fn internal_error_from_string(string: String) -> async_graphql::Error {
        StandardGraphqlError::internal_error_from_str(&string)
    }
}

/// Validates current user is authenticated and authorized
pub fn validate_auth(
    ctx: &Context<'_>,
    access_request: &ResourceAccessRequest,
) -> Result<ValidatedUser> {
    let auth_context = match ctx.get_auth_context() {
        Some(auth_context) => auth_context,
        None => {
            return Err(
                StandardGraphqlError::Unauthenticated("No Auth Context".to_string()).extend(),
            )
        }
    };

    let service_ctx = ctx.service_context(None)?;

    let result = service_ctx.service_provider.validation_service.validate(
        &service_ctx,
        &auth_context,
        access_request,
    );
    result.map_err(|err| {
        let graphql_error = match err {
            AuthorisationError::Denied(kind) => match kind {
                AuthorisationDeniedKind::NotAuthenticated(_) => {
                    StandardGraphqlError::Unauthenticated(format!("{:?}", kind))
                }
                AuthorisationDeniedKind::InsufficientPermission {
                    msg,
                    required_permissions,
                } => StandardGraphqlError::Forbidden(format!(
                    "{}, Required permissions: {:?}",
                    msg, required_permissions
                )),
            },
            AuthorisationError::InternalError(err) => StandardGraphqlError::InternalError(err),
        };
        graphql_error.extend()
    })
}

pub fn list_error_to_gql_err(err: ListError) -> async_graphql::Error {
    let gql_err = match err {
        ListError::DatabaseError(err) => err.into(),
        ListError::InvalidRequest(s) => StandardGraphqlError::BadUserInput(s),
        ListError::LimitBelowMin(_) => StandardGraphqlError::BadUserInput(format!("{:?}", err)),
        ListError::LimitAboveMax(_) => StandardGraphqlError::BadUserInput(format!("{:?}", err)),
        ListError::InternalError(_) => StandardGraphqlError::InternalError(format!("{:?}", err)),
    };
    gql_err.extend()
}

pub fn validation_denied_kind_to_string(kind: AuthorisationDeniedKind) -> String {
    match kind {
        AuthorisationDeniedKind::NotAuthenticated(msg) => format!("Not authenticated: {}", msg),
        AuthorisationDeniedKind::InsufficientPermission {
            msg: _,
            required_permissions,
        } => {
            format!("Required permissions: {:?}", required_permissions)
        }
    }
}
