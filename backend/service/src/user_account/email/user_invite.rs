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
pub struct UserInviteParams {
    pub inviter_name: String,
    pub invitee_name: String,
}

pub fn create_user_invite_email(
    to: &str,
    url: &str,
    params: &UserInviteParams,
) -> Result<EnqueueEmailData, EmailServiceError> {
    // TODO - put in an invite name/application name?
    let subject = format!(
        "You have been invited to join the Notification Service for {}",
        ""
    );
    let title_text = "You have been invited to the Notification Service";
    let mut context = Context::new();
    context.insert("url", url);
    context.insert("inviteParams", &params);
    context.insert("title_text", &title_text);
    context.insert("button_text", "Accept Invitation");

    let base_html_template = include_str!("../../email/base.html");
    let html_template = include_str!("templates/user_invite.html");
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

pub fn queue_user_invite_email(
    ctx: &ServiceContext,
    to: &str,
    params: &UserInviteParams,
    reset_token: &str,
) -> Result<(), EmailServiceError> {
    let server_url = ctx.service_provider.settings.server.app_url.clone();

    let verify_account_url = format!("{}/verify-account?token={}", server_url, reset_token);

    let email = create_user_invite_email(to, &verify_account_url, &params)?;
    let enqueue = enqueue_email(ctx, email);

    match enqueue {
        Ok(_) => {
            log::info!("Queued invite email to {}", to);
            Ok(())
        }
        Err(e) => {
            log::error!("Error sending invite email to {}: {:?}", to, e);
            Err(e)
        }
    }
}

#[cfg(test)]
mod email_user_invite_test {
    use std::sync::Arc;

    use repository::{mock::MockDataInserts, test_db::setup_all, EmailQueueRowRepository};

    use crate::{
        service_provider::{ServiceContext, ServiceProvider},
        test_utils::{email_test::send_test_emails, get_test_settings},
        user_account::email::user_invite::{queue_user_invite_email, UserInviteParams},
    };

    #[actix_rt::test]
    async fn test_create_user_invite_email() {
        // This test pretty much just checks that the email renders without error

        let to = "supplier@example.com".to_string();

        let url = "http://localhost:3000/";

        let invite_params = UserInviteParams {
            inviter_name: "Inviter Name".to_string(),
            invitee_name: "Invitee Name".to_string(),
        };

        // Check that we can create a message with a single user
        let message = super::create_user_invite_email(&to, &url, &invite_params);
        if message.is_err() {
            log::error!("Failed to create email: {:?}", message);
        }

        assert!(message.is_ok());
    }

    #[actix_rt::test]
    async fn send_user_invite_email() {
        let (_, _, connection_manager, _) =
            setup_all("send_user_invite_email", MockDataInserts::none()).await;

        let service_provider = Arc::new(ServiceProvider::new(
            connection_manager,
            get_test_settings(""),
        ));

        let context = ServiceContext::new(service_provider.clone()).unwrap();

        let token = "token";
        let invite_params = UserInviteParams {
            invitee_name: "Invitee Name".to_string(),
            inviter_name: "Inviter Name".to_string(),
        };

        let result = queue_user_invite_email(&context, "test@example.com", &invite_params, token);

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
