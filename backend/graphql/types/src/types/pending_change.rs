use async_graphql::{Context, Enum, Object, SimpleObject, Union};
use chrono::{DateTime, Utc};
use dgraph::{ChangeType, PendingChange};
use graphql_core::simple_generic_errors::NodeError;
use serde::Serialize;
use service::universal_codes::pending_change_collection::PendingChangeCollection;

#[derive(Union)]
pub enum PendingChangesResponse {
    Response(PendingChangeConnector),
}

#[derive(Union)]
pub enum PendingChangeResponse {
    Error(NodeError),
    Response(PendingChangeNode),
}

#[derive(PartialEq, Debug, Clone)]
pub struct PendingChangeNode {
    pub pending_change: PendingChange,
}

#[Object]
impl PendingChangeNode {
    pub async fn id(&self) -> &str {
        &self.row().id
    }
    pub async fn name(&self) -> &str {
        &self.row().name
    }
    pub async fn category(&self) -> &str {
        &self.row().category
    }
    pub async fn change_type(&self) -> ChangeTypeNode {
        ChangeTypeNode::from_domain(self.row().change_type.clone())
    }
    pub async fn date_requested(&self) -> &DateTime<Utc> {
        &self.row().date_requested
    }
    pub async fn requested_for(&self) -> &str {
        &self.row().requested_for
    }
    pub async fn body(&self) -> &str {
        &self.row().body
    }

    // TODO!
    pub async fn requested_by(&self, _ctx: &Context<'_>) -> Result<&str, async_graphql::Error> {
        Ok("Some name here!")
        // let loader = ctx.get_loader::<DataLoader<UserPermissionLoader>>();
        // let result = loader
        //     .load_one(self.row().id.to_string())
        //     .await?
        //     .unwrap_or_default();

        // Ok(result
        //     .into_iter()
        //     .map(PermissionNode::from_domain)
        //     .collect())
    }
}

impl PendingChangeNode {
    pub fn from_domain(pending_change: PendingChange) -> PendingChangeNode {
        PendingChangeNode { pending_change }
    }

    pub fn row(&self) -> &PendingChange {
        &self.pending_change
    }
}

#[derive(SimpleObject)]
pub struct PendingChangeConnector {
    total_count: u32,
    nodes: Vec<PendingChangeNode>,
}

impl PendingChangeConnector {
    pub fn from_domain(pending_changes: PendingChangeCollection) -> PendingChangeConnector {
        PendingChangeConnector {
            total_count: pending_changes.total_length,
            nodes: pending_changes
                .data
                .into_iter()
                .map(PendingChangeNode::from_domain)
                .collect(),
        }
    }
}

#[derive(Enum, Copy, Clone, PartialEq, Eq, Debug, Serialize)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum ChangeTypeNode {
    New,
    Change,
}

impl ChangeTypeNode {
    pub fn to_domain(self) -> ChangeType {
        match self {
            ChangeTypeNode::Change => ChangeType::Change,
            ChangeTypeNode::New => ChangeType::New,
        }
    }

    pub fn from_domain(change_type: ChangeType) -> ChangeTypeNode {
        match change_type {
            ChangeType::Change => ChangeTypeNode::Change,
            ChangeType::New => ChangeTypeNode::New,
        }
    }
}
