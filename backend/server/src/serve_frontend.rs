use actix_web::{
    get,
    http::{header::ContentType, StatusCode},
    web::ServiceConfig,
    HttpRequest, HttpResponse, Responder,
};
use mime_guess::{from_path, mime};
use rust_embed::RustEmbed;

#[derive(RustEmbed)]
// Relative to server/Cargo.toml
#[folder = "../../frontend/packages/host/dist/"]
struct Asset;

const INDEX: &str = "index.html";

#[allow(clippy::if_same_then_else)]
// https://github.com/pyrossh/rust-embed/blob/master/examples/actix.rs
fn server_frontend(path: &str) -> HttpResponse {
    if let Some(content) = Asset::get(path) {
        let cache_control = if path == "index.html" {
            // The index and config files can change so we don't want to cache them
            // The other files are generally static and can be cached
            // Technically the config.js shouldn't change either but if it did we'd want pick it up immediately.
            "no-cache"
        } else if path.starts_with("locale") {
            // These are the translation json files, in the typescript code they are cached in local storage and invalidated after a yarn build
            // So we don't want to cache them here...
            "no-cache"
        } else {
            // Cache everything else for 1 year
            "max-age=31536000"
        };

        return HttpResponse::Ok()
            .content_type(from_path(path).first_or_octet_stream().as_ref())
            .insert_header(("Cache-Control", cache_control))
            .body(content.data.into_owned());
    }

    HttpResponse::NotFound().body("file not found")
}

// Match file paths (ending  ($) with dot (\.) and at least one character (.+) )
#[get(r#"/{filename:.*\..+$}"#)]
async fn file(req: HttpRequest) -> impl Responder {
    let filename: String = req.match_info().query("filename").parse().unwrap();
    server_frontend(&filename)
}

// Match all paths
#[get("/{_:.*}")]
async fn index(_: HttpRequest) -> impl Responder {
    let result = server_frontend(INDEX);

    // If index not found it's likely the front end was not built
    if result.status() == StatusCode::NOT_FOUND {
        HttpResponse::Ok()
            .content_type(ContentType(mime::TEXT_PLAIN))
            .body("Cannot find index.html. See https://github.com/openmsupply/open-msupply/tree/main/server#serving-front-end")
    } else {
        result
    }
}

pub fn config_server_frontend(cfg: &mut ServiceConfig) {
    cfg.service(file).service(index);
}
