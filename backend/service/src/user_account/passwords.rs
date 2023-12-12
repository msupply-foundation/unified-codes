use bcrypt::{hash, verify, DEFAULT_COST};
use chrono::Utc;
use log::error;
use rand::{distributions::Alphanumeric, thread_rng, Rng};
use repository::{LogType, Permission, RepositoryError, UserAccount, UserAccountRowRepository};
use util::uuid::uuid;

use crate::{
    audit_log::audit_log_entry, email::EmailServiceError, service_provider::ServiceContext,
};

use super::{
    create::CreateUserAccount,
    email::{
        password_reset::queue_password_reset_email,
        user_invite::{queue_user_invite_email, UserInviteParams},
        user_welcome::{queue_user_welcome_email, UserWelcomeParams},
    },
    update::UpdateUserAccount,
    ModifyUserAccountError,
};

pub const PW_RESET_TOKEN_LENGTH: usize = 32;
pub const PW_RESET_TOKEN_EXPIRY_HOURS: i64 = 48;
pub const PW_RESET_TOKEN_RETRY_SECONDS: i64 = 30;

#[derive(Debug)]
pub enum VerifyPasswordError {
    UsernameDoesNotExist,
    InvalidCredentials,
    /// Invalid account data on the backend
    InvalidCredentialsBackend(bcrypt::BcryptError),
    DatabaseError(RepositoryError),
}

#[derive(Debug)]
pub enum PasswordResetError {
    EmailDoesNotExist,
    UnableToSendEmail(EmailServiceError),
    ResetTooSoon,
    TokenExpired,
    InvalidToken,
    PasswordHashError,
    DatabaseError(RepositoryError),
}

#[derive(Debug, Clone)]
pub struct InviteUserAccount {
    pub email: String,
    pub username: String,
    pub display_name: String,
    pub permissions: Vec<Permission>,
}

#[derive(Debug, Clone)]
pub struct AcceptUserInvite {
    pub username: String,
    pub password: String,
    pub display_name: String,
}

/// Finds a user account and verifies that the password is ok
pub fn verify_password(
    ctx: &ServiceContext,
    username: &str,
    password: &str,
) -> Result<UserAccount, VerifyPasswordError> {
    let repo = UserAccountRowRepository::new(&ctx.connection);
    let user = match repo
        .find_one_by_user_name(&username.to_lowercase())
        .map_err(VerifyPasswordError::DatabaseError)?
    {
        Some(user) => user,
        None => {
            //User may be logging in with an email address instead of username
            match repo
                .find_one_by_email(username)
                .map_err(VerifyPasswordError::DatabaseError)?
            {
                Some(user) => user,
                None => return Err(VerifyPasswordError::UsernameDoesNotExist),
            }
        }
    };
    // verify password
    let valid = verify(password, &user.hashed_password).map_err(|err| {
        error!("verify_password: {}", err);
        VerifyPasswordError::InvalidCredentialsBackend(err)
    })?;
    if !valid {
        return Err(VerifyPasswordError::InvalidCredentials);
    }

    Ok(user)
}

pub fn hash_password(password: &str) -> Result<String, ModifyUserAccountError> {
    match hash(password, DEFAULT_COST) {
        Ok(pwd) => Ok(pwd),
        Err(err) => {
            error!("create_user: Failed to hash password: {:?}", err);
            Err(ModifyUserAccountError::PasswordHashError)
        }
    }
}

pub fn check_password_complexity(password: &str) -> bool {
    //TODO: Check password complexity more thoroughly :)
    //See: https://crates.io/crates/passwords
    //And Maybe allow simpler passwords in development mode?
    password.len() > 3
}

//generate a secure random id
pub fn generate_password_reset_token() -> String {
    // ThreadRNG is cryptographically secure by default in rust
    thread_rng()
        .sample_iter(&Alphanumeric)
        .take(PW_RESET_TOKEN_LENGTH)
        .map(char::from)
        .collect()
}

