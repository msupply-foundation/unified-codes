use std::fmt::{Display, Formatter};

use dgraph::{DgraphClient, DgraphFilter, DgraphFilterType, Entity, SearchVars};

use crate::settings::Settings;

pub use self::{entity_collection::EntityCollection, entity_filter::EntitySearchFilter};

pub mod entity_collection;
pub mod entity_filter;

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

    pub async fn entities(
        &self,
        filter: EntitySearchFilter,
        first: Option<u32>,
        offset: Option<u32>,
    ) -> Result<EntityCollection, UniversalCodesServiceError> {
        let dgraph_vars = SearchVars {
            filter: DgraphFilter {
                code: filter.code.map(|code| DgraphFilterType {
                    eq: Some(code),
                    ..Default::default()
                }),
                description: filter.description.map(|description| DgraphFilterType {
                    regexp: Some(format!("/.*{}.*/", description).to_string()),
                    ..Default::default()
                }),
            },
            first: first,
            offset: offset,
            categories: filter.categories, // TODO map categories to upper/lower case
        };

        let result = dgraph::entities(&self.client, dgraph_vars)
            .await
            .map_err(|e| UniversalCodesServiceError::InternalError(e.message().to_string()))?; // TODO: Improve error handling?

        match result {
            Some(data) => Ok(EntityCollection {
                data: data.data,
                total_length: data
                    .aggregates
                    .unwrap_or_default()
                    .iter()
                    .map(|c| c.categories.count)
                    .sum(),
            }),
            None => Ok(EntityCollection {
                data: vec![],
                total_length: 0,
            }),
        }
    }
}
