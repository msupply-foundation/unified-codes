use std::io::{ErrorKind, Write};

use actix_files as fs;
use actix_multipart::Multipart;
use actix_web::error::InternalError;
use actix_web::http::header::{ContentDisposition, DispositionParam, DispositionType};
use actix_web::http::StatusCode;
use actix_web::web::{Data, ReqData};
use actix_web::{web, Error, HttpRequest, HttpResponse};
use futures_util::TryStreamExt;
use serde::{Deserialize, Serialize};
use service::auth::{AuthorisationError, Resource, ResourceAccessRequest};
use service::service_provider::{ServiceContext, ServiceProvider};
use service::settings::Settings;
use service::static_files::{StaticFileCategory, StaticFileService};

use service::auth_data::AuthenticationContext;

// this function could be located in different module
pub fn config_static_files(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::resource("/files")
            .route(web::get().to(files))
            .route(web::post().to(upload_temporary_file)),
    );
}

#[derive(Debug, Deserialize)]
pub struct FileRequestQuery {
    id: String,
}

#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct UploadedFile {
    id: String,
    name: String,
    filename: String,
    mime_type: String,
}

async fn files(
    req: HttpRequest,
    query: web::Query<FileRequestQuery>,
    settings: Data<Settings>,
) -> Result<HttpResponse, Error> {
    let service = StaticFileService::new(&settings.server.base_dir)
        .map_err(|err| InternalError::new(err, StatusCode::INTERNAL_SERVER_ERROR))?;

    let static_file_category = StaticFileCategory::Temporary;

    let file = service
        .find_file(&query.id, static_file_category)
        .map_err(|err| InternalError::new(err, StatusCode::INTERNAL_SERVER_ERROR))?
        .ok_or_else(|| std::io::Error::new(ErrorKind::NotFound, "Static file not found"))?;

    let response = fs::NamedFile::open(file.path)?
        .set_content_disposition(ContentDisposition {
            disposition: DispositionType::Inline,
            parameters: vec![DispositionParam::Filename(file.name)],
        })
        .into_response(&req);

    Ok(response)
}

async fn handle_file_upload(
    mut payload: Multipart,
    settings: Data<Settings>,
    file_category: StaticFileCategory,
) -> Result<Vec<UploadedFile>, Error> {
    let service = StaticFileService::new(&settings.server.base_dir)
        .map_err(|err| InternalError::new(err, StatusCode::INTERNAL_SERVER_ERROR))?;

    let mut files = Vec::new();

    while let Some(mut field) = payload.try_next().await? {
        // A multipart/form-data stream has to contain `content_disposition`
        let content_disposition = field.content_disposition();
        log::info!(
            "Uploading File: {}",
            content_disposition.get_filename().unwrap_or_default()
        );
        log::debug!("Content Disposition: {:?}", content_disposition);
        log::debug!("Content Type: {:?}", field.content_type());

        let sanitized_filename =
            sanitize_filename::sanitize(content_disposition.get_filename().unwrap_or_default());
        let static_file = service
            .reserve_file(&sanitized_filename, &file_category)
            .map_err(|err| InternalError::new(err, StatusCode::INTERNAL_SERVER_ERROR))?;

        files.push(UploadedFile {
            id: static_file.id.clone(),
            name: content_disposition
                .get_name()
                .unwrap_or_default()
                .to_string(),
            filename: content_disposition
                .get_filename()
                .unwrap_or_default()
                .to_string(),
            mime_type: field.content_type().to_string(),
        });

        // File::create is blocking operation, use threadpool
        let mut f = web::block(|| std::fs::File::create(static_file.path)).await??;

        // Field in turn is stream of *Bytes* object
        while let Some(chunk) = field.try_next().await? {
            // filesystem operations are blocking, we have to use threadpool
            f = web::block(move || f.write_all(&chunk).map(|_| f)).await??;
        }
    }
    Ok(files)
}

async fn upload_temporary_file(
    payload: Multipart,
    settings: Data<Settings>,
    authentication_context: Option<ReqData<AuthenticationContext>>,
    service_provider: Data<ServiceProvider>,
) -> Result<HttpResponse, Error> {
    log::debug!("Auth Context: {:?}", authentication_context);

    let authentication_context = match authentication_context {
        Some(authentication_context) => authentication_context.into_inner(),
        None => {
            return Err(
                InternalError::new("No authentication context", StatusCode::UNAUTHORIZED).into(),
            );
        }
    };

    let db_connection = service_provider
        .connection()
        .map_err(|err| InternalError::new(err, StatusCode::INTERNAL_SERVER_ERROR))?;

    let service_context = ServiceContext {
        connection: db_connection,
        service_provider: service_provider.clone().into_inner(),
        user_id: authentication_context.clone().user_id,
    };

    let authorised_user = service_provider.validation_service.validate(
        &service_context,
        &authentication_context,
        &ResourceAccessRequest {
            resource: Resource::ServerAdmin,
        },
    );

    if let Err(err) = authorised_user {
        match err {
            AuthorisationError::Denied(_) => {
                return Err(InternalError::new("Access Denied", StatusCode::FORBIDDEN).into());
            }
            AuthorisationError::InternalError(_e) => {
                return Err(
                    InternalError::new("InternalError", StatusCode::INTERNAL_SERVER_ERROR).into(),
                );
            }
        }
    }

    let files = handle_file_upload(payload, settings, StaticFileCategory::Temporary).await?;

    Ok(HttpResponse::Ok().json(files))
}
