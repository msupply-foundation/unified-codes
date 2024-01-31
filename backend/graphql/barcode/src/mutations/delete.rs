use async_graphql::*;

use graphql_core::{
    standard_graphql_error::{validate_auth, StandardGraphqlError},
    ContextExt,
};

use service::{
    auth::{Resource, ResourceAccessRequest},
    barcodes::ModifyBarcodeError,
};

pub async fn delete_barcode(ctx: &Context<'_>, gtin: String) -> Result<u32> {
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
        .delete_barcode(
            ctx.service_provider(),
            service_context.user_id.clone(),
            gtin,
        )
        .await
    {
        Ok(affected_items) => Ok(affected_items),
        Err(error) => map_modify_barcode_error(error),
    }
}

fn map_modify_barcode_error(error: ModifyBarcodeError) -> Result<u32, Error> {
    use StandardGraphqlError::*;
    let formatted_error = format!("{:#?}", error);

    let graphql_error = match error {
        ModifyBarcodeError::BarcodeAlreadyExists => BadUserInput(formatted_error),
        ModifyBarcodeError::BarcodeDoesNotExist => BadUserInput(formatted_error),
        ModifyBarcodeError::UniversalCodeDoesNotExist => BadUserInput(formatted_error),
        ModifyBarcodeError::InternalError(message) => InternalError(message),
        ModifyBarcodeError::DatabaseError(_) => InternalError(formatted_error),
        ModifyBarcodeError::DgraphError(gql_error) => {
            InternalError(format!("{:#?} - {:?}", gql_error, gql_error.json()))
        }
    };

    Err(graphql_error.extend())
}
