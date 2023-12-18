use serde::Deserialize;

pub mod database_settings;
pub use database_settings::*;
pub mod entity;
pub use entity::*;
pub mod entities;
pub use entities::*;
pub mod client;
pub use client::*;

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
    #[serde(rename = "__typename")]
    pub key: String,
    pub value: String,
}

#[derive(Deserialize, Debug, Clone, Default)]
pub struct AggregateResult {
    pub count: u32,
}
