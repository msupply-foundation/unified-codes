use serde;

#[derive(serde::Deserialize, Clone)]
pub struct DgraphSettings {
    pub port: u16,
    pub host: String,
}
