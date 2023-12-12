use async_graphql::*;

#[derive(Clone, PartialEq, Eq, Debug)]
pub struct EntityType {
    pub id: String,
    pub code: String,
    pub description: String,
}

#[Object]
impl EntityType {
    pub async fn id(&self) -> &str {
        &self.id
    }
    pub async fn code(&self) -> &str {
        &self.code
    }
    pub async fn description(&self) -> &str {
        &self.description
    }
}

#[derive(Union)]
pub enum EntityResponse {
    Response(EntityType),
}
