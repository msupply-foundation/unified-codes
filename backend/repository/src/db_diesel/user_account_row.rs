use super::{user_account_row::user_account::dsl as user_account_dsl, StorageConnection};

use crate::{lower, repository_error::RepositoryError};
use chrono::NaiveDateTime;
use diesel::prelude::*;

table! {
    user_account (id) {
        id -> Text,
        username -> Text,
        hashed_password -> Text,
        email -> Nullable<Text>,
        display_name -> Text,
        password_reset_token -> Nullable<Text>,
        password_reset_datetime -> Nullable<Timestamp>,
    }
}
#[derive(
    Clone, Queryable, Identifiable, Insertable, Debug, PartialEq, Eq, AsChangeset, Default,
)]
#[changeset_options(treat_none_as_null = "true")]
#[table_name = "user_account"]
pub struct UserAccountRow {
    pub id: String,
    pub username: String,
    pub hashed_password: String,
    pub email: Option<String>,
    pub display_name: String,
    pub password_reset_token: Option<String>,
    pub password_reset_datetime: Option<NaiveDateTime>,
}

pub struct UserAccountRowRepository<'a> {
    connection: &'a StorageConnection,
}

impl<'a> UserAccountRowRepository<'a> {
    pub fn new(connection: &'a StorageConnection) -> Self {
        UserAccountRowRepository { connection }
    }

    pub fn update_one(&self, row: &UserAccountRow) -> Result<(), RepositoryError> {
        let query = diesel::update(row).set(row);
        // println!("{}", diesel::debug_query::<DBType, _>(&query).to_string());
        query.execute(&self.connection.connection)?;
        Ok(())
    }

    pub fn insert_one(&self, user_account_row: &UserAccountRow) -> Result<(), RepositoryError> {
        diesel::insert_into(user_account_dsl::user_account)
            .values(user_account_row)
            .execute(&self.connection.connection)?;
        Ok(())
    }

    pub fn find_one_by_id(
        &self,
        account_id: &str,
    ) -> Result<Option<UserAccountRow>, RepositoryError> {
        let result: Result<UserAccountRow, diesel::result::Error> = user_account_dsl::user_account
            .filter(user_account_dsl::id.eq(account_id))
            .first(&self.connection.connection);
        match result {
            Ok(row) => Ok(Some(row)),
            Err(err) => match err {
                diesel::result::Error::NotFound => Ok(None),
                _ => Err(RepositoryError::from(err)),
            },
        }
    }

    pub fn find_one_by_password_reset_token(
        &self,
        password_reset_token: &str,
    ) -> Result<Option<UserAccountRow>, RepositoryError> {
        let result: Result<UserAccountRow, diesel::result::Error> = user_account_dsl::user_account
            .filter(user_account_dsl::password_reset_token.eq(password_reset_token))
            .first(&self.connection.connection);
        match result {
            Ok(row) => Ok(Some(row)),
            Err(err) => match err {
                diesel::result::Error::NotFound => Ok(None),
                _ => Err(RepositoryError::from(err)),
            },
        }
    }

    pub fn find_one_by_user_name(
        &self,
        username: &str,
    ) -> Result<Option<UserAccountRow>, RepositoryError> {
        let result: Result<UserAccountRow, diesel::result::Error> = user_account_dsl::user_account
            .filter(lower(user_account_dsl::username).eq(lower(username)))
            .first(&self.connection.connection);
        match result {
            Ok(row) => Ok(Some(row)),
            Err(err) => match err {
                diesel::result::Error::NotFound => Ok(None),
                _ => Err(RepositoryError::from(err)),
            },
        }
    }
    pub fn find_one_by_email(
        &self,
        email: &str,
    ) -> Result<Option<UserAccountRow>, RepositoryError> {
        let result: Result<UserAccountRow, diesel::result::Error> = user_account_dsl::user_account
            .filter(user_account_dsl::email.eq(email))
            .first(&self.connection.connection);
        match result {
            Ok(row) => Ok(Some(row)),
            Err(err) => match err {
                diesel::result::Error::NotFound => Ok(None),
                _ => Err(RepositoryError::from(err)),
            },
        }
    }

    pub fn find_all_by_email(&self, email: &str) -> Result<Vec<UserAccountRow>, RepositoryError> {
        let result = user_account_dsl::user_account
            .filter(user_account_dsl::email.eq(email))
            .load(&self.connection.connection)?;
        Ok(result)
    }

    pub fn find_many_by_id(&self, ids: &[String]) -> Result<Vec<UserAccountRow>, RepositoryError> {
        let result = user_account_dsl::user_account
            .filter(user_account_dsl::id.eq_any(ids))
            .load(&self.connection.connection)?;
        Ok(result)
    }

    pub fn delete_by_id(&self, id: &str) -> Result<usize, RepositoryError> {
        let result = diesel::delete(user_account_dsl::user_account)
            .filter(user_account_dsl::id.eq(id))
            .execute(&self.connection.connection)?;
        Ok(result)
    }

    // Save password reset token
    pub fn set_password_reset_token(
        &self,
        id: &str,
        token: &str,
        now: &NaiveDateTime,
    ) -> Result<(), RepositoryError> {
        diesel::update(user_account_dsl::user_account)
            .filter(user_account_dsl::id.eq(id))
            .set((
                user_account_dsl::password_reset_token.eq(token),
                user_account_dsl::password_reset_datetime.eq(now),
            ))
            .execute(&self.connection.connection)?;
        Ok(())
    }
}
