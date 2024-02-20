pub mod generic_filters;
pub mod loader;
pub mod pagination;
pub mod simple_generic_errors;
pub mod standard_graphql_error;
pub mod test_helpers;

use std::sync::Arc;

use actix_web::cookie::Cookie;
use actix_web::http::header::COOKIE;
use actix_web::web::Data;
use actix_web::HttpRequest;
use async_graphql::{Context, Request, Response};

use repository::{RepositoryError, StorageConnectionManager};

use service::auth::ValidatedUser;
use service::auth_data::{AuthData, AuthenticationContext};
use service::service_provider::{ServiceContext, ServiceProvider};

use loader::LoaderRegistry;
use service::settings::Settings;
use tokio::sync::mpsc::Sender;

/// Performs a query to ourself, e.g. the report endpoint can query
#[async_trait::async_trait]
pub trait SelfRequest: Send + Sync {
    async fn call(&self, request: Request, user_data: RefreshTokenData) -> Response;
}

#[allow(clippy::borrowed_box)]
// Sugar that helps make things neater and avoid errors that would only crop up at runtime.
pub trait ContextExt {
    fn get_connection_manager(&self) -> &StorageConnectionManager;
    fn get_loader<T: anymap::any::Any + Send + Sync>(&self) -> &T;
    fn service_provider(&self) -> Arc<ServiceProvider>;
    fn service_context(
        &self,
        user: Option<&ValidatedUser>,
    ) -> Result<ServiceContext, RepositoryError>;
    fn get_auth_data(&self) -> &AuthData;
    fn get_auth_context(&self) -> Option<AuthenticationContext>;
    fn self_request(&self) -> Option<&Box<dyn SelfRequest>>;
    fn get_settings(&self) -> &Settings;
    fn restart_switch(&self) -> Sender<bool>;
}

impl<'a> ContextExt for Context<'a> {
    fn get_connection_manager(&self) -> &StorageConnectionManager {
        self.data_unchecked::<Data<StorageConnectionManager>>()
    }

    fn get_loader<T: anymap::any::Any + Send + Sync>(&self) -> &T {
        self.data_unchecked::<Data<LoaderRegistry>>().get::<T>()
    }

    fn service_provider(&self) -> Arc<ServiceProvider> {
        self.data_unchecked::<Data<ServiceProvider>>()
            .clone()
            .into_inner()
    }

    fn service_context(
        &self,
        user: Option<&ValidatedUser>,
    ) -> Result<ServiceContext, RepositoryError> {
        let user_id = match user {
            Some(user) => user.user_id.to_owned(),
            None => "".to_string(),
        };

        Ok(ServiceContext {
            connection: self.get_connection_manager().connection()?,
            service_provider: self.service_provider(),
            user_id: user_id,
        })
    }

    fn get_auth_data(&self) -> &AuthData {
        self.data_unchecked::<Data<AuthData>>()
    }

    fn get_auth_context(&self) -> Option<AuthenticationContext> {
        match self.data_opt::<AuthenticationContext>() {
            Some(auth_context) => Some(auth_context.clone()),
            None => None,
        }
    }

    fn get_settings(&self) -> &Settings {
        self.data_unchecked::<Data<Settings>>()
    }

    fn self_request(&self) -> Option<&Box<dyn SelfRequest>> {
        self.data_opt::<Data<Box<dyn SelfRequest>>>()
            .map(|data| data.get_ref())
    }

    fn restart_switch(&self) -> Sender<bool> {
        self.data_unchecked::<Data<Sender<bool>>>().as_ref().clone()
    }
}

#[derive(Clone, Debug)]
pub struct RefreshTokenData {
    pub refresh_token: Option<String>,
}

pub fn refresh_token_from_cookie(http_req: &HttpRequest) -> RefreshTokenData {
    let headers = http_req.headers();
    // retrieve refresh token
    let refresh_token = headers.get(COOKIE).and_then(|header_value| {
        header_value
            .to_str()
            .ok()
            .and_then(|header| {
                let cookies = header.split(" ").collect::<Vec<&str>>();
                cookies
                    .into_iter()
                    .map(|raw_cookie| Cookie::parse(raw_cookie).ok())
                    .find(|cookie_option| match &cookie_option {
                        Some(cookie) => cookie.name() == "refresh_token",
                        None => false,
                    })
                    .flatten()
            })
            .map(|cookie| cookie.value().to_owned())
    });

    RefreshTokenData { refresh_token }
}

#[macro_export]
macro_rules! map_filter {
    ($from:ident, $f:expr) => {{
        repository::EqualFilter {
            equal_to: $from.equal_to.map($f),
            not_equal_to: $from.not_equal_to.map($f),
            equal_any: $from
                .equal_any
                .map(|inputs| inputs.into_iter().map($f).collect()),
            not_equal_all: None,
            is_null: None,
        }
    }};
}
