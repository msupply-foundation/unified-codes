use async_graphql::*;

#[derive(Clone, Debug)]
pub struct AlternativeNameType {
    pub code: String,
    pub name: String,
}

#[Object]
impl AlternativeNameType {
    pub async fn code(&self) -> &str {
        &self.code
    }

    pub async fn name(&self) -> &str {
        &self.name
    }

    pub async fn r#type(&self) -> &str {
        "alternative_name"
    }
}

impl AlternativeNameType {
    pub fn from_domain(names: String) -> Vec<AlternativeNameType> {
        names
            .split(",")
            .map(|name| AlternativeNameType {
                code: name.to_string(),
                name: name.to_string(),
            })
            .collect()
    }
}
