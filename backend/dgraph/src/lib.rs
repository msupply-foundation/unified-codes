use serde::{Deserialize, Serialize};

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
pub struct Entity {
    #[serde(default)]
    pub id: String,
    pub code: String,
    pub name: String,
    pub description: String,
    pub r#type: String,
    #[serde(default)]
    pub properties: Vec<Properties>,
    #[serde(default)]
    pub children: Vec<Entity>,
    #[serde(default)]
    pub parents: Vec<Entity>,
}

#[derive(Deserialize, Debug, Clone)]
pub struct Properties {
    #[serde(rename = "type")]
    pub key: String,
    pub value: String,
}

#[derive(Deserialize, Debug, Clone, Default)]
pub struct AggregateResult {
    pub count: u32,
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
}
