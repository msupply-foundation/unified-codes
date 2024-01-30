use self::{
    create::{create_user_account, CreateUserAccount},
    delete::{delete_user_account, DeleteUserAccountError},
    passwords::{
        accept_user_invite, initiate_password_reset, initiate_user_invite, reset_password,
        validate_password_reset_token, verify_password, AcceptUserInvite, InviteUserAccount,
        PasswordResetError, VerifyPasswordError,
    },
    query::{get_user_account, get_user_accounts},
    update::{update_user_account, UpdateUserAccount},
};

use super::{ListError, ListResult};
use crate::{service_provider::ServiceContext, SingleRecordError};
use repository::{
    PaginationOption, RepositoryError, UserAccount, UserAccountFilter, UserAccountSort,
};

mod tests;

pub mod create;
pub mod delete;
pub mod email;
pub mod passwords;
pub mod permissions;
pub mod query;
pub mod update;
pub mod validate;

pub trait UserAccountServiceTrait: Sync + Send {
    fn get_user_accounts(
        &self,
        ctx: &ServiceContext,
        pagination: Option<PaginationOption>,
        filter: Option<UserAccountFilter>,
        sort: Option<UserAccountSort>,
    ) -> Result<ListResult<UserAccount>, ListError> {
        get_user_accounts(ctx, pagination, filter, sort)
    }

    fn get_user_account(
        &self,
        ctx: &ServiceContext,
        user_account_id: String,
    ) -> Result<UserAccount, SingleRecordError> {
        get_user_account(ctx, user_account_id)
    }

    fn delete_user_account(
        &self,
        ctx: &ServiceContext,
        user_account_id: &str,
    ) -> Result<String, DeleteUserAccountError> {
        delete_user_account(ctx, user_account_id)
    }

    fn create_user_account(
        &self,
        ctx: &ServiceContext,
        input: CreateUserAccount,
    ) -> Result<UserAccount, ModifyUserAccountError> {
        create_user_account(ctx, input)
    }

    fn update_user_account(
        &self,
        ctx: &ServiceContext,
        input: UpdateUserAccount,
    ) -> Result<UserAccount, ModifyUserAccountError> {
        update_user_account(ctx, input)
    }

    fn verify_password(
        &self,
        ctx: &ServiceContext,
        username: &str,
        password: &str,
    ) -> Result<UserAccount, VerifyPasswordError> {
        verify_password(ctx, username, password)
    }

    fn initiate_password_reset(
        &self,
        ctx: &ServiceContext,
        email_or_user_id: &str,
    ) -> Result<(), PasswordResetError> {
        initiate_password_reset(ctx, email_or_user_id)
    }

    fn validate_password_reset_token(
        &self,
        ctx: &ServiceContext,
        token: &str,
    ) -> Result<(), PasswordResetError> {
        validate_password_reset_token(ctx, token)
    }

    fn reset_password(
        &self,
        ctx: &ServiceContext,
        token: &str,
        password: &str,
    ) -> Result<(), PasswordResetError> {
        reset_password(ctx, token, password)
    }

    fn initiate_user_invite(
        &self,
        ctx: &ServiceContext,
        input: InviteUserAccount,
    ) -> Result<(), ModifyUserAccountError> {
        initiate_user_invite(ctx, input)
    }

    fn accept_user_invite(
        &self,
        ctx: &ServiceContext,
        token: &str,
        input: AcceptUserInvite,
    ) -> Result<(), ModifyUserAccountError> {
        accept_user_invite(ctx, token, &input)
    }
}

pub struct UserAccountService {}
impl UserAccountServiceTrait for UserAccountService {}

#[derive(Debug, PartialEq)]
pub enum ModifyUserAccountError {
    UserAccountAlreadyExists,
    ModifiedRecordNotFound,
    PasswordHashError,
    DatabaseError(RepositoryError),
    UserAccountDoesNotExist,
    InvalidPassword,
    InvalidUsername,
    InvalidToken,
    TokenExpired,
    PermissionsMissing,
    GenericError(String),
    EmailAddressAlreadyExists,
}

impl From<RepositoryError> for ModifyUserAccountError {
    fn from(err: RepositoryError) -> Self {
        ModifyUserAccountError::DatabaseError(err)
    }
}

impl From<SingleRecordError> for ModifyUserAccountError {
    fn from(error: SingleRecordError) -> Self {
        use ModifyUserAccountError::*;
        match error {
            SingleRecordError::DatabaseError(error) => DatabaseError(error),
            SingleRecordError::NotFound(_) => ModifiedRecordNotFound,
        }
    }
}
