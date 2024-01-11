use async_graphql::*;

use graphql_core::{
    standard_graphql_error::{validate_auth, StandardGraphqlError},
    ContextExt,
};

use service::{
    auth::{Resource, ResourceAccessRequest},
    universal_codes::ModifyUniversalCodeError,
};

use crate::types::{UpsertEntityInput, UpsertEntityResponse};
use graphql_universal_codes_v1::EntityType;

pub async fn upsert_entity(
    ctx: &Context<'_>,
    input: UpsertEntityInput,
) -> Result<UpsertEntityResponse> {
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
        .upsert_entity(
            ctx.service_provider(),
            service_context.user_id.clone(),
            input.into(),
        )
        .await
    {
        Ok(entity) => Ok(UpsertEntityResponse::Response(EntityType::from_domain(
            entity,
        ))),
        Err(error) => map_error(error),
    }
}

fn map_error(error: ModifyUniversalCodeError) -> Result<UpsertEntityResponse> {
    use StandardGraphqlError::*;
    let formatted_error = format!("{:#?}", error);

    let graphql_error = match error {
        ModifyUniversalCodeError::InternalError(message) => InternalError(message),
        ModifyUniversalCodeError::UniversalCodeDoesNotExist => BadUserInput(formatted_error),
        ModifyUniversalCodeError::UniversalCodeAlreadyExists => BadUserInput(formatted_error),
        ModifyUniversalCodeError::DescriptionAlreadyExists(msg) => BadUserInput(msg),
        ModifyUniversalCodeError::NotAuthorised => Forbidden(formatted_error),
        ModifyUniversalCodeError::DatabaseError(_) => InternalError(formatted_error),
        ModifyUniversalCodeError::DgraphError(gql_error) => {
            InternalError(format!("{:#?} - {:?}", gql_error, gql_error.json()))
        }
    };

    Err(graphql_error.extend())
}
