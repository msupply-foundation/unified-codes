use async_graphql::*;
use dgraph::Barcode;
use graphql_universal_codes_v1::EntityType;
use service::barcodes::BarcodeCollection;

#[derive(Clone, Debug)]
pub struct BarcodeNode {
    pub row: Barcode,
}

impl BarcodeNode {
    pub fn from_domain(barcode: Barcode) -> BarcodeNode {
        BarcodeNode { row: barcode }
    }
}

#[Object]
impl BarcodeNode {
    pub async fn id(&self) -> &str {
        &self.row.gtin
    }

    pub async fn gtin(&self) -> &str {
        &self.row.gtin
    }
    pub async fn manufacturer(&self) -> &str {
        &self.row.manufacturer
    }
    pub async fn entity(&self) -> EntityType {
        EntityType::from_domain(self.row.entity.clone())
    }
}

#[derive(Debug, SimpleObject)]
pub struct BarcodeCollectionConnector {
    pub data: Vec<BarcodeNode>,
    pub total_count: u32,
}

impl BarcodeCollectionConnector {
    pub fn from_domain(results: BarcodeCollection) -> BarcodeCollectionConnector {
        BarcodeCollectionConnector {
            total_count: results.total_length,
            data: results
                .data
                .into_iter()
                .map(BarcodeNode::from_domain)
                .collect(),
        }
    }
}

#[derive(Union)]
pub enum BarcodeResponse {
    Response(BarcodeNode),
}
#[derive(Union)]
pub enum BarcodeCollectionResponse {
    Response(BarcodeCollectionConnector),
}
