use async_graphql::*;
use datasource::Entity;

#[derive(Clone, Debug)]
pub struct EntityType {
    pub entity: Entity,
}

#[Object]
impl EntityType {
    pub async fn uid(&self) -> &str {
        &self.entity.id
    }
    pub async fn code(&self) -> &str {
        &self.entity.code
    }
    pub async fn description(&self) -> &str {
        &self.entity.description
    }
}

#[derive(Union)]
pub enum EntityResponse {
    Response(EntityType),
}
