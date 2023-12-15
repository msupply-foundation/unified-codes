use repository::{Permission, StorageConnection, UserPermissionRow, UserPermissionRowRepository};
use util::uuid::uuid;

use super::ModifyUserAccountError;

/// sets the list of permissions for a user,
/// any permissions the user already has will be removed
/// designed to be used from within Create or Update user, so doesn't create a new transaction
pub fn set_permissions_for_user(
    connection: &StorageConnection,
    user_id: &str,
    permissions: Vec<Permission>,
) -> Result<(), ModifyUserAccountError> {
    connection
        .transaction_sync(|connection| {
            let repo = UserPermissionRowRepository::new(connection);

            // It's a bit messy to delete everything, would be nice to keep current permissions intact...
            match repo.delete_all_for_user_id(user_id) {
                Ok(r) => r,
                Err(e) => return Err(ModifyUserAccountError::from(e)),
            };

            for permission in permissions {
                let permission_row = UserPermissionRow {
                    id: uuid(),
                    user_id: user_id.to_string(),
                    permission,
                };
                repo.insert_one(&permission_row)?;
            }
            Ok(())
        })
        .map_err(|error| error.to_inner_error())
}
