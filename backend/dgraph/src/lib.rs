use serde::{Deserialize, Deserializer, Serialize};

use chrono::{DateTime, NaiveDateTime, Utc};

pub mod update_pending_change;
pub use update_pending_change::*;
pub mod add_pending_change;
pub use add_pending_change::*;
pub mod client;
pub use client::*;
pub mod database_settings;
pub use database_settings::*;
pub mod entity;
pub use entity::*;
pub mod entity_duplication;
pub use entity_duplication::*;
pub mod entities;
pub use entities::*;
pub mod pending_change;
pub use pending_change::*;
pub mod pending_changes;
pub use pending_changes::*;
pub mod upsert_entity;
pub use upsert_entity::*;
pub mod link_codes;
pub use link_codes::*;

pub use gql_client::GraphQLError;

// Types to represent the dgraph graphql data
#[allow(non_snake_case)]
#[derive(Deserialize, Debug, Clone)]
pub struct EntityData {
    pub data: Vec<Entity>,
    #[serde(default)]
    pub aggregates: Option<AggregateResult>,
}

#[derive(Deserialize, Debug, Clone)]
pub struct PendingChangeData {
    pub data: Vec<PendingChange>,
    #[serde(default)]
    pub aggregates: Option<AggregateResult>,
}

fn null_as_empty_string<'de, D>(d: D) -> Result<String, D::Error>
where
    D: Deserializer<'de>,
{
    Deserialize::deserialize(d).map(|x: Option<_>| x.unwrap_or_else(|| "".to_string()))
}

#[derive(Deserialize, Debug, Clone, Default)]
pub struct Entity {
    #[serde(default)]
    pub id: String,
    pub code: String,
    #[serde(default)]
    #[serde(deserialize_with = "null_as_empty_string")]
    pub name: String,
    #[serde(default)]
    #[serde(deserialize_with = "null_as_empty_string")]
    pub description: String,
    #[serde(default)]
    #[serde(deserialize_with = "null_as_empty_string")]
    pub r#type: String,
    #[serde(default)]
    #[serde(deserialize_with = "null_as_empty_string")]
    pub category: String,
    #[serde(default)]
    pub properties: Vec<Property>,
    #[serde(default)]
    pub children: Vec<Entity>,
    #[serde(default)]
    pub parents: Vec<Entity>,
}

#[derive(Deserialize, Debug, Clone)]
pub struct Property {
    pub code: String,
    #[serde(rename = "type")]
    #[serde(deserialize_with = "null_as_empty_string")]
    pub key: String,
    #[serde(deserialize_with = "null_as_empty_string")]
    pub value: String,
}

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq, Eq, Hash)]
pub enum ChangeType {
    Change,
    New,
}

impl Default for ChangeType {
    fn default() -> Self {
        ChangeType::New
    }
}

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq, Eq, Hash)]
pub enum ChangeStatus {
    Pending,
    Approved,
    Rejected,
}

impl Default for ChangeStatus {
    fn default() -> Self {
        ChangeStatus::Pending
    }
}

#[derive(Deserialize, Debug, Clone, Default, PartialEq)]
pub struct PendingChange {
    #[serde(default)]
    pub id: String,
    #[serde(default)]
    pub request_id: String,
    #[serde(default)]
    pub name: String,
    #[serde(default)]
    pub category: String,
    #[serde(default)]
    pub change_type: ChangeType,
    #[serde(default)]
    pub date_requested: DateTime<Utc>,
    #[serde(default)]
    pub requested_by_user_id: String,
    #[serde(default)]
    pub requested_for: String,
    #[serde(default)]
    pub status: ChangeStatus,
    #[serde(default)]
    pub body: String,
}

#[derive(Deserialize, Debug, Clone, Default)]
pub struct AggregateResult {
    pub count: u32,
}

#[derive(Serialize, Debug, Clone, Default)]
pub struct PropertyInput {
    pub code: String,
    #[serde(rename = "type")]
    #[serde(default)]
    pub key: String,
    #[serde(default)]
    pub value: String,
}

#[derive(Serialize, Debug, Clone, Default)]
pub struct EntityInput {
    pub code: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub r#type: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub name: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub category: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub properties: Option<Vec<PropertyInput>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub children: Option<Vec<EntityInput>>,
}

#[derive(Serialize, Debug, Clone, Default)]
pub struct PendingChangeInput {
    pub request_id: String,
    pub name: String,
    pub category: String,
    pub change_type: ChangeType,
    pub date_requested: NaiveDateTime,
    pub requested_by_user_id: String,
    pub requested_for: String,
    pub status: ChangeStatus,
    pub body: String,
}

#[derive(Serialize, Debug, Clone, Default)]
pub struct PendingChangePatch {
    pub name: Option<String>,
    pub status: Option<ChangeStatus>,
    pub body: Option<String>,
}
