use super::{
    passwords::{check_password_complexity, hash_password},
    permissions::set_permissions_for_user,
    query::get_user_account,
    validate::{
        check_user_account_exists, check_username_doesnt_contain_special_characters,
        check_username_is_unique,
    },
    ModifyUserAccountError,
};
use crate::{audit_log::audit_log_entry, service_provider::ServiceContext};
use chrono::Utc;
use repository::{
    EqualFilter, LogType, Permission, RepositoryError, StorageConnection, UserAccount,
    UserAccountRow, UserAccountRowRepository, UserPermissionFilter, UserPermissionRepository,
    UserPermissionRow,
};

#[derive(Clone)]
pub struct UpdateUserAccount {
    pub id: String,
    pub username: Option<String>,
    pub password: Option<String>,
    pub email: Option<String>,
    pub display_name: Option<String>,
    pub permissions: Option<Vec<Permission>>,
}

pub fn update_user_account(
    ctx: &ServiceContext,
    updated_user: UpdateUserAccount,
) -> Result<UserAccount, ModifyUserAccountError> {
    let user_account = ctx
        .connection
        .transaction_sync(|connection| {
            let new_permissions = updated_user.permissions.clone();
            let user_account_row = validate(ctx, connection, &updated_user)?;
            let updated_user_account_row = generate(updated_user.clone(), user_account_row)?;
            UserAccountRowRepository::new(connection).update_one(&updated_user_account_row)?;

            if new_permissions.is_some() {
                set_permissions_for_user(
                    connection,
                    &updated_user_account_row.id,
                    new_permissions.unwrap(),
                )?;
            }

            get_user_account(ctx, updated_user_account_row.id).map_err(ModifyUserAccountError::from)
        })
        .map_err(|error| error.to_inner_error())?;

    // Audit logging
    audit_log_entry(
        &ctx,
        LogType::UserAccountUpdated,
        Some(updated_user.id),
        Utc::now().naive_utc(),
    )?;
    Ok(user_account)
}

pub fn validate(
    ctx: &ServiceContext,
    connection: &StorageConnection,
    new_user: &UpdateUserAccount,
) -> Result<UserAccountRow, ModifyUserAccountError> {
    let user_account_row = match check_user_account_exists(&new_user.id, connection)? {
        Some(user_account_row) => user_account_row,
        None => return Err(ModifyUserAccountError::UserAccountDoesNotExist),
    };

    if let Some(username) = &new_user.username {
        if !check_username_doesnt_contain_special_characters(username)? {
            return Err(ModifyUserAccountError::InvalidUsername);
        }
    }

    if !check_username_is_unique(&new_user.id, new_user.username.clone(), connection)? {
        return Err(ModifyUserAccountError::UserAccountAlreadyExists);
    }

    if let Some(password) = &new_user.password {
        if !check_password_complexity(password) {
            return Err(ModifyUserAccountError::InvalidPassword);
        }
    }

    let loggedin_users_permissions = get_permissions(connection, &ctx.user_id)?;
    // TODO: Do we need this?
    // let existing_users_permissions = get_permissions(connection, &new_user.id)?;

    // Check user is allowed to assign this permission
    if let Some(permissions) = &new_user.permissions {
        for permission in permissions {
            match permission {
                Permission::ServerAdmin => {
                    if !loggedin_users_permissions
                        .iter()
                        .any(|p| p.permission == Permission::ServerAdmin)
                    {
                        return Err(ModifyUserAccountError::PermissionsMissing);
                    }
                }
                Permission::Reader => {
                    if !loggedin_users_permissions
                        .iter()
                        .any(|p| p.permission == Permission::ServerAdmin)
                    {
                        return Err(ModifyUserAccountError::PermissionsMissing);
                    }
                }
            }
        }
    }

    Ok(user_account_row)
}

pub fn generate(
    UpdateUserAccount {
        id: _id, //ID is already used for look up so we can assume it's the same
        username,
        password,
        email,
        display_name,
        permissions: _, //Permissions are managed separately
    }: UpdateUserAccount,
    current_user_account_row: UserAccountRow,
) -> Result<UserAccountRow, ModifyUserAccountError> {
    let mut new_user_account_row = current_user_account_row;
    if let Some(password) = password {
        new_user_account_row.hashed_password = hash_password(&password)?;
    }
    if let Some(username) = username {
        new_user_account_row.username = username.trim().to_lowercase();
    }
    if email.is_some() {
        new_user_account_row.email = email.map(|e| e.trim().to_ascii_lowercase());
    }
    if let Some(display_name) = display_name {
        new_user_account_row.display_name = display_name.trim().to_string();
    }

    Ok(new_user_account_row)
}

// TODO (MAYBE REFACTOR LATER)
fn get_permissions(
    connection: &StorageConnection,
    user_id: &str,
) -> Result<Vec<UserPermissionRow>, RepositoryError> {
    let permission_filter = UserPermissionFilter::new().user_id(EqualFilter::equal_to(user_id));

    return UserPermissionRepository::new(connection).query_by_filter(permission_filter);
}
