use gql_client::GraphQLError;
use serde::Serialize;

use crate::{DgraphClient, GS1Data};

#[derive(Serialize, Debug)]
pub struct GS1QueryVars {
    pub first: Option<u32>,
    pub offset: Option<u32>,
}

pub async fn gs1s(
    client: &DgraphClient,
    vars: GS1QueryVars,
) -> Result<Option<GS1Data>, GraphQLError> {
    let query = r#"
query gs1s($first: Int, $offset: Int) {
  data: queryGS1(first: $first, offset: $offset) {
    manufacturer
    gtin
    entity {
        description
        name
        code
    }
  }
}
"#;
    let data = client
        .gql
        .query_with_vars::<GS1Data, GS1QueryVars>(query, vars)
        .await?;

    Ok(data)
}
