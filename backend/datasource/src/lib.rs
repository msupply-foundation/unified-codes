use ::reqwest::blocking::Client;
pub mod database_settings;
pub use database_settings::*;
pub mod cynic;
pub mod gql;
pub mod graphql;
pub use gql::*;

pub struct DatasourceService {
    pub client: Client,
}

impl DatasourceService {
    pub fn new(client: Client) -> Self {
        DatasourceService { client }
    }
}
