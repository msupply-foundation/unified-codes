use serde::Deserialize;

use crate::Entity;

pub mod delete_gs1;
pub mod gs1;
pub mod gs1s;
pub mod insert_gs1;

#[derive(Deserialize, Debug, Clone)]
pub struct GS1 {
    pub gtin: String,
    pub manufacturer: String,
    pub entity: Entity,
}

#[derive(Deserialize, Debug, Clone)]
pub struct GS1Data {
    pub data: Vec<GS1>,
}
