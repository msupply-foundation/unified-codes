use std::{
    fmt::{Display, Formatter},
    sync::Arc,
};

use dgraph::{
    interaction_groups::{interaction_groups, InteractionGroup},
    DgraphClient, GraphQLError,
};
use repository::RepositoryError;
use util::usize_to_u32;

use crate::{service_provider::ServiceProvider, settings::Settings};

pub mod delete;
pub mod insert;
mod tests;

pub struct DrugInteractionService {
    client: DgraphClient,
}

#[derive(Debug)]
pub enum DrugInteractionServiceError {
    InternalError(String),
    BadUserInput(String),
}

#[derive(Debug)]
pub enum ModifyDrugInteractionError {
    InternalError(String),
    DatabaseError(RepositoryError),
    DgraphError(GraphQLError),
}

impl From<RepositoryError> for ModifyDrugInteractionError {
    fn from(error: RepositoryError) -> Self {
        ModifyDrugInteractionError::DatabaseError(error)
    }
}

impl From<GraphQLError> for ModifyDrugInteractionError {
    fn from(error: GraphQLError) -> Self {
        ModifyDrugInteractionError::DgraphError(error)
    }
}

impl Display for DrugInteractionServiceError {
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        match self {
            DrugInteractionServiceError::InternalError(details) => {
                write!(f, "Internal error: {}", details)
            }
            DrugInteractionServiceError::BadUserInput(details) => {
                write!(f, "Bad user input: {}", details)
            }
        }
    }
}

pub struct InteractionGroupCollection {
    pub data: Vec<InteractionGroup>,
    pub total_length: u32,
}

impl DrugInteractionService {
    pub fn new(settings: Settings) -> Self {
        let url = format!(
            "{}:{}/graphql",
            settings.dgraph.host.clone(),
            settings.dgraph.port
        );

        DrugInteractionService {
            client: DgraphClient::new(&url),
        }
    }

    pub async fn all_drug_interaction_groups(
        &self,
    ) -> Result<InteractionGroupCollection, DrugInteractionServiceError> {
        let result = interaction_groups(&self.client, None)
            .await
            .map_err(|e| DrugInteractionServiceError::InternalError(e.message().to_string()))?;

        match result {
            Some(data) => Ok(InteractionGroupCollection {
                total_length: usize_to_u32(data.data.len()),
                data: data.data,
            }),
            None => Ok(InteractionGroupCollection {
                data: vec![],
                total_length: 0,
            }),
        }
    }

    pub async fn add_drug_interaction_group(
        &self,
        sp: Arc<ServiceProvider>,
        user_id: String,
        item: insert::AddInteractionGroup,
    ) -> Result<u32, ModifyDrugInteractionError> {
        insert::add_drug_interaction_group(sp, user_id, self.client.clone(), item).await
    }

    pub async fn delete_drug_interaction_group(
        &self,
        sp: Arc<ServiceProvider>,
        user_id: String,
        code: String,
    ) -> Result<u32, ModifyDrugInteractionError> {
        delete::delete_drug_interaction_group(sp, user_id, self.client.clone(), code).await
    }
}
