use async_graphql::*;

use graphql_core::{standard_graphql_error::validate_auth, ContextExt};

use service::auth::{Resource, ResourceAccessRequest};

use crate::map_modify_config_error;

pub async fn delete_configuration_item(ctx: &Context<'_>, code: String) -> Result<u32> {
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
        .delete_configuration_item(
            ctx.service_provider(),
            service_context.user_id.clone(),
            code,
        )
        .await
    {
        Ok(affected_items) => Ok(affected_items),
        Err(error) => map_modify_config_error(error),
    }
}
