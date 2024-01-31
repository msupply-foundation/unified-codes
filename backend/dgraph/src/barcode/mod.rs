use serde::Deserialize;

use crate::Entity;

pub mod barcode;
pub mod barcodes;
pub mod delete_barcode;
pub mod insert_barcode;

#[derive(Deserialize, Debug, Clone)]
pub struct Barcode {
    pub gtin: String,
    pub manufacturer: String,
    pub entity: Entity,
}

#[derive(Deserialize, Debug, Clone)]
pub struct BarcodeData {
    pub data: Vec<Barcode>,
}
