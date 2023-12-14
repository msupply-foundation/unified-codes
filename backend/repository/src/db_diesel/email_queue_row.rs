use super::StorageConnection;
use crate::repository_error::RepositoryError;
use diesel::prelude::*;
use diesel_derive_enum::DbEnum;
use email_queue::dsl as email_queue_dsl;

table! {
    email_queue (id) {
        id -> Text,
        to_address -> Text,
        subject -> Text,
        html_body -> Text,
        text_body -> Text,
        created_at -> Timestamp,
        updated_at -> Timestamp,
        sent_at -> Nullable<Timestamp>,
        retries -> Integer,
        status -> crate::db_diesel::email_queue_row::EmailQueueStatusMapping,
        error -> Nullable<Text>,
    }
}

#[derive(DbEnum, Debug, Clone, PartialEq, Eq, Hash)]
#[DbValueStyle = "SCREAMING_SNAKE_CASE"]
pub enum EmailQueueStatus {
    Queued,
    Sent,
    Errored, // Errored will be re-tried
    Failed,  // Failed will not be re-tried
}

impl Default for EmailQueueStatus {
    fn default() -> Self {
        EmailQueueStatus::Queued
    }
}

#[derive(
    Clone, Queryable, Insertable, Identifiable, Debug, PartialEq, Eq, AsChangeset, Default,
)]
#[table_name = "email_queue"]
pub struct EmailQueueRow {
    pub id: String,
    pub to_address: String,
    pub subject: String,
    pub html_body: String,
    pub text_body: String,
    pub created_at: chrono::NaiveDateTime,
    pub updated_at: chrono::NaiveDateTime,
    pub sent_at: Option<chrono::NaiveDateTime>,
    pub retries: i32,
    pub status: EmailQueueStatus,
    pub error: Option<String>,
}

pub struct EmailQueueRowRepository<'a> {
    connection: &'a StorageConnection,
}

impl<'a> EmailQueueRowRepository<'a> {
    pub fn new(connection: &'a StorageConnection) -> Self {
        EmailQueueRowRepository { connection }
    }

    pub fn insert_one(&self, email_queue_row: &EmailQueueRow) -> Result<(), RepositoryError> {
        diesel::insert_into(email_queue_dsl::email_queue)
            .values(email_queue_row)
            .execute(&self.connection.connection)?;

        Ok(())
    }

    pub fn update_one(&self, email_queue_row: &EmailQueueRow) -> Result<(), RepositoryError> {
        diesel::update(email_queue_row)
            .set(email_queue_row)
            .execute(&self.connection.connection)?;

        Ok(())
    }

    pub fn un_sent(&self) -> Result<Vec<EmailQueueRow>, RepositoryError> {
        let result = email_queue_dsl::email_queue
            .filter(
                email_queue_dsl::status
                    .eq(EmailQueueStatus::Queued)
                    .or(email_queue_dsl::status.eq(EmailQueueStatus::Errored)),
            )
            .load::<EmailQueueRow>(&self.connection.connection)?;
        Ok(result)
    }
}
