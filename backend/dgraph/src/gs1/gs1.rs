use gql_client::GraphQLError;
use serde::Serialize;

use crate::{DgraphClient, GS1Data, GS1};

#[derive(Serialize, Debug, Clone)]
struct GS1Vars {
    gtin: String,
}

pub async fn gs1_by_gtin(client: &DgraphClient, gtin: String) -> Result<Option<GS1>, GraphQLError> {
    let query = r#"
query gs1($gtin: String!) {
  data: queryGS1(filter: {gtin: {eq: $gtin}}) {
    gtin
    manufacturer
    entity {
        description
        name
        code
    }
  }
}
"#;
    let vars = GS1Vars { gtin };

    let result = client
        .gql
        .query_with_vars::<GS1Data, GS1Vars>(query, vars)
        .await?;

    match result {
        Some(result) => match result.data.first() {
            Some(gs1) => Ok(Some(gs1.clone())),
            None => Ok(None),
        },
        None => Ok(None),
    }
}
