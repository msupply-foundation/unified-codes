use async_graphql::*;

use graphql_core::{
    standard_graphql_error::{validate_auth, StandardGraphqlError},
    ContextExt,
};

use service::{
    auth::{Resource, ResourceAccessRequest},
    configuration::upsert::ModifyConfigurationError,
};

use crate::types::AddConfigurationItemInput;

pub async fn add_configuration_item(
    ctx: &Context<'_>,
    input: AddConfigurationItemInput,
) -> Result<u32> {
    let user = validate_auth(
        ctx,
        &ResourceAccessRequest {
            resource: Resource::MutateUniversalCodes,
        },
    )?;

    let service_context = ctx.service_context(Some(&user))?;
    match service_context
        .service_provider
        .configuration_service
        .add_configuration_item(
            ctx.service_provider(),
            service_context.user_id.clone(),
            input.into(),
        )
        .await
    {
        Ok(affected_items) => Ok(affected_items),
        Err(error) => map_error(error),
    }
}

fn map_error(error: ModifyConfigurationError) -> Result<u32> {
    use StandardGraphqlError::*;
    let formatted_error = format!("{:#?}", error);

    let graphql_error = match error {
        ModifyConfigurationError::InternalError(message) => InternalError(message),
        ModifyConfigurationError::DatabaseError(_) => InternalError(formatted_error),
        ModifyConfigurationError::DgraphError(gql_error) => {
            InternalError(format!("{:#?} - {:?}", gql_error, gql_error.json()))
        }
    };

    Err(graphql_error.extend())
}
