use crate::{Permission, UserPermissionRow};

pub fn mock_permissions() -> Vec<UserPermissionRow> {
    vec![mock_user_permission_account_a()]
}

pub fn mock_user_permission_account_a() -> UserPermissionRow {
    UserPermissionRow {
        id: String::from("id_user_permission_a"),
        user_id: String::from("id_user_account_a"),
        permission: Permission::ServerAdmin,
    }
}
