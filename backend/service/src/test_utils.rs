use std::{
    env,
    path::{Path, PathBuf},
};

use dgraph::DgraphSettings;
use repository::{test_db::get_test_db_settings, StorageConnectionManager};

use crate::{
    email::{send::EmailSendError, EmailServiceError, EmailServiceTrait},
    service_provider::{ServiceContext, ServiceProvider},
    settings::{MailSettings, ServerSettings, Settings},
};

pub fn find_base_dir() -> PathBuf {
    // Assume the base path is the base path of one of the project crates:
    search_for_base_dir(Path::new(&env::current_dir().unwrap())).unwrap()
}

pub fn search_for_base_dir(path: &Path) -> Result<PathBuf, String> {
    // Strategy is to find the repository crate directory, then assume base path is the only one that contains a folder called repository
    let repository_path = path.join("repository");
    if repository_path.is_dir() {
        Ok(path.to_path_buf())
    } else {
        path.parent()
            .map(search_for_base_dir)
            .unwrap_or_else(|| Err("Failed to locate templates directory".to_string()))
    }
}

// The following settings work for PG and Sqlite (username, password, host and port are
// ignored for the later)
pub fn get_test_settings(db_name: &str) -> Settings {
    Settings {
        server: ServerSettings {
            port: 5432,
            cors_origins: vec!["http://localhost:3007".to_string()],
            base_dir: Some(find_base_dir().to_str().unwrap().to_string()),
            app_url: "http://localhost:8007".to_string(),
        },
        database: get_test_db_settings(db_name),
        mail: MailSettings {
            port: 1025,
            host: "localhost".to_string(),
            starttls: false,
            username: "".to_string(),
            password: "".to_string(),
            from: "no-reply@msupply.foundation".to_string(),
        },
        dgraph: DgraphSettings {
            port: 8080,
            host: "http://localhost".to_string(),
        },
        logging: None,
    }
}

struct MockEmailService {}

impl EmailServiceTrait for MockEmailService {
    fn test_connection(&self) -> Result<bool, EmailServiceError> {
        Ok(true)
    }

    fn send_queued_emails(&self, _ctx: &ServiceContext) -> Result<usize, EmailServiceError> {
        Ok(0)
    }

    fn send_email(
        &self,
        _to: String,
        _subject: String,
        _html_body: String,
        _text_body: String,
    ) -> Result<(), EmailSendError> {
        Ok(())
    }
}

// Create a service provider with a dummy email service
pub fn service_provider_with_mock_email_service(
    connection_manager: &StorageConnectionManager,
) -> ServiceProvider {
    let settings = get_test_settings("db_name"); //because we already have a storage connection manager db_name is not used
    let mut service_provider = ServiceProvider::new(connection_manager.clone(), settings);
    service_provider.email_service = Box::new(MockEmailService {});
    service_provider
}

pub mod email_test {
    use crate::service_provider::ServiceContext;

    #[cfg(feature = "email-tests")]
    pub fn send_test_emails(context: &ServiceContext) {
        context
            .service_provider
            .email_service
            .send_queued_emails(&context)
            .unwrap();
    }

    #[cfg(not(feature = "email-tests"))]
    pub fn send_test_emails(_context: &ServiceContext) {
        println!("Skipping email sending");
    }
}
