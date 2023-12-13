use std::sync::Arc;

use repository::{RepositoryError, StorageConnection, StorageConnectionManager};

use crate::{
    auth::{AuthService, AuthServiceTrait},
    email::{EmailService, EmailServiceTrait},
    log_service::{LogService, LogServiceTrait},
    settings::Settings,
    universal_codes::{UniversalCodesService, UniversalCodesServiceTrait},
    user_account::{UserAccountService, UserAccountServiceTrait},
};

pub struct ServiceProvider {
    pub connection_manager: StorageConnectionManager,
    pub email_service: Box<dyn EmailServiceTrait>,
    pub dgraph_service: Box<dyn UniversalCodesServiceTrait>,
    pub validation_service: Box<dyn AuthServiceTrait>,
    pub user_account_service: Box<dyn UserAccountServiceTrait>,
    pub settings: Settings,
    pub log_service: Box<dyn LogServiceTrait>,
}

pub struct ServiceContext {
    pub connection: StorageConnection,
    pub service_provider: Arc<ServiceProvider>,
    pub user_id: String,
}

impl ServiceContext {
    pub fn new(service_provider: Arc<ServiceProvider>) -> Result<ServiceContext, RepositoryError> {
        let connection = service_provider.connection_manager.connection()?;
        Ok(ServiceContext {
            connection,
            service_provider,
            user_id: "".to_string(),
        })
    }

    pub fn with_user(
        service_provider: Arc<ServiceProvider>,
        user_id: String,
    ) -> Result<ServiceContext, RepositoryError> {
        let connection = service_provider.connection_manager.connection()?;
        Ok(ServiceContext {
            connection,
            service_provider,
            user_id,
        })
    }

    pub fn as_server_admin(
        service_provider: Arc<ServiceProvider>,
    ) -> Result<ServiceContext, RepositoryError> {
        let connection = service_provider.connection_manager.connection()?;
        Ok(ServiceContext {
            connection,
            service_provider,
            user_id: "9cd8ce10-969b-45c4-871e-3a744c75ddf0".to_string(), // Admin user id is hardcoded in the database migration
        })
    }
}

impl ServiceProvider {
    pub fn new(connection_manager: StorageConnectionManager, settings: Settings) -> Self {
        ServiceProvider {
            connection_manager,
            email_service: Box::new(EmailService::new(settings.clone())),
            dgraph_service: Box::new(UniversalCodesService::new(settings.clone())),
            validation_service: Box::new(AuthService::new()),
            user_account_service: Box::new(UserAccountService {}),
            settings,
            log_service: Box::new(LogService {}),
        }
    }

    /// Establishes a new DB connection
    pub fn connection(&self) -> Result<StorageConnection, RepositoryError> {
        self.connection_manager.connection()
    }
}
