use async_graphql::*;
use dgraph::interaction_groups::InteractionGroup;
use graphql_universal_codes_v1::EntityType;
use service::drug_interactions::InteractionGroupCollection;

#[derive(Clone, Debug)]
pub struct DrugInteractionGroupNode {
    pub row: InteractionGroup,
}

impl DrugInteractionGroupNode {
    pub fn from_domain(group: InteractionGroup) -> DrugInteractionGroupNode {
        DrugInteractionGroupNode { row: group }
    }
}

#[Object]
impl DrugInteractionGroupNode {
    pub async fn id(&self) -> &str {
        &self.row.interaction_group_id
    }
    pub async fn name(&self) -> &str {
        &self.row.name
    }

    pub async fn description(&self) -> Option<String> {
        self.row.description.clone()
    }

    pub async fn drugs(&self) -> Vec<EntityType> {
        self.row
            .drugs
            .iter()
            .map(|drug| EntityType::from_domain(drug.clone()))
            .collect()
    }
}

#[derive(Debug, SimpleObject)]
pub struct DrugInteractionGroupConnector {
    pub data: Vec<DrugInteractionGroupNode>,
    pub total_count: u32,
}

impl DrugInteractionGroupConnector {
    pub fn from_domain(results: InteractionGroupCollection) -> DrugInteractionGroupConnector {
        DrugInteractionGroupConnector {
            total_count: results.total_length,
            data: results
                .data
                .into_iter()
                .map(DrugInteractionGroupNode::from_domain)
                .collect(),
        }
    }
}

#[derive(Union)]
pub enum DrugInteractionGroupResponse {
    Response(DrugInteractionGroupNode),
}
#[derive(Union)]
pub enum DrugInteractionGroupsResponse {
    Response(DrugInteractionGroupConnector),
}
