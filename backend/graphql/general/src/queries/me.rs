use async_graphql::*;
use graphql_core::{
    standard_graphql_error::{validate_auth, StandardGraphqlError},
    ContextExt,
};

use graphql_types::types::UserAccountNode;
use service::auth::{Resource, ResourceAccessRequest};

#[derive(Union)]
pub enum UserResponse {
    Response(UserAccountNode),
}

pub fn me(ctx: &Context<'_>) -> Result<UserResponse> {
    let user = validate_auth(
        ctx,
        &ResourceAccessRequest {
            resource: Resource::RouteMe,
        },
    )?;

    let service_ctx = ctx.service_context(Some(&user))?;
    let user = match service_ctx
        .service_provider
        .user_account_service
        .get_user_account(&service_ctx, user.user_id)
    {
        Ok(user) => user,
        Err(err) => {
            return Err(StandardGraphqlError::InternalError(format!(
                "Can't find user account data : {:?}",
                err
            ))
            .extend())
        }
    };

    Ok(UserResponse::Response(UserAccountNode::from_domain(user)))
}
