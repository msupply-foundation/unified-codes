use super::StorageConnection;
use crate::{
    db_diesel::user_account_row::user_account, repository_error::RepositoryError, EqualFilter,
};
use diesel::prelude::*;
use diesel_derive_enum::DbEnum;
use user_permission::dsl as user_permission_dsl;

table! {
    user_permission (id) {
        id -> Text,
        user_id -> Text,
        permission -> crate::db_diesel::user_permission_row::PermissionMapping,
    }
}

joinable!(user_permission -> user_account (user_id));

#[derive(DbEnum, Debug, Clone, PartialEq, Eq, Hash)]
#[DbValueStyle = "SCREAMING_SNAKE_CASE"]
pub enum Permission {
    ServerAdmin,
    Reader,
}

impl Default for Permission {
    fn default() -> Self {
        Permission::ServerAdmin
    }
}

impl Permission {
    pub fn equal_to(value: Permission) -> EqualFilter<Permission> {
        EqualFilter {
            equal_to: Some(value),
            not_equal_to: None,
            equal_any: None,
            not_equal_all: None,
            is_null: None,
        }
    }
    pub fn not_equal_to(value: Permission) -> EqualFilter<Permission> {
        EqualFilter {
            equal_to: None,
            not_equal_to: Some(value),
            equal_any: None,
            not_equal_all: None,
            is_null: None,
        }
    }
    pub fn equal_any(perms: Vec<Permission>) -> EqualFilter<Permission> {
        EqualFilter {
            equal_to: None,
            not_equal_to: None,
            equal_any: Some(perms),
            not_equal_all: None,
            is_null: None,
        }
    }
}

#[derive(Clone, Queryable, Insertable, AsChangeset, Debug, Eq, Default)]
#[table_name = "user_permission"]
pub struct UserPermissionRow {
    pub id: String,
    pub user_id: String,
    pub permission: Permission,
}

impl PartialEq for UserPermissionRow {
    fn eq(&self, other: &Self) -> bool {
        self.user_id == other.user_id && self.permission == other.permission
    }
}

pub struct UserPermissionRowRepository<'a> {
    connection: &'a StorageConnection,
}

impl<'a> UserPermissionRowRepository<'a> {
    pub fn new(connection: &'a StorageConnection) -> Self {
        UserPermissionRowRepository { connection }
    }

    pub fn insert_one(&self, row: &UserPermissionRow) -> Result<(), RepositoryError> {
        diesel::insert_into(user_permission_dsl::user_permission)
            .values(row)
            .execute(&self.connection.connection)?;
        Ok(())
    }

    pub fn delete(&self, user_permission_id: &str) -> Result<(), RepositoryError> {
        diesel::delete(
            user_permission_dsl::user_permission
                .filter(user_permission_dsl::id.eq(user_permission_id)),
        )
        .execute(&self.connection.connection)?;
        Ok(())
    }
    pub fn delete_all_for_user_id(&self, user_id: &str) -> Result<(), RepositoryError> {
        diesel::delete(
            user_permission_dsl::user_permission.filter(user_permission_dsl::user_id.eq(user_id)),
        )
        .execute(&self.connection.connection)?;
        Ok(())
    }

    pub fn find_one_by_id(&self, id: &str) -> Result<Option<UserPermissionRow>, RepositoryError> {
        let result = user_permission_dsl::user_permission
            .filter(user_permission_dsl::id.eq(id))
            .first(&self.connection.connection)
            .optional()?;
        Ok(result)
    }
}
