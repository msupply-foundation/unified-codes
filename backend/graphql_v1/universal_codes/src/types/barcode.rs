use async_graphql::*;
use dgraph::BarcodeInfo;

#[derive(Clone, Debug)]
pub struct BarcodeType {
    pub manufacturer: String,
    pub gtin: String,
}

#[Object]
impl BarcodeType {
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

impl BarcodeType {
    pub fn from_domain(entity_barcodes: Vec<BarcodeInfo>) -> Vec<BarcodeType> {
        entity_barcodes
            .into_iter()
            .map(|g| BarcodeType {
                gtin: g.gtin,
                manufacturer: g.manufacturer,
            })
            .collect()
    }
}
