mod mutations;
use self::mutations::*;
mod types;

use async_graphql::*;
use graphql_core::ContextExt;
use types::{
    AddBarcodeInput, BarcodeCollectionConnector, BarcodeCollectionResponse, BarcodeResponse,
};

#[derive(Default, Clone)]
pub struct BarcodeQueries;

#[Object]
impl BarcodeQueries {
    /// Get all barcodes
    pub async fn barcodes(
        &self,
        ctx: &Context<'_>,
        first: Option<u32>,
        offset: Option<u32>,
    ) -> Result<BarcodeCollectionResponse> {
        let result = ctx
            .service_provider()
            .barcode_service
            .barcodes(first, offset)
            .await?;

        Ok(BarcodeCollectionResponse::Response(
            BarcodeCollectionConnector::from_domain(result),
        ))
    }
}

#[derive(Default, Clone)]
pub struct BarcodeMutations;

#[Object]
impl BarcodeMutations {
    async fn add_barcode(
        &self,
        ctx: &Context<'_>,
        input: AddBarcodeInput,
    ) -> Result<BarcodeResponse> {
        add_barcode(ctx, input).await
    }

    async fn delete_barcode(&self, ctx: &Context<'_>, gtin: String) -> Result<u32> {
        delete_barcode(ctx, gtin).await
    }
}