pub fn initiate_password_reset(
    ctx: &ServiceContext,
    email_or_user_id: &str,
) -> Result<(), PasswordResetError> {
    let repo = UserAccountRowRepository::new(&ctx.connection);

    let now = Utc::now().naive_utc();

    // First check if we have a user_id provided
    let user = match repo.find_one_by_id(email_or_user_id) {
        Ok(user) => user,
        Err(e) => return Err(PasswordResetError::DatabaseError(e)),
    };

    // If we don't find one, we'll check using their email address
    let users = match user {
        Some(user) => vec![user],
        None => repo
            .find_all_by_email(&email_or_user_id.to_lowercase())
            .map_err(PasswordResetError::DatabaseError)?,
    };
    if users.len() == 0 {
        return Err(PasswordResetError::EmailDoesNotExist);
    }

    let email_address = match users[0].email.clone() {
        Some(email_address) => email_address,
        None => return Err(PasswordResetError::EmailDoesNotExist),
    };

    let mut reset_user_ids = vec![];

    for user in users.clone() {
        if let Some(password_reset_datetime) = user.password_reset_datetime {
            if now.signed_duration_since(password_reset_datetime)
                < chrono::Duration::seconds(PW_RESET_TOKEN_RETRY_SECONDS)
            {
                return Err(PasswordResetError::ResetTooSoon);
            }
        }

        // Audit logging
        audit_log_entry(
            &ctx,
            LogType::UserAccountPasswordResetInitiated,
            Some(user.id.clone()),
            Utc::now().naive_utc(),
        )
        .ok();

        let token = generate_password_reset_token();

        // Save password reset token to database
        repo.set_password_reset_token(&user.id, &token, &now)
            .map_err(PasswordResetError::DatabaseError)?;

        reset_user_ids.push(user.id);
    }

    // Query the user_accounts again, including their password reset tokens

    let users = repo
        .find_many_by_id(&reset_user_ids)
        .map_err(PasswordResetError::DatabaseError)?;

    // Send password reset email
    queue_password_reset_email(ctx, &email_address, users)
        .map_err(PasswordResetError::UnableToSendEmail)
}

pub fn initiate_user_invite(
    ctx: &ServiceContext,
    input: InviteUserAccount,
) -> Result<(), ModifyUserAccountError> {
    let repo = UserAccountRowRepository::new(&ctx.connection);

    let now = Utc::now().naive_utc();

    // check if user already exists with this email address
    match repo
        .find_one_by_email(&input.email.to_lowercase())
        .map_err(ModifyUserAccountError::DatabaseError)?
    {
        Some(_user) => return Err(ModifyUserAccountError::EmailAddressAlreadyExists),
        None => (),
    };

    let token = generate_password_reset_token();

    // Find the name of the user who is inviting the new user
    let inviter = UserAccountRowRepository::new(&ctx.connection)
        .find_one_by_id(&ctx.user_id)
        .map_err(ModifyUserAccountError::DatabaseError)?
        .ok_or_else(|| {
            ModifyUserAccountError::GenericError("Unable to find inviter".to_string())
        })?;

    let invite_user_params = UserInviteParams {
        inviter_name: inviter.display_name,
        invitee_name: input.display_name.clone(),
    };

    // create user
    let user = CreateUserAccount {
        id: uuid(),
        email: Some(input.email.clone()),
        username: input.username.clone(), // Username can/should be chosen by the invited user, but email address is a good substitute for now
        password: uuid(), // The password is a secure uuid, so shouldn't be guessable.
        display_name: Some(input.display_name.clone()),
        permissions: input.permissions.clone(),
    };

    let user = ctx
        .service_provider
        .user_account_service
        .create_user_account(ctx, user)?;

    // Save password reset token to database
    repo.set_password_reset_token(&user.id, &token, &now)
        .map_err(ModifyUserAccountError::DatabaseError)?;

    // Queue the invite email
    queue_user_invite_email(ctx, &input.email, &invite_user_params, &token).map_err(|err| {
        ModifyUserAccountError::GenericError(format!(
            "Unable to send invite email for : {} - {:?}",
            user.id, err
        ))
    })?;

    Ok(())
}

pub fn accept_user_invite(
    ctx: &ServiceContext,
    token: &str,
    input: &AcceptUserInvite,
) -> Result<(), ModifyUserAccountError> {
    let repo = UserAccountRowRepository::new(&ctx.connection);

    let user = match repo
        .find_one_by_password_reset_token(token)
        .map_err(ModifyUserAccountError::DatabaseError)?
    {
        Some(user) => user,
        None => return Err(ModifyUserAccountError::InvalidToken),
    };

    if token_has_expired(user.password_reset_datetime) {
        return Err(ModifyUserAccountError::TokenExpired);
    }

    // Update the user account with the new password and other details
    let user = UpdateUserAccount {
        id: user.id,
        username: Some(input.username.clone()),
        password: Some(input.password.clone()),
        email: None,
        display_name: Some(input.display_name.clone()),
        permissions: None,
    };

    let mut user = ctx
        .service_provider
        .user_account_service
        .update_user_account(ctx, user)?;

    // Clear the password reset token
    user.password_reset_datetime = None;
    user.password_reset_token = None;

    repo.update_one(&user)
        .map_err(ModifyUserAccountError::DatabaseError)?;

    let welcome_params = UserWelcomeParams {
        username: user.username.clone(),
    };

    // queue the welcome email
    match user.email.clone() {
        Some(email) => {
            queue_user_welcome_email(ctx, &email, &welcome_params).map_err(|err| {
                ModifyUserAccountError::GenericError(format!(
                    "Unable to send invite email for : {} - {:?}",
                    user.id, err
                ))
            })?;
        }
        None => {
            return Err(ModifyUserAccountError::GenericError(
                "Unable to send welcome email, no email address".to_string(),
            ))
        }
    };

    Ok(())
}

