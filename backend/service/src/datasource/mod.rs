use crate::settings::Settings;

// We use a trait for DatasourceService to allow mocking in tests
pub trait DatasourceServiceTrait: Send + Sync {
    fn helloworld(&self) -> String {
        "Hello World!".to_string()
    }
}

pub struct DatasourceService {}

#[derive(Debug)]
pub enum DatasourceServiceError {
    InternalError(String),
    BadUserInput(String),
}

impl DatasourceService {
    pub fn new(settings: Settings) -> Self {
        DatasourceService {}
    }
}

impl DatasourceServiceTrait for DatasourceService {}

#[cfg(test)]
#[cfg(feature = "datasource-tests")]
mod test {}
