mod mutations;
use self::mutations::*;
mod types;

use async_graphql::*;
use graphql_core::ContextExt;
use types::{AddGS1Input, GS1CollectionConnector, GS1CollectionResponse, GS1Response};

#[derive(Default, Clone)]
pub struct GS1Queries;

#[Object]
impl GS1Queries {
    /// Get all GS1s
    pub async fn gs1_barcodes(
        &self,
        ctx: &Context<'_>,
        // order_by: Option<GS1OrderByInput>,
        // first: Option<u32>,
        // offset: Option<u32>,
    ) -> Result<GS1CollectionResponse> {
        let result = ctx.service_provider().gs1_service.gs1s().await?;

        Ok(GS1CollectionResponse::Response(
            GS1CollectionConnector::from_domain(result),
        ))
    }
}

#[derive(Default, Clone)]
pub struct GS1Mutations;

#[Object]
impl GS1Mutations {
    async fn add_gs1(&self, ctx: &Context<'_>, input: AddGS1Input) -> Result<GS1Response> {
        add_gs1(ctx, input).await
    }

    async fn delete_gs1(&self, ctx: &Context<'_>, gtin: String) -> Result<u32> {
        delete_gs1(ctx, gtin).await
    }
}
