use serde::Deserialize;

use crate::Entity;

pub mod delete_interaction_group;
pub mod insert_interaction_group;
pub mod interaction_group;
pub mod interaction_groups;
pub mod update_interaction_group;

#[derive(Deserialize, Debug, Clone)]
pub struct InteractionGroup {
    pub interaction_group_id: String,
    pub name: String,
    pub description: Option<String>,
    pub drugs: Vec<Entity>,
}

#[derive(Deserialize, Debug, Clone)]
pub struct InteractionGroupsData {
    pub data: Vec<InteractionGroup>,
}

#[derive(Deserialize, Debug, Clone)]
pub struct InteractionGroupData {
    pub data: Option<InteractionGroup>,
}
