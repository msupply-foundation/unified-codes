use async_graphql::*;
use dgraph::Property;

#[derive(Clone, Debug)]
pub struct PropertiesType {
    pub code: String,
    pub key: String,
    pub value: String,
}

#[Object]
impl PropertiesType {
    pub async fn code(&self) -> &str {
        &self.code
    }

    pub async fn r#type(&self) -> &str {
        &self.key
    }

    pub async fn value(&self) -> &str {
        &self.value
    }
}

impl PropertiesType {
    pub fn from_domain(properties: Vec<Property>) -> Vec<PropertiesType> {
        properties
            .into_iter()
            .map(|p| PropertiesType {
                code: p.code,
                key: p.key,
                value: p.value,
            })
            .collect()
    }
}