fn token_has_expired(password_reset_datetime: Option<chrono::NaiveDateTime>) -> bool {
    let password_reset_datetime = match password_reset_datetime {
        Some(password_reset_datetime) => password_reset_datetime,
        None => return true,
    };

    // Verify the token hasn't expired
    let now = Utc::now().naive_utc();
    if now.signed_duration_since(password_reset_datetime)
        > chrono::Duration::hours(PW_RESET_TOKEN_EXPIRY_HOURS)
    {
        return true;
    }
    false
}

/// Finds a user account by reset token and checks that is hasnt expired
pub fn validate_password_reset_token(
    ctx: &ServiceContext,
    token: &str,
) -> Result<(), PasswordResetError> {
    let repo = UserAccountRowRepository::new(&ctx.connection);
    let user = match repo
        .find_one_by_password_reset_token(token)
        .map_err(PasswordResetError::DatabaseError)?
    {
        Some(user) => user,
        None => return Err(PasswordResetError::InvalidToken),
    };

    if token_has_expired(user.password_reset_datetime) {
        return Err(PasswordResetError::TokenExpired);
    }

    Ok(())
}

// Reset password for a user account using token
pub fn reset_password(
    ctx: &ServiceContext,
    token: &str,
    password: &str,
) -> Result<(), PasswordResetError> {
    let repo = UserAccountRowRepository::new(&ctx.connection);
    let mut user = match repo
        .find_one_by_password_reset_token(token)
        .map_err(PasswordResetError::DatabaseError)?
    {
        Some(user) => user,
        None => return Err(PasswordResetError::InvalidToken),
    };

    if token_has_expired(user.password_reset_datetime) {
        return Err(PasswordResetError::TokenExpired);
    }

    // Update the user account with the new password
    user.hashed_password =
        hash_password(password).map_err(|_| PasswordResetError::PasswordHashError)?;
    user.password_reset_datetime = None;
    user.password_reset_token = None;

    repo.update_one(&user)
        .map_err(PasswordResetError::DatabaseError)?;
    Ok(())
}

#[cfg(test)]
mod password_test {
    use std::sync::Arc;

    use chrono::NaiveDateTime;
    use repository::{
        mock::MockDataInserts,
        test_db::{self, setup_all},
        Permission,
    };
    use util::uuid::uuid;

    use crate::{
        service_provider::ServiceProvider,
        test_utils::{get_test_settings, service_provider_with_mock_email_service},
        user_account::create::CreateUserAccount,
    };

    use super::*;

    #[test]
    fn test_generate_password_reset_token() {
        let token1 = generate_password_reset_token();
        assert_eq!(token1.len(), PW_RESET_TOKEN_LENGTH);
        let token2 = generate_password_reset_token();
        assert_ne!(token1, token2);
    }

    #[actix_rt::test]
    async fn test_reset_password_by_id() {
        let (mock_data, _, connection_manager, _) = setup_all(
            "test_reset_password_by_id",
            MockDataInserts::none().user_accounts(),
        )
        .await;

        let service_provider = Arc::new(service_provider_with_mock_email_service(
            &connection_manager,
        ));
        let ctx = ServiceContext::new(service_provider).unwrap();

        let user_id = mock_data["base"].user_accounts[1].id.clone();

        // Create a password reset token using user_id
        let result = ctx
            .service_provider
            .user_account_service
            .initiate_password_reset(&ctx, &user_id);

        assert!(result.is_ok());
    }

