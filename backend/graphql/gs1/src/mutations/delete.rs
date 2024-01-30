use async_graphql::*;

use graphql_core::{
    standard_graphql_error::{validate_auth, StandardGraphqlError},
    ContextExt,
};

use service::{
    auth::{Resource, ResourceAccessRequest},
    gs1::ModifyGS1Error,
};

pub async fn delete_gs1(ctx: &Context<'_>, gtin: String) -> Result<u32> {
    let user = validate_auth(
        ctx,
        &ResourceAccessRequest {
            resource: Resource::MutateUniversalCodes,
        },
    )?;

    let service_context = ctx.service_context(Some(&user))?;
    match service_context
        .service_provider
        .gs1_service
        .delete_gs1(
            ctx.service_provider(),
            service_context.user_id.clone(),
            gtin,
        )
        .await
    {
        Ok(affected_items) => Ok(affected_items),
        Err(error) => map_modify_gs1_error(error),
    }
}

fn map_modify_gs1_error(error: ModifyGS1Error) -> Result<u32, Error> {
    use StandardGraphqlError::*;
    let formatted_error = format!("{:#?}", error);

    let graphql_error = match error {
        ModifyGS1Error::GS1AlreadyExists => BadUserInput(formatted_error),
        ModifyGS1Error::GS1DoesNotExist => BadUserInput(formatted_error),
        ModifyGS1Error::UniversalCodeDoesNotExist => BadUserInput(formatted_error),
        ModifyGS1Error::InternalError(message) => InternalError(message),
        ModifyGS1Error::DatabaseError(_) => InternalError(formatted_error),
        ModifyGS1Error::DgraphError(gql_error) => {
            InternalError(format!("{:#?} - {:?}", gql_error, gql_error.json()))
        }
    };

    Err(graphql_error.extend())
}
