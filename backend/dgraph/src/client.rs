use gql_client::Client;

pub struct DgraphClient {
    pub gql: Client,
}

impl DgraphClient {
    pub fn new(url: &str) -> Self {
        DgraphClient {
            gql: Client::new(url),
        }
    }
}
