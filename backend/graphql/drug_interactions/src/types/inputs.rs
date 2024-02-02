use async_graphql::*;
use service::drug_interactions::{
    upsert_group::UpsertDrugInteractionGroup, upsert_interaction::UpsertDrugInteraction,
};

use crate::DrugInteractionSeverityNode;

#[derive(InputObject, Clone)]
pub struct UpsertDrugInteractionGroupInput {
    pub id: String,
    pub name: String,
    pub description: Option<String>,
    pub drugs: Vec<String>,
}

impl From<UpsertDrugInteractionGroupInput> for UpsertDrugInteractionGroup {
    fn from(input: UpsertDrugInteractionGroupInput) -> Self {
        UpsertDrugInteractionGroup {
            interaction_group_id: input.id,
            name: input.name,
            description: input.description,
            drugs: input.drugs,
        }
    }
}

#[derive(InputObject, Clone)]
pub struct UpsertDrugInteractionInput {
    pub id: String,
    pub name: String,
    pub description: String,
    pub severity: DrugInteractionSeverityNode,
    pub action: String,
    pub reference: String,
    pub drug1: Option<String>,
    pub drug2: Option<String>,
    pub group1: Option<String>,
    pub group2: Option<String>,
}

impl From<UpsertDrugInteractionInput> for UpsertDrugInteraction {
    fn from(input: UpsertDrugInteractionInput) -> Self {
        UpsertDrugInteraction {
            interaction_id: input.id,
            name: input.name,
            description: input.description,
            severity: input.severity.to_domain(),
            action: input.action,
            reference: input.reference,
            drug_code_1: input.drug1,
            drug_code_2: input.drug2,
            interaction_group_id_1: input.group1,
            interaction_group_id_2: input.group2,
        }
    }
}
