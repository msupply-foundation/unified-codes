use async_graphql::*;

use graphql_core::{
    standard_graphql_error::{validate_auth, StandardGraphqlError},
    ContextExt,
};

use graphql_types::types::IdResponse;
use service::{
    auth::{Resource, ResourceAccessRequest},
    universal_codes::ModifyUniversalCodeError,
};

pub async fn reject_pending_change(ctx: &Context<'_>, request_id: String) -> Result<IdResponse> {
    let user = validate_auth(
        ctx,
        &ResourceAccessRequest {
            resource: Resource::MutateUniversalCodes,
        },
    )?;

    let service_context = ctx.service_context(Some(&user))?;
    match service_context
        .service_provider
        .universal_codes_service
        .reject_pending_change(
            ctx.service_provider(),
            service_context.user_id.clone(),
            request_id.clone(),
        )
        .await
    {
        Ok(id) => Ok(IdResponse(id)),
        Err(error) => map_error(error),
    }
}

fn map_error(error: ModifyUniversalCodeError) -> Result<IdResponse> {
    use StandardGraphqlError::*;
    let formatted_error = format!("{:#?}", error);

    let graphql_error = match error {
        ModifyUniversalCodeError::InternalError(message) => InternalError(message),
        ModifyUniversalCodeError::UniversalCodeDoesNotExist => BadUserInput(formatted_error),
        ModifyUniversalCodeError::UniversalCodeAlreadyExists => BadUserInput(formatted_error),
        ModifyUniversalCodeError::PendingChangeDoesNotExist => BadUserInput(formatted_error),
        ModifyUniversalCodeError::PendingChangeAlreadyExists => BadUserInput(formatted_error),
        ModifyUniversalCodeError::DescriptionAlreadyExists(msg) => BadUserInput(msg),
        ModifyUniversalCodeError::NotAuthorised => Forbidden(formatted_error),
        ModifyUniversalCodeError::DatabaseError(_) => InternalError(formatted_error),
        ModifyUniversalCodeError::DgraphError(gql_error) => {
            InternalError(format!("{:#?} - {:?}", gql_error, gql_error.json()))
        }
    };

    Err(graphql_error.extend())
}
