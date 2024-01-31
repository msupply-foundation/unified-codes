use async_graphql::*;
use dgraph::GS1Info;

#[derive(Clone, Debug)]
pub struct GS1Type {
    pub manufacturer: String,
    pub gtin: String,
}

#[Object]
impl GS1Type {
    pub async fn id(&self) -> &str {
        &self.gtin
    }

    pub async fn manufacturer(&self) -> &str {
        &self.manufacturer
    }

    pub async fn gtin(&self) -> &str {
        &self.gtin
    }
}

impl GS1Type {
    pub fn from_domain(entity_gs1s: Vec<GS1Info>) -> Vec<GS1Type> {
        entity_gs1s
            .into_iter()
            .map(|g| GS1Type {
                gtin: g.gtin,
                manufacturer: g.manufacturer,
            })
            .collect()
    }
}
