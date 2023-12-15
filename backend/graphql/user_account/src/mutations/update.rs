use async_graphql::*;

use graphql_core::{
    standard_graphql_error::{validate_auth, StandardGraphqlError},
    ContextExt,
};
use graphql_types::types::{PermissionNode, UserAccountNode};
use service::{
    auth::{Resource, ResourceAccessRequest},
    user_account::update::UpdateUserAccount,
    user_account::ModifyUserAccountError as ServiceError,
};

pub fn update_user_account(
    ctx: &Context<'_>,
    input: UpdateUserAccountInput,
) -> Result<UpdateUserAccountResponse> {
    let user = validate_auth(
        ctx,
        &ResourceAccessRequest {
            resource: Resource::MutateUsers,
        },
    )?;

    let service_context = ctx.service_context(Some(&user))?;
    match service_context
        .service_provider
        .user_account_service
        .update_user_account(&service_context, input.into())
    {
        Ok(user_account) => Ok(UpdateUserAccountResponse::Response(
            UserAccountNode::from_domain(user_account),
        )),
        Err(error) => map_error(error),
    }
}

#[derive(InputObject, Clone)]
pub struct UpdateUserAccountInput {
    pub id: String,
    pub username: Option<String>,
    pub password: Option<String>,
    pub email: Option<String>,
    pub display_name: Option<String>,
    pub permissions: Option<Vec<PermissionNode>>,
}

impl From<UpdateUserAccountInput> for UpdateUserAccount {
    fn from(
        UpdateUserAccountInput {
            id,
            username,
            password,
            email,
            display_name,
            permissions,
        }: UpdateUserAccountInput,
    ) -> Self {
        let permissions =
            permissions.map(|perms| perms.into_iter().map(PermissionNode::to_domain).collect());

        UpdateUserAccount {
            id,
            username,
            password,
            email,
            display_name,
            permissions,
        }
    }
}

#[derive(Union)]
pub enum UpdateUserAccountResponse {
    Response(UserAccountNode),
}

fn map_error(error: ServiceError) -> Result<UpdateUserAccountResponse> {
    use StandardGraphqlError::*;
    let formatted_error = format!("{:#?}", error);

    let graphql_error = match error {
        // Standard Graphql Errors
        ServiceError::UserAccountDoesNotExist => BadUserInput(formatted_error),
        ServiceError::EmailAddressAlreadyExists => BadUserInput(formatted_error),
        ServiceError::UserAccountAlreadyExists => BadUserInput(formatted_error),
        ServiceError::InvalidPassword => BadUserInput(
            "Please ensure your password meets the minimum complexity standards".to_string(),
        ),
        ServiceError::InvalidUsername => BadUserInput(
            "Invalid Username, username can only include english letters and numbers".to_string(),
        ),
        ServiceError::PermissionsMissing => {
            BadUserInput("User must have a role or permission assigned".to_string())
        }
        ServiceError::ModifiedRecordNotFound => InternalError(formatted_error),
        ServiceError::DatabaseError(_) => InternalError(formatted_error),
        ServiceError::PasswordHashError => InternalError(formatted_error),
        ServiceError::InvalidToken => BadUserInput("Invalid token".to_string()),
        ServiceError::TokenExpired => {
            BadUserInput("Token has expired, please request a new invite".to_string())
        }
        ServiceError::GenericError(s) => InternalError(s),
    };

    Err(graphql_error.extend())
}
