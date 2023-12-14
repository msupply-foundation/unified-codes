use std::fmt::{Display, Formatter};

use dgraph::{DgraphClient, Entity};

use crate::settings::Settings;

pub struct UniversalCodesService {
    client: DgraphClient,
}

#[derive(Debug)]
pub enum UniversalCodesServiceError {
    InternalError(String),
    BadUserInput(String),
}

impl Display for UniversalCodesServiceError {
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        match self {
            UniversalCodesServiceError::InternalError(details) => {
                write!(f, "Internal error: {}", details)
            }
            UniversalCodesServiceError::BadUserInput(details) => {
                write!(f, "Bad user input: {}", details)
            }
        }
    }
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

    pub async fn entity_by_code(
        &self,
        code: String,
    ) -> Result<Option<Entity>, UniversalCodesServiceError> {
        let result = dgraph::entity_by_code(&self.client, code)
            .await
            .map_err(|e| UniversalCodesServiceError::InternalError(e.message().to_string()))?; // TODO: Improve error handling?

        match result {
            Some(entity) => Ok(Some(entity)),
            None => Ok(None),
        }
    }
}
