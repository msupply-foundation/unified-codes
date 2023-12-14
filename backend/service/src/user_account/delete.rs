use super::validate::check_user_account_exists;
use crate::service_provider::ServiceContext;
use repository::{
    RepositoryError, StorageConnection, UserAccountRow, UserAccountRowRepository,
    UserPermissionRowRepository,
};
#[derive(PartialEq, Debug)]
pub struct UserAccountInUse {}

impl UserAccountInUse {
    pub fn description(&self) -> &'static str {
        "User Account in use"
    }
}

#[derive(PartialEq, Debug)]
pub enum DeleteUserAccountError {
    UserAccountDoesNotExist,
    UserAccountInUse(UserAccountInUse),
    DatabaseError(RepositoryError),
}

pub fn delete_user_account(
    ctx: &ServiceContext,
    user_account_id: &str,
) -> Result<String, DeleteUserAccountError> {
    let user_account = ctx
        .connection
        .transaction_sync(|connection| {
            let user_account = validate(&ctx.connection, user_account_id)?;

            let permissions_repo = UserPermissionRowRepository::new(connection);

            match permissions_repo.delete_all_for_user_id(user_account_id) {
                Ok(r) => r,
                Err(e) => return Err(DeleteUserAccountError::from(e)),
            };

            let user_repo = UserAccountRowRepository::new(&ctx.connection);
            match user_repo.delete_by_id(user_account_id) {
                Ok(_) => {}
                Err(err) => {
                    return Err(DeleteUserAccountError::from(err));
                }
            };
            Ok(user_account)
        })
        .map_err(|error| error.to_inner_error())?;

    Ok(user_account.id)
}

pub fn validate(
    connection: &StorageConnection,
    user_account_id: &str,
) -> Result<UserAccountRow, DeleteUserAccountError> {
    let user_account_row = match check_user_account_exists(user_account_id, connection)? {
        Some(user_account_row) => user_account_row,
        None => return Err(DeleteUserAccountError::UserAccountDoesNotExist),
    };
    if let Some(user_account_in_use) = check_user_account_in_use(user_account_id, connection)? {
        return Err(DeleteUserAccountError::UserAccountInUse(
            user_account_in_use,
        ));
    }

    Ok(user_account_row)
}

pub fn check_user_account_in_use(
    _id: &str,
    _connection: &StorageConnection,
) -> Result<Option<UserAccountInUse>, RepositoryError> {
    //TODO(Future) Check if user_account is used...
    Ok(None)
}

impl From<RepositoryError> for DeleteUserAccountError {
    fn from(error: RepositoryError) -> Self {
        DeleteUserAccountError::DatabaseError(error)
    }
}
