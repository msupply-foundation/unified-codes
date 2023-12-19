use async_graphql::*;

#[derive(Clone, Debug)]
pub struct DrugInteractionType {
    pub description: String,
    pub name: String,
    pub rxcui: String,
    pub severity: String,
    pub source: String,
}

#[Object]
impl DrugInteractionType {
    pub async fn description(&self) -> &str {
        &self.description
    }
    pub async fn name(&self) -> &str {
        &self.name
    }
    pub async fn rxcui(&self) -> &str {
        &self.rxcui
    }
    pub async fn severity(&self) -> &str {
        &self.severity
    }
    pub async fn source(&self) -> &str {
        &self.source
    }
}