    #[actix_rt::test]
    async fn test_reset_password() {
        let (mock_data, _, connection_manager, _) = setup_all(
            "test_reset_password",
            MockDataInserts::none().user_accounts(),
        )
        .await;

        let service_provider = Arc::new(service_provider_with_mock_email_service(
            &connection_manager,
        ));
        let ctx = ServiceContext::new(service_provider).unwrap();

        let mock_user_accounts = mock_data["base"].user_accounts.clone();
        let user_email = mock_user_accounts[0].email.clone().unwrap();

        // Create a password reset token using email address
        ctx.service_provider
            .user_account_service
            .initiate_password_reset(&ctx, &user_email)
            .unwrap();

        // Get reset token from database
        let repo = UserAccountRowRepository::new(&ctx.connection);
        let user = repo.find_one_by_email(&user_email).unwrap().unwrap();

        // Test that the reset token is cleared after successful reset
        ctx.service_provider
            .user_account_service
            .reset_password(&ctx, &user.password_reset_token.unwrap(), "password")
            .unwrap();

        let mut user = repo.find_one_by_email(&user_email).unwrap().unwrap();
        assert!(user.password_reset_token.is_none());

        // Test that password can't be reset with an expired token
        user.password_reset_token = Some("FAKE_TOKEN".to_string());
        user.password_reset_datetime = Some(NaiveDateTime::from_timestamp_opt(0, 0)).unwrap(); // Using Oldest possible timestamp, it must be expired :)
        repo.update_one(&user).unwrap();

        let result = ctx.service_provider.user_account_service.reset_password(
            &ctx,
            &user.password_reset_token.unwrap(),
            "password",
        );
        assert!(result.is_err());
    }

    #[actix_rt::test]
    async fn test_validate_password_reset_token() {
        let (mock_data, _, connection_manager, _) = setup_all(
            "test_validate_password_reset_token",
            MockDataInserts::none().user_accounts(),
        )
        .await;

        let service_provider = Arc::new(ServiceProvider::new(
            connection_manager,
            get_test_settings(""),
        ));
        let ctx = ServiceContext::new(service_provider).unwrap();

        let mock_user_accounts = mock_data["base"].user_accounts.clone();
        let user_email = mock_user_accounts[0].email.clone().unwrap();

        // Check that an invalid token returns an error
        let result = ctx
            .service_provider
            .user_account_service
            .validate_password_reset_token(&ctx, "invalid_token");
        assert!(result.is_err());

        // Check that a valid token returns no error

        // Create a password reset token
        let _result = ctx
            .service_provider
            .user_account_service
            .initiate_password_reset(&ctx, &user_email);

        // Get reset token from database
        let repo = UserAccountRowRepository::new(&ctx.connection);
        let user = repo.find_one_by_email(&user_email).unwrap().unwrap();

        // Validate Token
        let result = ctx
            .service_provider
            .user_account_service
            .validate_password_reset_token(&ctx, &user.password_reset_token.unwrap());

        assert!(result.is_ok());
    }

    #[actix_rt::test]
    async fn test_initiate_password_reset() {
        let (mock_data, _, connection_manager, _) = setup_all(
            "test_initiate_password_reset",
            MockDataInserts::none().user_accounts(),
        )
        .await;

        let service_provider = Arc::new(ServiceProvider::new(
            connection_manager,
            get_test_settings(""),
        ));
        let ctx = ServiceContext::new(service_provider).unwrap();

        let mock_user_accounts = mock_data["base"].user_accounts.clone();
        let user_email = mock_user_accounts[0].email.clone().unwrap();

        let _result = ctx
            .service_provider
            .user_account_service
            .initiate_password_reset(&ctx, &user_email);
        // Check that the password reset token is set in the database
        let repo = UserAccountRowRepository::new(&ctx.connection);
        let updated_user_account = repo.find_one_by_email(&user_email).unwrap().unwrap();

        assert!(updated_user_account.password_reset_token.is_some());
        assert!(updated_user_account.password_reset_datetime.is_some());
    }

