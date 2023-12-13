use std::sync::Arc;

use actix_web::web::Data;
use async_graphql::Context;

use repository::{RepositoryError, StorageConnectionManager};

use service::service_provider::{ServiceContext, ServiceProvider};

use service::settings::Settings;

#[allow(clippy::borrowed_box)]
// Sugar that helps make things neater and avoid errors that would only crop up at runtime.
pub trait ContextExt {
    fn get_connection_manager(&self) -> &StorageConnectionManager;
    fn service_provider(&self) -> Arc<ServiceProvider>;
    fn service_context(&self) -> Result<ServiceContext, RepositoryError>;
    fn get_settings(&self) -> &Settings;
}

impl<'a> ContextExt for Context<'a> {
    fn get_connection_manager(&self) -> &StorageConnectionManager {
        self.data_unchecked::<Data<StorageConnectionManager>>()
    }

    fn service_provider(&self) -> Arc<ServiceProvider> {
        self.data_unchecked::<Data<ServiceProvider>>()
            .clone()
            .into_inner()
    }

    fn service_context(&self) -> Result<ServiceContext, RepositoryError> {
        Ok(ServiceContext {
            connection: self.get_connection_manager().connection()?,
            service_provider: self.service_provider(),
            user_id: "".to_string(),
        })
    }
    fn get_settings(&self) -> &Settings {
        self.data_unchecked::<Data<Settings>>()
    }
}
