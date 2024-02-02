use serde::{Deserialize, Serialize};

use crate::{Entity, InteractionGroup};

pub mod delete_interaction;
pub mod insert_interaction;
pub mod interaction;
pub mod interactions;
pub mod update_interaction;

#[derive(Deserialize, Serialize, Debug, Clone, PartialEq)]
pub enum DrugInteractionSeverity {
    Severe,
    Moderate,
    NothingExpected,
}

#[derive(Serialize, Debug, Clone)]
pub struct InteractionGroupRef {
    pub interaction_group_id: String,
}

#[derive(Deserialize, Debug, Clone)]
pub struct DrugInteraction {
    pub interaction_id: String,
    pub name: String,
    pub description: Option<String>,
    pub action: Option<String>,
    pub severity: Option<DrugInteractionSeverity>,
    pub reference: Option<String>,
    pub drugs: Vec<Entity>,
    pub groups: Vec<InteractionGroup>,
}

#[derive(Deserialize, Debug, Clone)]
pub struct DrugInteractionsData {
    pub data: Vec<DrugInteraction>,
}

#[derive(Deserialize, Debug, Clone)]
pub struct DrugInteractionData {
    pub data: Option<DrugInteraction>,
}
