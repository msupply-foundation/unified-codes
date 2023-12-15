use std::{
    sync::Arc,
    time::{Duration, SystemTime},
};

use chrono::Utc;
use repository::{LogType, RepositoryError};

use crate::{
    audit_log::audit_log_entry,
    auth_data::AuthData,
    service_provider::{ServiceContext, ServiceProvider},
    settings::is_develop,
    token::{
        JWTIssuingError, TokenPair, TokenService, DEFAULT_REFRESH_TOKEN_EXPIRY,
        DEFAULT_TOKEN_EXPIRY,
    },
    user_account::passwords::VerifyPasswordError,
};

#[derive(Debug)]
pub enum FetchUserError {
    Unauthenticated,
    ConnectionError(String),
    InternalError(String),
}

pub struct LoginService {}

#[derive(Debug)]
pub enum LoginError {
    /// Either user does not exit or wrong password
    LoginFailure,
    FailedToGenerateToken(JWTIssuingError),
    InternalError(String),
    DatabaseError(RepositoryError),
}

pub struct LoginInput {
    pub username: String,
    pub password: String,
}

impl LoginService {
    /// # Arguments:
    /// * `min_err_response_time_sec` min response time if there was a login error. This is to
    /// disguise any information whether the use exists or not, i.e. response time for invalid
    /// usernames is indistinguishable from the response time for invalid passwords. This only works
    /// if the value is high enough, i.e. higher than the server needs to calculate the password
    /// hash.
    ///
    /// Note, this service takes a ServiceProvider instead of a ServiceContext. The reason is that a
    /// ServiceContext can't be used across async calls (because of the containing thread bound
    /// SqliteConnection). Since we need an async api call to the remote server to fetch user data
    /// we need to create the service context after the call where the compiler can deduce that we are
    /// not passing it to another thread.
    pub async fn login(
        service_provider: Arc<ServiceProvider>,
        auth_data: &AuthData,
        input: LoginInput,
        min_err_response_time_sec: u64,
    ) -> Result<TokenPair, LoginError> {
        let now = SystemTime::now();
        match LoginService::do_login(service_provider, auth_data, input).await {
            Ok(result) => Ok(result),
            Err(err) => {
                let elapsed = now.elapsed().unwrap_or(Duration::from_secs(0));
                let minimum = Duration::from_secs(min_err_response_time_sec);
                if elapsed < minimum {
                    tokio::time::sleep(minimum - elapsed).await;
                }
                Err(err)
            }
        }
    }

    async fn do_login(
        service_provider: Arc<ServiceProvider>,
        auth_data: &AuthData,
        input: LoginInput,
    ) -> Result<TokenPair, LoginError> {
        let mut service_ctx = ServiceContext::new(service_provider.clone())?;
        let user_account = match service_ctx
            .service_provider
            .user_account_service
            .verify_password(&service_ctx, &input.username, &input.password)
        {
            Ok(user) => user,
            Err(err) => {
                return Err(match err {
                    VerifyPasswordError::UsernameDoesNotExist => LoginError::LoginFailure,
                    VerifyPasswordError::InvalidCredentials => LoginError::LoginFailure,
                    VerifyPasswordError::InvalidCredentialsBackend(_) => {
                        LoginError::InternalError("Failed to read credentials".to_string())
                    }
                    VerifyPasswordError::DatabaseError(e) => LoginError::DatabaseError(e),
                });
            }
        };

        service_ctx.user_id = user_account.id.clone();

        // Audit logging
        audit_log_entry(
            &service_ctx,
            LogType::UserLoggedIn,
            // Duplication of user id. Could also be listed as 'None' but this follows convention for other audit logs.
            Some(user_account.id.clone()),
            Utc::now().naive_utc(),
        )?;

        let mut token_service = TokenService::new(
            &auth_data.token_bucket,
            auth_data.auth_token_secret.as_bytes(),
            !is_develop(),
        );

        let max_age_token = DEFAULT_TOKEN_EXPIRY;
        let max_age_refresh = DEFAULT_REFRESH_TOKEN_EXPIRY;
        let pair = match token_service.jwt_token(&user_account.id, max_age_token, max_age_refresh) {
            Ok(pair) => pair,
            Err(err) => return Err(LoginError::FailedToGenerateToken(err)),
        };
        Ok(pair)
    }
}

impl From<RepositoryError> for LoginError {
    fn from(err: RepositoryError) -> Self {
        LoginError::InternalError(format!("{:?}", err))
    }
}

// Test Module for login.rs
#[cfg(test)]
mod login_test {
    use std::sync::{Arc, RwLock};

    use repository::{AuditLogRepository, LogType, Pagination};

    use crate::auth_data::AuthData;
    use crate::login::{LoginInput, LoginService};
    use crate::service_provider::ServiceProvider;
    use crate::test_utils::get_test_settings;
    use crate::token_bucket;
    use repository::mock::MockDataInserts;
    use repository::test_db::setup_all;

    #[actix_rt::test]
    async fn test_login_logging() {
        let (mock_data, _, connection_manager, _) =
            setup_all("test_login", MockDataInserts::none().user_accounts()).await;

        let service_provider = ServiceProvider::new(connection_manager, get_test_settings(""));
        let connection = service_provider.connection_manager.connection().unwrap();
        let audit_log_repo = AuditLogRepository::new(&connection);

        let token_bucket = Arc::new(RwLock::new(token_bucket::TokenBucket::new()));

        let username = mock_data["base"].user_accounts[0].username.clone();
        let user_id = mock_data["base"].user_accounts[0].id.clone();
        let password = "password".to_string(); //User Account 0 in mock has a hashed version of 'password' as password

        let auth_data = AuthData {
            auth_token_secret: "test_token".to_string(),
            token_bucket,
        };

        let _ = LoginService::login(
            Arc::new(service_provider),
            &auth_data,
            LoginInput {
                username: username,
                password: password,
            },
            0,
        )
        .await
        .unwrap();

        //Get all the audit log records, but since this test should only create one for the user login we should be ok (until something changes)
        let audit_log_records = audit_log_repo.query(Pagination::all(), None, None).unwrap();
        assert_eq!(
            audit_log_records[0].log_row.record_type,
            LogType::UserLoggedIn
        );
        assert_eq!(audit_log_records[0].log_row.user_id, Some(user_id));
    }
}
