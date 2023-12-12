use std::{
    future::{ready, Ready},
    task::{Context, Poll},
};

use actix_web::{
    dev::{Service, ServiceRequest, ServiceResponse, Transform},
    web::Data,
    Error, HttpMessage,
};
use service::{auth_data::AuthData, token::TokenService};
use service::{auth_data::AuthenticationContext, settings::is_develop};

#[doc(hidden)]
pub struct AuthenticationService<S> {
    service: S,
    auth_data: Data<AuthData>,
}

impl<S, B> Service<ServiceRequest> for AuthenticationService<S>
where
    S: Service<ServiceRequest, Response = ServiceResponse<B>, Error = actix_web::Error>,
{
    type Response = ServiceResponse<B>;
    type Error = Error;
    type Future = S::Future;

    fn poll_ready(&self, ctx: &mut Context<'_>) -> Poll<Result<(), Self::Error>> {
        self.service.poll_ready(ctx)
    }

    fn call(&self, req: ServiceRequest) -> Self::Future {
        log::debug!("AuthenticationService::call");

        let token = req.headers().get("Authorization").and_then(|header_value| {
            header_value.to_str().ok().and_then(|header| {
                if header.starts_with("Bearer ") {
                    return Some(header["Bearer ".len()..header.len()].to_string());
                }
                None
            })
        });

        let token = match token {
            Some(token) => token,
            None => {
                // If there is no token, just continue without setting the auth_context
                log::info!("No Token Auth Token Found");
                return self.service.call(req);
            }
        };

        let token_service = TokenService::new(
            &self.auth_data.token_bucket,
            self.auth_data.auth_token_secret.as_bytes(),
            !is_develop(),
        );

        let token = match token_service.verify_token(&token, None) {
            Ok(token) => token,
            Err(e) => {
                log::error!("Error verifying token: {:?}", e);
                // Invalid Token, continue the request, but if login is required, other code should return an error
                return self.service.call(req);
            }
        };

        let auth_context = AuthenticationContext {
            user_id: token.sub, // sub -> subject (the user's id)
        };

        log::debug!(
            "AuthenticationService::call: auth_context: {:?}",
            auth_context
        );
        req.extensions_mut().insert(auth_context);

        self.service.call(req)
    }
}
#[derive(Clone)]
pub struct AddAuthenticationContext {
    auth_data: Data<AuthData>,
}

impl AddAuthenticationContext {
    pub fn with_auth_data(auth_data: Data<AuthData>) -> Self {
        Self { auth_data }
    }
}

impl<S, B> Transform<S, ServiceRequest> for AddAuthenticationContext
where
    S: Service<ServiceRequest, Response = ServiceResponse<B>, Error = actix_web::Error>,
{
    type Response = ServiceResponse<B>;
    type Error = Error;
    type Future = Ready<Result<Self::Transform, Self::InitError>>;
    type Transform = AuthenticationService<S>;
    type InitError = ();

    fn new_transform(&self, service: S) -> Self::Future {
        ready(Ok(AuthenticationService {
            service,
            auth_data: self.auth_data.clone(),
        }))
    }
}
