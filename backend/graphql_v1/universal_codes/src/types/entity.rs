use async_graphql::*;
use dgraph::Entity;

use super::DrugInteractionType;
use super::PropertiesType;

#[derive(Clone, Debug)]
pub struct EntityType {
    pub id: String,
    pub code: String,
    pub description: String,
    pub r#type: String,
    pub properties: Vec<PropertiesType>,
    pub children: Vec<EntityType>,
}

impl EntityType {
    pub fn from_domain(entity: Entity) -> EntityType {
        EntityType {
            id: entity.id,
            code: entity.code,
            description: entity.description,
            r#type: entity.r#type,
            properties: PropertiesType::from_domain(entity.properties),
            children: entity
                .children
                .iter()
                .map(|c| EntityType::from_domain(c.clone()))
                .collect(),
        }
    }
}

#[Object]
impl EntityType {
    pub async fn uid(&self) -> &str {
        &self.id
    }
    pub async fn code(&self) -> &str {
        &self.code
    }
    pub async fn description(&self) -> &str {
        &self.description
    }
    pub async fn r#type(&self) -> &str {
        &self.r#type
    }

    pub async fn properties(&self) -> &Vec<PropertiesType> {
        &self.properties
    }

    pub async fn children(&self) -> &Vec<EntityType> {
        &self.children
    }

    pub async fn product(&self) -> Option<EntityType> {
        // TODO: Probably a loader? Implement Product Lookup
        None
    }

    pub async fn parents(&self) -> Vec<EntityType> {
        // TODO: Probably a loader? Implement Parent Lookup
        vec![]
    }

    pub async fn interactions(&self) -> Option<Vec<DrugInteractionType>> {
        // TODO: Probably a loader? Implement Drug Interaction Lookup
        None
    }
}