    #[actix_rt::test]
    async fn test_user_auth() {
        let settings = test_db::get_test_db_settings("test_user_auth");
        let connection_manager = test_db::setup(&settings).await;
        let service_provider = Arc::new(ServiceProvider::new(
            connection_manager,
            get_test_settings(&settings.database_name),
        ));
        let context = ServiceContext::as_server_admin(service_provider).unwrap();
        let service = &context.service_provider.user_account_service;

        // create a test user
        let username = "testuser";
        let password = "passw0rd";
        let email = "testuser@example.com";
        service
            .create_user_account(
                &context,
                CreateUserAccount {
                    username: username.to_string(),
                    password: password.to_string(),
                    email: Some(email.to_string()),
                    id: uuid(),
                    display_name: Some(username.to_string()),
                    permissions: vec![Permission::ServerAdmin],
                },
            )
            .unwrap();

        // should be able to verify correct username and password
        service
            .verify_password(&context, username, password)
            .unwrap();

        // should be able to verify with uppercase(username) and correct password
        service
            .verify_password(&context, &username.to_uppercase(), password)
            .unwrap();

        // should be able to verify with email instead of username and correct password
        service.verify_password(&context, email, password).unwrap();

        // should fail to verify wrong password
        let err = service
            .verify_password(&context, username, "wrong")
            .unwrap_err();
        assert!(matches!(err, VerifyPasswordError::InvalidCredentials));

        // should fail to find invalid user
        let err = service
            .verify_password(&context, "invalid", password)
            .unwrap_err();
        assert!(
            matches!(err, VerifyPasswordError::UsernameDoesNotExist),
            "{:?}",
            err
        );
    }

    #[actix_rt::test]
    async fn test_initiate_user_invite() {
        let (mock_data, _, connection_manager, _) = setup_all(
            "test_initiate_user_invite",
            MockDataInserts::none().user_accounts().permissions(),
        )
        .await;

        let service_provider = Arc::new(service_provider_with_mock_email_service(
            &connection_manager,
        ));

        let inviting_user = mock_data["base"].user_accounts[0].clone();

        let invite_data = InviteUserAccount {
            email: "new-user@example.com".to_string(),
            permissions: vec![Permission::Reader],
            username: "new-user".to_string(),
            display_name: "New User".to_string(),
        };

        let ctx = ServiceContext::with_user(service_provider, inviting_user.id).unwrap();

        let result = ctx
            .service_provider
            .user_account_service
            .initiate_user_invite(&ctx, invite_data.clone());

        assert!(result.is_ok());

        // Check that the user account is created and password reset token is set in the database
        let repo = UserAccountRowRepository::new(&ctx.connection);
        let new_user_account = repo.find_one_by_email(&invite_data.email).unwrap().unwrap();

        assert!(new_user_account.password_reset_token.is_some());
        assert!(new_user_account.password_reset_datetime.is_some());
    }

    #[actix_rt::test]
    async fn test_accept_user_invite() {
        let (mock_data, _, connection_manager, _) = setup_all(
            "test_accept_user_invite",
            MockDataInserts::none().user_accounts().permissions(),
        )
        .await;

        let service_provider = Arc::new(service_provider_with_mock_email_service(
            &connection_manager,
        ));

        let inviting_user = mock_data["base"].user_accounts[0].clone();

        let invite_data = InviteUserAccount {
            email: "new-user@example.com".to_string(),
            permissions: vec![Permission::ServerAdmin],
            username: "new-user".to_string(),
            display_name: "New User".to_string(),
        };

        let ctx = ServiceContext::with_user(service_provider, inviting_user.id).unwrap();

        let result = ctx
            .service_provider
            .user_account_service
            .initiate_user_invite(&ctx, invite_data.clone());

        assert!(result.is_ok());

        // Check that the user account is created and password reset token is set in the database
        let repo = UserAccountRowRepository::new(&ctx.connection);
        let new_user_account = repo.find_one_by_email(&invite_data.email).unwrap().unwrap();

        assert!(new_user_account.password_reset_token.is_some());
        assert!(new_user_account.password_reset_datetime.is_some());

        // Accept the invite
        let accept_data = AcceptUserInvite {
            username: "new-user".to_string(),
            password: "new-password".to_string(),
            display_name: "New User".to_string(),
        };

        // Check that an invalid token is not accepted

        let result = ctx
            .service_provider
            .user_account_service
            .accept_user_invite(&ctx, "InvalidToken", accept_data.clone());
        assert!(result.is_err());

        // Check that a valid token is accepted

        let result = ctx
            .service_provider
            .user_account_service
            .accept_user_invite(
                &ctx,
                new_user_account.password_reset_token.as_ref().unwrap(),
                accept_data.clone(),
            );
        assert!(result.is_ok());

        // Check that the user account is updated in the database

        let updated_user_account = repo.find_one_by_email(&invite_data.email).unwrap().unwrap();

        assert!(updated_user_account.password_reset_token.is_none());
        assert!(updated_user_account.password_reset_datetime.is_none());
        assert!(!updated_user_account.hashed_password.is_empty());
        assert_eq!(updated_user_account.username, accept_data.username);
        assert_eq!(updated_user_account.display_name, accept_data.display_name);
    }
}
