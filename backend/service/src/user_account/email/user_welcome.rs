use crate::{
    email::{
        enqueue::{enqueue_email, EnqueueEmailData},
        EmailServiceError,
    },
    service_provider::ServiceContext,
};

use nanohtml2text::html2text;
use serde::Serialize;
use tera::{Context, Tera};

#[derive(Debug, Serialize, Clone)]

// creating struct incase we want to add other fields later to this email
pub struct UserWelcomeParams {
    pub username: String,
}

pub fn create_welcome_email(
    to: &str,
    url: &str,
    params: &UserWelcomeParams,
) -> Result<EnqueueEmailData, EmailServiceError> {
    let subject = format!("Welcome to Notify");
    let title_text = "Welcome to Notify!";
    let button_text = "Login to Notify";
    let mut context = Context::new();
    context.insert("url", url);
    context.insert("welcomeParams", &params);
    context.insert("title_text", &title_text);
    context.insert("button_text", &button_text);

    let base_html_template = include_str!("../../email/base.html");
    let html_template = include_str!("templates/user_welcome.html");
    let mut tera = Tera::default();
    tera.add_raw_templates(vec![
        ("base.html", base_html_template),
        ("user_invite.html", html_template),
    ])
    .unwrap();

    let html = tera.render("user_invite.html", &context);
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

pub fn queue_user_welcome_email(
    ctx: &ServiceContext,
    to: &str,
    params: &UserWelcomeParams,
) -> Result<(), EmailServiceError> {
    let server_url = ctx.service_provider.settings.server.app_url.clone();
    let url = format!("{}/login", server_url);

    let email = create_welcome_email(to, &url, params)?;
    let enqueue = enqueue_email(ctx, email);

    match enqueue {
        Ok(_) => {
            log::info!("Successfully queued user welcome email to {}", to);
            Ok(())
        }
        Err(e) => {
            log::error!("Failed to queue user welcome email to {}: {:?}", to, e);
            Err(e)
        }
    }
}

#[cfg(test)]

mod email_user_welcome_test {
    use std::sync::Arc;

    use repository::{mock::MockDataInserts, test_db::setup_all, EmailQueueRowRepository};

    use crate::{
        service_provider::{ServiceContext, ServiceProvider},
        test_utils::{email_test::send_test_emails, get_test_settings},
        user_account::email::user_welcome::{queue_user_welcome_email, UserWelcomeParams},
    };

    #[actix_rt::test]
    async fn test_create_welcome_email() {
        let to = "supplier@example.com".to_string();

        let url = "http://localhost:3000/";
        let welcome_params = UserWelcomeParams {
            username: "supplier".to_string(),
        };

        let message = super::create_welcome_email(&to, &url, &welcome_params);
        if message.is_err() {
            println!("Error: {:?}", message);
        }

        assert!(message.is_ok());
    }

    #[actix_rt::test]
    async fn send_welcome_email() {
        let (_, _, connection_manager, _) =
            setup_all("send_welcome_email", MockDataInserts::none()).await;
        let service_provider = Arc::new(ServiceProvider::new(
            connection_manager,
            get_test_settings(""),
        ));
        let context = ServiceContext::new(service_provider.clone()).unwrap();
        let welcome_params = UserWelcomeParams {
            username: "supplier".to_string(),
        };
        let result = queue_user_welcome_email(&context, "test@example.com", &welcome_params);
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
