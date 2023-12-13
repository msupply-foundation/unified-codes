use crate::ContextExt;

use async_graphql::{Context, ErrorExtensions, Result};
use repository::RepositoryError;
use service::{
    auth::{AuthorisationDeniedKind, AuthorisationError, ResourceAccessRequest, ValidatedUser},
    ListError,
};

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
