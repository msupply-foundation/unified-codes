use std::{
    fmt::{Display, Formatter},
    sync::Arc,
};

use dgraph::{
    interaction_groups::interaction_groups, interactions::interactions, DgraphClient,
    DrugInteraction, GraphQLError, InteractionGroup,
};
use repository::RepositoryError;
use util::usize_to_u32;

use crate::{service_provider::ServiceProvider, settings::Settings};

pub mod delete_group;
pub mod delete_interaction;
mod tests;
pub mod upsert_group;
pub mod upsert_interaction;

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
    BadUserInput(String),
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

pub struct DrugInteractionCollection {
    pub data: Vec<DrugInteraction>,
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

    pub async fn all_drug_interactions(
        &self,
    ) -> Result<DrugInteractionCollection, DrugInteractionServiceError> {
        let result = interactions(&self.client, None)
            .await
            .map_err(|e| DrugInteractionServiceError::InternalError(e.message().to_string()))?;

        match result {
            Some(data) => Ok(DrugInteractionCollection {
                total_length: usize_to_u32(data.data.len()),
                data: data.data,
            }),
            None => Ok(DrugInteractionCollection {
                data: vec![],
                total_length: 0,
            }),
        }
    }

    pub async fn upsert_drug_interaction_group(
        &self,
        sp: Arc<ServiceProvider>,
        user_id: String,
        item: upsert_group::UpsertDrugInteractionGroup,
    ) -> Result<u32, ModifyDrugInteractionError> {
        upsert_group::upsert_drug_interaction_group(sp, user_id, self.client.clone(), item).await
    }

    pub async fn delete_drug_interaction_group(
        &self,
        sp: Arc<ServiceProvider>,
        user_id: String,
        code: String,
    ) -> Result<u32, ModifyDrugInteractionError> {
        delete_group::delete_drug_interaction_group(sp, user_id, self.client.clone(), code).await
    }

    pub async fn upsert_drug_interaction(
        &self,
        sp: Arc<ServiceProvider>,
        user_id: String,
        item: upsert_interaction::UpsertDrugInteraction,
    ) -> Result<u32, ModifyDrugInteractionError> {
        upsert_interaction::upsert_drug_interaction(sp, user_id, self.client.clone(), item).await
    }

    pub async fn delete_drug_interaction(
        &self,
        sp: Arc<ServiceProvider>,
        user_id: String,
        code: String,
    ) -> Result<u32, ModifyDrugInteractionError> {
        delete_interaction::delete_drug_interaction(sp, user_id, self.client.clone(), code).await
    }
}
