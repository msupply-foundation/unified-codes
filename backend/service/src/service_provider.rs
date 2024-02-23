use std::sync::Arc;

use dgraph::DgraphClient;
use repository::{RepositoryError, StorageConnection, StorageConnectionManager};

use crate::{
    auth::{AuthService, AuthServiceTrait},
    barcodes::BarcodeService,
    configuration::ConfigurationService,
    drug_interactions::DrugInteractionService,
    email::{EmailService, EmailServiceTrait},
    log_service::{LogService, LogServiceTrait},
    settings::Settings,
    universal_codes::UniversalCodesService,
    user_account::{UserAccountService, UserAccountServiceTrait},
};

pub struct ServiceProvider {
    pub connection_manager: StorageConnectionManager,
    pub email_service: Box<dyn EmailServiceTrait>,
    pub universal_codes_service: Box<UniversalCodesService>,
    pub configuration_service: Box<ConfigurationService>,
    pub barcode_service: Box<BarcodeService>,
    pub drug_interaction_service: Box<DrugInteractionService>,
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
            universal_codes_service: Box::new(UniversalCodesService::new(settings.clone())),
            configuration_service: Box::new(ConfigurationService::new(settings.clone())),
            barcode_service: Box::new(BarcodeService::new(settings.clone())),
            drug_interaction_service: Box::new(DrugInteractionService::new(settings.clone())),
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

    pub fn dgraph_client(&self) -> DgraphClient {
        let url = format!(
            "{}:{}/graphql",
            self.settings.dgraph.host.clone(),
            self.settings.dgraph.port
        );

        DgraphClient::new(&url)
    }
}
