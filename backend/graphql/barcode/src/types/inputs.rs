use async_graphql::*;
use service::barcodes::upsert::AddBarcode;

#[derive(InputObject, Clone)]
pub struct AddBarcodeInput {
    pub gtin: String,
    pub manufacturer: String,
    pub entity_code: String,
}

impl From<AddBarcodeInput> for AddBarcode {
    fn from(input: AddBarcodeInput) -> Self {
        AddBarcode {
            gtin: input.gtin,
            manufacturer: input.manufacturer,
            entity_code: input.entity_code,
        }
    }
}
