use crate::settings::Settings;

// We use a trait for DgraphService to allow mocking in tests
pub trait DgraphServiceTrait: Send + Sync {
    fn helloworld(&self) -> String {
        "Hello World!".to_string()
    }
}

pub struct DgraphService {}

#[derive(Debug)]
pub enum DgraphServiceError {
    InternalError(String),
    BadUserInput(String),
}

impl DgraphService {
    pub fn new(settings: Settings) -> Self {
        DgraphService {}
    }
}

impl DgraphServiceTrait for DgraphService {}

#[cfg(test)]
#[cfg(feature = "dgraph-tests")]
mod test {}
