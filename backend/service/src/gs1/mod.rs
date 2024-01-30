use std::{
    fmt::{Display, Formatter},
    sync::Arc,
};

use dgraph::{gs1::gs1::gs1_by_gtin, gs1s::gs1s, DgraphClient, GraphQLError, GS1};
use repository::RepositoryError;
use util::usize_to_u32;

use crate::{service_provider::ServiceProvider, settings::Settings};

#[derive(Debug)]
pub enum ModifyGS1Error {
    GS1DoesNotExist,
    GS1AlreadyExists,
    UniversalCodeDoesNotExist,
    InternalError(String),
    DatabaseError(RepositoryError),
    DgraphError(GraphQLError),
}

impl From<RepositoryError> for ModifyGS1Error {
    fn from(error: RepositoryError) -> Self {
        ModifyGS1Error::DatabaseError(error)
    }
}

impl From<GraphQLError> for ModifyGS1Error {
    fn from(error: GraphQLError) -> Self {
        ModifyGS1Error::DgraphError(error)
    }
}

mod tests;

pub mod delete;
pub mod upsert;

pub struct GS1Service {
    client: DgraphClient,
}

#[derive(Debug)]
pub enum GS1ServiceError {
    InternalError(String),
    BadUserInput(String),
}

impl Display for GS1ServiceError {
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        match self {
            GS1ServiceError::InternalError(details) => {
                write!(f, "Internal error: {}", details)
            }
            GS1ServiceError::BadUserInput(details) => {
                write!(f, "Bad user input: {}", details)
            }
        }
    }
}

pub struct GS1Collection {
    pub data: Vec<GS1>,
    pub total_length: u32,
}

impl GS1Service {
    pub fn new(settings: Settings) -> Self {
        let url = format!(
            "{}:{}/graphql",
            settings.dgraph.host.clone(),
            settings.dgraph.port
        );

        GS1Service {
            client: DgraphClient::new(&url),
        }
    }

    pub async fn gs1s(&self) -> Result<GS1Collection, GS1ServiceError> {
        let result = gs1s(&self.client)
            .await
            .map_err(|e| GS1ServiceError::InternalError(e.message().to_string()))?; // TODO: Improve error handling?

        match result {
            Some(data) => Ok(GS1Collection {
                total_length: usize_to_u32(data.data.len()),
                data: data.data,
            }),
            None => Ok(GS1Collection {
                data: vec![],
                total_length: 0,
            }),
        }
    }

    pub async fn gs1_by_gtin(&self, gtin: String) -> Result<Option<GS1>, GS1ServiceError> {
        let result = gs1_by_gtin(&self.client, gtin)
            .await
            .map_err(|e| GS1ServiceError::InternalError(e.message().to_string()))?; // TODO: Improve error handling?

        match result {
            Some(result) => Ok(Some(result)),
            None => Ok(None),
        }
    }

    pub async fn add_gs1(
        &self,
        sp: Arc<ServiceProvider>,
        user_id: String,
        item: upsert::AddGS1,
    ) -> Result<GS1, ModifyGS1Error> {
        upsert::add_gs1(sp, user_id, self.client.clone(), item).await
    }

    pub async fn delete_gs1(
        &self,
        sp: Arc<ServiceProvider>,
        user_id: String,
        gtin: String,
    ) -> Result<u32, ModifyGS1Error> {
        delete::delete_gs1(sp, user_id, self.client.clone(), gtin).await
    }
}
