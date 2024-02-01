use async_graphql::*;
use dgraph::{DrugInteraction, DrugInteractionSeverity};
use graphql_universal_codes_v1::EntityType;
use service::drug_interactions::DrugInteractionCollection;

use crate::DrugInteractionGroupNode;

#[derive(Enum, Copy, Clone, PartialEq, Eq)]
pub enum DrugInteractionSeverityNode {
    Severe,
    Moderate,
    NothingExpected,
    Unknown,
}

impl DrugInteractionSeverityNode {
    pub fn from_domain(from: &DrugInteractionSeverity) -> DrugInteractionSeverityNode {
        match from {
            DrugInteractionSeverity::Severe => DrugInteractionSeverityNode::Severe,
            DrugInteractionSeverity::Moderate => DrugInteractionSeverityNode::Moderate,
            DrugInteractionSeverity::NothingExpected => {
                DrugInteractionSeverityNode::NothingExpected
            }
        }
    }

    pub fn to_domain(self) -> DrugInteractionSeverity {
        match self {
            DrugInteractionSeverityNode::Severe => DrugInteractionSeverity::Severe,
            DrugInteractionSeverityNode::Moderate => DrugInteractionSeverity::Moderate,
            DrugInteractionSeverityNode::NothingExpected => {
                DrugInteractionSeverity::NothingExpected
            }
            DrugInteractionSeverityNode::Unknown => DrugInteractionSeverity::NothingExpected,
        }
    }
}

#[derive(Clone, Debug)]
pub struct DrugInteractionNode {
    pub row: DrugInteraction,
}

impl DrugInteractionNode {
    pub fn from_domain(interaction: DrugInteraction) -> DrugInteractionNode {
        DrugInteractionNode { row: interaction }
    }
}

#[Object]
impl DrugInteractionNode {
    pub async fn id(&self) -> &str {
        &self.row.interaction_id
    }
    pub async fn name(&self) -> &str {
        &self.row.name
    }

    pub async fn description(&self) -> Option<String> {
        self.row.description.clone()
    }

    pub async fn action(&self) -> Option<String> {
        self.row.action.clone()
    }

    pub async fn severity(&self) -> DrugInteractionSeverityNode {
        self.row.severity.as_ref().map_or_else(
            || DrugInteractionSeverityNode::Unknown,
            |s| DrugInteractionSeverityNode::from_domain(s),
        )
    }

    pub async fn reference(&self) -> Option<String> {
        self.row.reference.clone()
    }

    pub async fn drug1(&self) -> Option<EntityType> {
        // if there is a group defined, we'll always return that as #1, so we don't return a drug1 if we have any groups
        if self.row.groups.len() > 0 {
            return None;
        }
        if self.row.drugs.len() > 0 {
            let drug = &self.row.drugs[0];
            return Some(EntityType::from_domain(drug.clone()));
        }

        None
    }

    pub async fn drug2(&self) -> Option<EntityType> {
        // if there is a group defined, we'll always return that as #1,
        // so if we only have drug1 and one group, drug2 actually returns the first (and only drug)
        if self.row.groups.len() > 0 && self.row.drugs.len() > 0 {
            let drug = &self.row.drugs[0];
            return Some(EntityType::from_domain(drug.clone()));
        }
        if self.row.drugs.len() > 1 {
            let drug = &self.row.drugs[1];
            return Some(EntityType::from_domain(drug.clone()));
        }

        None
    }

    pub async fn group1(&self) -> Option<DrugInteractionGroupNode> {
        if self.row.groups.len() > 0 {
            let group = &self.row.groups[0];
            return Some(DrugInteractionGroupNode::from_domain(group.clone()));
        }

        None
    }

    pub async fn group2(&self) -> Option<DrugInteractionGroupNode> {
        if self.row.groups.len() > 1 {
            let group = &self.row.groups[1];
            return Some(DrugInteractionGroupNode::from_domain(group.clone()));
        }

        None
    }
}

#[derive(Debug, SimpleObject)]
pub struct DrugInteractionConnector {
    pub data: Vec<DrugInteractionNode>,
    pub total_count: u32,
}

impl DrugInteractionConnector {
    pub fn from_domain(results: DrugInteractionCollection) -> DrugInteractionConnector {
        DrugInteractionConnector {
            total_count: results.total_length,
            data: results
                .data
                .into_iter()
                .map(DrugInteractionNode::from_domain)
                .collect(),
        }
    }
}

#[derive(Union)]
pub enum DrugInteractionResponse {
    Response(DrugInteractionNode),
}
#[derive(Union)]
pub enum DrugInteractionsResponse {
    Response(DrugInteractionConnector),
}
