use async_graphql::*;

use graphql_core::{
    standard_graphql_error::{validate_auth, StandardGraphqlError},
    ContextExt,
};
use graphql_types::types::PermissionNode;
use service::{
    auth::{Resource, ResourceAccessRequest},
    user_account::{
        passwords::{AcceptUserInvite, InviteUserAccount},
        ModifyUserAccountError,
    },
};

#[derive(PartialEq, Debug, Clone)]
pub struct InviteUserResponseMessage {
    pub message: String,
}

#[Object]
impl InviteUserResponseMessage {
    pub async fn message(&self) -> &str {
        &self.message
    }
}

#[derive(Union)]
pub enum InviteUserResponse {
    Response(InviteUserResponseMessage),
}

#[derive(InputObject, Clone)]
pub struct InviteUserInput {
    pub email: String,
    pub username: String,
    pub display_name: String,
    pub permissions: Vec<PermissionNode>,
}

impl From<InviteUserInput> for InviteUserAccount {
    fn from(
        InviteUserInput {
            email,
            permissions,
            username,
            display_name,
        }: InviteUserInput,
    ) -> Self {
        let permissions = permissions
            .into_iter()
            .map(PermissionNode::to_domain)
            .collect();

        InviteUserAccount {
            email,
            permissions,
            username,
            display_name,
        }
    }
}

#[derive(InputObject, Clone)]
pub struct AcceptUserInviteInput {
    pub username: String,
    pub password: String,
    pub display_name: String,
}

impl From<AcceptUserInviteInput> for AcceptUserInvite {
    fn from(
        AcceptUserInviteInput {
            username,
            password,
            display_name,
        }: AcceptUserInviteInput,
    ) -> Self {
        AcceptUserInvite {
            username,
            password,
            display_name,
        }
    }
}

pub fn initiate_user_invite(
    ctx: &Context<'_>,
    input: InviteUserInput,
) -> Result<InviteUserResponse> {
    // Verify if user is allowed to invite users
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
        .initiate_user_invite(&service_context, input.into())
    {
        Ok(_) => Ok(InviteUserResponse::Response(InviteUserResponseMessage {
            message: "User invite initiated".to_string(),
        })),
        Err(e) => map_error(e),
    }
}

pub fn accept_user_invite(
    ctx: &Context<'_>,
    token: &str,
    input: AcceptUserInviteInput,
) -> Result<InviteUserResponse> {
    let service_context = ctx.service_context(None)?;
    match service_context
        .service_provider
        .user_account_service
        .accept_user_invite(&service_context, token, input.into())
    {
        Ok(_) => Ok(InviteUserResponse::Response(InviteUserResponseMessage {
            message: "Account Verified".to_string(),
        })),
        Err(e) => map_error(e),
    }
}

fn map_error(error: ModifyUserAccountError) -> Result<InviteUserResponse> {
    use StandardGraphqlError::*;

    let graphql_error = match error {
        ModifyUserAccountError::DatabaseError(_) => {
            InternalError("Database error while creating password reset link".to_string())
        }
        ModifyUserAccountError::UserAccountAlreadyExists => {
            BadUserInput("Username already exists, please choose another.".to_string())
        }
        ModifyUserAccountError::EmailAddressAlreadyExists => BadUserInput(
            "Email Address already exists, you may need to do a password reset instead?"
                .to_string(),
        ),
        ModifyUserAccountError::ModifiedRecordNotFound => {
            InternalError("Modified record not found".to_string())
        }
        ModifyUserAccountError::PasswordHashError => {
            InternalError("Password hash error".to_string())
        }
        ModifyUserAccountError::UserAccountDoesNotExist => {
            BadUserInput("User does not exist".to_string())
        }
        ModifyUserAccountError::InvalidPassword => BadUserInput(
            "Please ensure your password meets the minimum complexity standards".to_string(),
        ),
        ModifyUserAccountError::InvalidUsername => BadUserInput(
            "Invalid Username, username can only include english letters and numbers".to_string(),
        ),
        ModifyUserAccountError::PermissionsMissing => {
            BadUserInput("Permissions missing".to_string())
        }
        ModifyUserAccountError::InvalidToken => BadUserInput("Invalid token".to_string()),
        ModifyUserAccountError::TokenExpired => BadUserInput("Token expired".to_string()),
        ModifyUserAccountError::GenericError(s) => InternalError(s),
    };

    Err(graphql_error.extend())
}
