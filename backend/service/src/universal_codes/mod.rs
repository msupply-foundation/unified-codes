use std::{
    fmt::{Display, Formatter},
    sync::Arc,
};

use dgraph::{
    ChangeStatus, ChangeStatusDgraphFilterType, DgraphClient, DgraphOrderByType, Entity,
    GraphQLError, PendingChange, PendingChangesDgraphFilter, PendingChangesQueryVars, SearchVars,
};
use repository::RepositoryError;

use crate::{service_provider::ServiceProvider, settings::Settings};

pub use self::{entity_collection::EntityCollection, entity_filter::EntitySearchFilter};
use self::{
    entity_filter::{dgraph_filter_from_v1_filter, dgraph_order_by_from_v1_filter},
    pending_change_collection::PendingChangeCollection,
};

mod tests;

pub mod approve_pending_change;
pub mod code_generator;
pub mod entity_collection;
pub mod entity_filter;
pub mod pending_change_collection;
pub mod properties;
pub mod upsert;
pub mod upsert_pending_change;
pub mod validate;

#[derive(Debug)]
pub enum ModifyUniversalCodeError {
    UniversalCodeDoesNotExist,
    UniversalCodeAlreadyExists,
    PendingChangeDoesNotExist,
    DescriptionAlreadyExists(String),
    NotAuthorised,
    InternalError(String),
    DatabaseError(RepositoryError),
    DgraphError(GraphQLError),
}

impl From<RepositoryError> for ModifyUniversalCodeError {
    fn from(error: RepositoryError) -> Self {
        ModifyUniversalCodeError::DatabaseError(error)
    }
}

impl From<GraphQLError> for ModifyUniversalCodeError {
    fn from(error: GraphQLError) -> Self {
        ModifyUniversalCodeError::DgraphError(error)
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
            filter: dgraph_filter_from_v1_filter(filter.clone()),
            first: first,
            offset: offset,
            order: dgraph_order_by_from_v1_filter(filter),
        };

        let result = dgraph::entities(&self.client, dgraph_vars)
            .await
            .map_err(|e| UniversalCodesServiceError::InternalError(e.message().to_string()))?; // TODO: Improve error handling?

        match result {
            Some(data) => Ok(EntityCollection {
                data: data.data,
                total_length: data.aggregates.unwrap_or_default().count,
            }),
            None => Ok(EntityCollection {
                data: vec![],
                total_length: 0,
            }),
        }
    }

    pub async fn pending_change(
        &self,
        request_id: String,
    ) -> Result<Option<PendingChange>, UniversalCodesServiceError> {
        let result = dgraph::pending_change(&self.client, request_id)
            .await
            .map_err(|e| UniversalCodesServiceError::InternalError(e.message().to_string()))?; // TODO: Improve error handling?

        match result {
            Some(pending_change) => Ok(Some(pending_change)),
            None => Ok(None),
        }
    }

    pub async fn pending_changes(
        &self,
        // filter: PendingChangesFilter, // TODO: probably should expose this to allow filtering by state?
        first: Option<u32>,
        offset: Option<u32>,
        order: Option<DgraphOrderByType>,
    ) -> Result<PendingChangeCollection, UniversalCodesServiceError> {
        let dgraph_vars = PendingChangesQueryVars {
            filter: PendingChangesDgraphFilter {
                status: Some(ChangeStatusDgraphFilterType {
                    eq: Some(ChangeStatus::Pending),
                    ..Default::default()
                }),
                ..Default::default()
            },
            first,
            offset,
            order,
        };

        let result = dgraph::pending_changes(&self.client, dgraph_vars)
            .await
            .map_err(|e| UniversalCodesServiceError::InternalError(e.message().to_string()))?; // TODO: Improve error handling?

        match result {
            Some(data) => Ok(PendingChangeCollection {
                data: data.data,
                total_length: data.aggregates.unwrap_or_default().count,
            }),
            None => Ok(PendingChangeCollection {
                data: vec![],
                total_length: 0,
            }),
        }
    }

    pub async fn upsert_pending_change(
        &self,
        sp: Arc<ServiceProvider>,
        user_id: String,
        pending_change: upsert_pending_change::UpsertPendingChange,
    ) -> Result<PendingChange, ModifyUniversalCodeError> {
        upsert_pending_change::upsert_pending_change(
            sp,
            user_id,
            self.client.clone(),
            pending_change,
        )
        .await
    }

    pub async fn approve_pending_change(
        &self,
        sp: Arc<ServiceProvider>,
        user_id: String,
        request_id: String,
        entity: upsert::UpsertUniversalCode,
    ) -> Result<Entity, ModifyUniversalCodeError> {
        approve_pending_change::approve_pending_change(
            sp,
            user_id,
            self.client.clone(),
            request_id,
            entity,
        )
        .await
    }

    pub async fn upsert_entity(
        &self,
        sp: Arc<ServiceProvider>,
        user_id: String,
        entity: upsert::UpsertUniversalCode,
    ) -> Result<Entity, ModifyUniversalCodeError> {
        upsert::upsert_entity(sp, user_id, self.client.clone(), entity).await
    }
}
