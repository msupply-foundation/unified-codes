use async_graphql::*;
use dgraph::Properties;

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
    pub fn from_domain(properties: Vec<Properties>) -> Vec<PropertiesType> {
        properties
            .into_iter()
            .map(|p| PropertiesType {
                key: p.key,
                value: p.value,
            })
            .collect()
    }
}
