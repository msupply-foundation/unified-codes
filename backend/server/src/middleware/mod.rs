use actix_web::web::Data;
use service::auth_data::AuthData;

pub mod authentication;
pub mod content_length_limit;

pub fn compress() -> actix_web::middleware::Compress {
    actix_web::middleware::Compress::default()
}

pub fn logger() -> actix_web::middleware::Logger {
    actix_web::middleware::Logger::default()
}

pub fn limit_content_length() -> content_length_limit::ContentLengthLimit {
    content_length_limit::ContentLengthLimit::default()
}

pub fn add_authentication_context(
    auth_data: Data<AuthData>,
) -> authentication::AddAuthenticationContext {
    authentication::AddAuthenticationContext::with_auth_data(auth_data)
}
