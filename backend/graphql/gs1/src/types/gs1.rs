use async_graphql::*;
use dgraph::GS1;
use graphql_universal_codes_v1::EntityType;
use service::gs1::GS1Collection;

#[derive(Clone, Debug)]
pub struct GS1Node {
    pub row: GS1,
}

impl GS1Node {
    pub fn from_domain(gs1: GS1) -> GS1Node {
        GS1Node { row: gs1 }
    }
}

#[Object]
impl GS1Node {
    pub async fn id(&self) -> &str {
        &self.row.gtin
    }

    pub async fn gtin(&self) -> &str {
        &self.row.gtin
    }
    pub async fn manufacturer(&self) -> &str {
        &self.row.manufacturer
    }
    pub async fn r#type(&self) -> EntityType {
        EntityType::from_domain(self.row.entity.clone())
    }
}

#[derive(Debug, SimpleObject)]
pub struct GS1CollectionConnector {
    pub data: Vec<GS1Node>,
    pub total_count: u32,
}

impl GS1CollectionConnector {
    pub fn from_domain(results: GS1Collection) -> GS1CollectionConnector {
        GS1CollectionConnector {
            total_count: results.total_length,
            data: results.data.into_iter().map(GS1Node::from_domain).collect(),
        }
    }
}

#[derive(Union)]
pub enum GS1Response {
    Response(GS1Node),
}
#[derive(Union)]
pub enum GS1CollectionResponse {
    Response(GS1CollectionConnector),
}
