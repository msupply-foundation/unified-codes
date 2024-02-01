use async_graphql::*;

use graphql_core::{standard_graphql_error::validate_auth, ContextExt};

use service::auth::{Resource, ResourceAccessRequest};

use crate::{
    map_modify_barcode_error,
    types::{AddBarcodeInput, BarcodeNode, BarcodeResponse},
};

pub async fn add_barcode(ctx: &Context<'_>, input: AddBarcodeInput) -> Result<BarcodeResponse> {
    let user = validate_auth(
        ctx,
        &ResourceAccessRequest {
            resource: Resource::MutateUniversalCodes,
        },
    )?;

    let service_context = ctx.service_context(Some(&user))?;
    match service_context
        .service_provider
        .barcode_service
        .add_barcode(
            ctx.service_provider(),
            service_context.user_id.clone(),
            input.into(),
        )
        .await
    {
        Ok(barcode) => Ok(BarcodeResponse::Response(BarcodeNode::from_domain(barcode))),
        Err(error) => map_modify_barcode_error(error),
    }
}
