use dgraph::DgraphClient;

use crate::settings::Settings;

// We use a trait for UniversalCodesService to allow mocking in tests
pub trait UniversalCodesServiceTrait: Send + Sync {
    fn helloworld(&self) -> String {
        "Hello World!".to_string()
    }
}

pub struct UniversalCodesService {
    client: DgraphClient,
}

#[derive(Debug)]
pub enum UniversalCodesServiceError {
    InternalError(String),
    BadUserInput(String),
}

impl UniversalCodesService {
    pub fn new(settings: Settings) -> Self {
        let url = format!(
            "{}:{}/graphql",
            settings.dgraph.host.clone(),
            settings.dgraph.port
        );

        UniversalCodesService {
            client: DgraphClient::new(&url),
        }
    }
}

impl UniversalCodesServiceTrait for UniversalCodesService {}
