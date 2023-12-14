use crate::{
    email::{
        enqueue::{enqueue_email, EnqueueEmailData},
        EmailServiceError,
    },
    service_provider::ServiceContext,
};

use nanohtml2text::html2text;
use repository::UserAccount;

use serde::Serialize;
use tera::{Context, Tera};

// This struct exists primarily so we don't have to device serialisation for UserAccountRow
#[derive(Debug, Clone, Serialize)]
struct PasswordResetUser {
    username: String,
    display_name: String,
    reset_token: String,
}

impl From<UserAccount> for PasswordResetUser {
    fn from(user: UserAccount) -> Self {
        let username = user.username;
        let display_name = user.display_name;
        let reset_token = user.password_reset_token.unwrap_or_default();
        PasswordResetUser {
            username,
            display_name,
            reset_token,
        }
    }
}

fn create_password_reset_email(
    to: &str,
    users: Vec<PasswordResetUser>,
    password_reset_base_url: &str,
) -> Result<EnqueueEmailData, EmailServiceError> {
    // Even though this takes an array of users, it should only ever be called for a single email address as only 1 email will be sent

    // TODO: Add name?
    let subject = format!("Password reset requested",);
    let title_text = "Forgot your password?";
    let button_text = "Login Now";
    let mut context = Context::new();
    context.insert("users", &users);
    context.insert("password_reset_base_url", &password_reset_base_url);
    context.insert("title_text", &title_text);
    context.insert("button_text", &button_text);
    context.insert("url", &password_reset_base_url);

    let base_html_template = include_str!("../../email/base.html");
    let html_template = include_str!("templates/password_reset.html");
    let mut tera = Tera::default();
    tera.add_raw_templates(vec![
        ("base.html", base_html_template),
        ("password_reset.html", html_template),
    ])
    .unwrap();
    let html = tera.render("password_reset.html", &context);
    let html = match html {
        Ok(html) => html,
        Err(err) => {
            log::error!("Failed to render user invite email template: {}", err);
            return Err(EmailServiceError::GenericError(err.to_string()));
        }
    };

    let text = html2text(&html);

    let email = EnqueueEmailData {
        to_address: to.to_string(),
        subject: subject,
        html_body: html.to_string(),
        text_body: text,
    };

    Ok(email)
}

pub fn queue_password_reset_email(
    ctx: &ServiceContext,
    to: &str,
    users: Vec<UserAccount>,
) -> Result<(), EmailServiceError> {
    // NOTE: Even though this takes an array of users, it should only ever be called for a single email address as only 1 email will be sent
    let server_url = ctx.service_provider.settings.server.app_url.clone();
    let password_reset_base_url = format!("{}/password-reset?token=", server_url);

    let users: Vec<PasswordResetUser> = users.into_iter().map(|u| u.into()).collect();

    let email = create_password_reset_email(to, users, &password_reset_base_url)?;
    let enqueue = enqueue_email(ctx, email);

    //TODO: Trigger email sending

    match enqueue {
        Ok(_) => {
            log::info!("Queued password reset email to {}", to);
            Ok(())
        }
        Err(e) => {
            log::error!("Error sending password reset email to {}: {:?}", to, e);
            Err(e)
        }
    }
}

#[cfg(test)]
mod email_password_reset_test {
    use std::sync::Arc;

    use repository::{
        mock::MockDataInserts, test_db::setup_all, EmailQueueRowRepository, UserAccount,
    };

    use crate::{
        service_provider::{ServiceContext, ServiceProvider},
        test_utils::{email_test::send_test_emails, get_test_settings},
        user_account::email::password_reset::{queue_password_reset_email, PasswordResetUser},
    };

    #[actix_rt::test]
    async fn test_create_password_reset_email() {
        // This test pretty much just checks that the email renders without error

        let to = "supplier@example.com".to_string();

        let url = "http://localhost:3000/";

        let user1 = PasswordResetUser {
            username: "username1".to_string(),
            display_name: "display_name".to_string(),
            reset_token: "reset_token".to_string(),
        };

        // Check that we can create a message with a single user
        let message = super::create_password_reset_email(&to, vec![user1.clone()], &url);
        if message.is_err() {
            log::error!("Failed to create email: {:?}", message);
        }

        assert!(message.is_ok());

        // Check that we can create a message with multiple users
        let user2 = PasswordResetUser {
            username: "username2".to_string(),
            display_name: "display_name".to_string(),
            reset_token: "reset_token2".to_string(),
        };

        let message = super::create_password_reset_email(&to, vec![user1, user2], &url);
        if message.is_err() {
            log::error!("Failed to create email: {:?}", message);
        }
    }

    #[actix_rt::test]
    async fn send_password_reset_email() {
        let (_, _, connection_manager, _) =
            setup_all("send_password_reset_email", MockDataInserts::none()).await;

        let service_provider = Arc::new(ServiceProvider::new(
            connection_manager,
            get_test_settings(""),
        ));

        let context = ServiceContext::new(service_provider.clone()).unwrap();

        let users = vec![
            UserAccount {
                id: "id1".to_string(),
                username: "username1".to_string(),
                display_name: "display_name".to_string(),
                email: Some("test@example.com".to_string()),
                ..Default::default()
            },
            UserAccount {
                id: "id2".to_string(),
                username: "username2".to_string(),
                display_name: "display_name".to_string(),
                email: Some("test@example.com".to_string()),
                ..Default::default()
            },
        ];

        let result = queue_password_reset_email(&context, "test@example.com", users);

        if !result.is_ok() {
            println!("Error: {:?}", result);
        }
        assert!(result.is_ok());

        // Check that the email was queued
        let repo = EmailQueueRowRepository::new(&context.connection);
        let unsent = repo.un_sent().unwrap();
        assert_eq!(unsent.len(), 1);
        assert_eq!(unsent[0].to_address, "test@example.com");
        send_test_emails(&context);
    }
}
