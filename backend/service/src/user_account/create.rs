use super::passwords::{check_password_complexity, hash_password};
use super::permissions::set_permissions_for_user;
use super::validate::{
    check_user_account_does_not_exist, check_username_doesnt_contain_special_characters,
};
use super::{query::get_user_account, validate::check_username_is_unique};
use super::{ModifyUserAccountError, UserAccount};
use crate::audit_log::audit_log_entry;
use crate::service_provider::ServiceContext;

use chrono::Utc;
use repository::{
    EqualFilter, LogType, Permission, StorageConnection, UserAccountRow, UserAccountRowRepository,
    UserPermissionFilter, UserPermissionRepository,
};

#[derive(Clone)]
pub struct CreateUserAccount {
    pub id: String,
    pub username: String,
    pub password: String,
    pub email: Option<String>,
    pub display_name: Option<String>,
    pub permissions: Vec<Permission>,
}

pub fn create_user_account(
    ctx: &ServiceContext,
    new_user: CreateUserAccount,
) -> Result<UserAccount, ModifyUserAccountError> {
    let user_account = ctx
        .connection
        .transaction_sync(|connection| {
            validate(ctx, &new_user, connection)?;
            let new_permissions = new_user.permissions.clone();
            let new_user_account = generate(new_user.clone())?;
            UserAccountRowRepository::new(connection).insert_one(&new_user_account)?;

            set_permissions_for_user(connection, &new_user_account.id, new_permissions)?;

            get_user_account(ctx, new_user_account.id).map_err(ModifyUserAccountError::from)
        })
        .map_err(|error| error.to_inner_error())?;

    // Audit logging
    audit_log_entry(
        &ctx,
        LogType::UserAccountCreated,
        Some(new_user.id),
        Utc::now().naive_utc(),
    )?;

    Ok(user_account)
}

pub fn validate(
    ctx: &ServiceContext,
    new_user: &CreateUserAccount,
    connection: &StorageConnection,
) -> Result<(), ModifyUserAccountError> {
    if !check_username_doesnt_contain_special_characters(&new_user.username)? {
        return Err(ModifyUserAccountError::InvalidUsername);
    }
    if new_user.permissions.is_empty() {
        return Err(ModifyUserAccountError::PermissionsMissing);
    }

    if !check_user_account_does_not_exist(&new_user.id, connection)? {
        return Err(ModifyUserAccountError::UserAccountAlreadyExists);
    }
    if !check_username_is_unique(&new_user.id, Some(new_user.username.clone()), connection)? {
        return Err(ModifyUserAccountError::UserAccountAlreadyExists);
    }
    if !check_password_complexity(&new_user.password) {
        return Err(ModifyUserAccountError::InvalidPassword);
    }

    // get logged in user's permissions (MAYBE REFACTOR LATER) - Code duplication Alert!
    // TODO: refactor this out...
    let permission_filter =
        UserPermissionFilter::new().user_id(EqualFilter::equal_to(&ctx.user_id));
    let loggedin_users_permissions =
        UserPermissionRepository::new(connection).query_by_filter(permission_filter)?;

    if !loggedin_users_permissions
        .iter()
        .any(|p| p.permission == Permission::ServerAdmin)
    {
        return Err(ModifyUserAccountError::GenericError(
            "Logged in User is not Server Admin".to_string(),
        ));
    }

    Ok(())
}

pub fn generate(
    CreateUserAccount {
        id,
        username,
        password,
        email,
        display_name,
        permissions: _, //Permissions are created as separate DB rows
    }: CreateUserAccount,
) -> Result<UserAccountRow, ModifyUserAccountError> {
    let hashed_password = hash_password(&password)?;

    Ok(UserAccountRow {
        id,
        username: username.trim().to_lowercase(),
        hashed_password,
        email: email.map(|e| e.trim().to_ascii_lowercase()),
        display_name: display_name
            .map(|n| n.trim().to_string())
            .unwrap_or(username),
        password_reset_token: None,
        password_reset_datetime: None,
    })
}
