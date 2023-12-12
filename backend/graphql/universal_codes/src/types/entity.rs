use async_graphql::*;
use datasource::{Entity, Properties};

#[derive(Clone, Debug)]
pub struct EntityType {
    pub id: String,
    pub code: String,
    pub description: String,
    pub properties: Vec<PropertiesType>,
    pub children: Vec<EntityType>,
}

impl EntityType {
    pub fn from_domain(entity: Entity) -> EntityType {
        EntityType {
            id: entity.id,
            code: entity.code,
            description: entity.description,
            properties: PropertiesType::from_domain(entity.properties),
            children: entity
                .children
                .iter()
                .map(|c| EntityType::from_domain(c.clone()))
                .collect(),
        }
    }
}

#[derive(Clone, Debug)]
pub struct PropertiesType {
    pub key: String,
    pub value: String,
}

#[Object]
impl PropertiesType {
    pub async fn r#type(&self) -> &str {
        &self.key
    }
    pub async fn value(&self) -> &str {
        &self.value
    }
}

impl PropertiesType {
    fn from_domain(properties: Vec<Properties>) -> Vec<PropertiesType> {
        properties
            .into_iter()
            .map(|p| PropertiesType {
                key: p.key,
                value: p.value,
            })
            .collect()
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

    pub async fn properties(&self) -> &Vec<PropertiesType> {
        &self.properties
    }

    pub async fn children(&self) -> &Vec<EntityType> {
        &self.children
    }
}

#[derive(Union)]
pub enum EntityResponse {
    Response(EntityType),
}
