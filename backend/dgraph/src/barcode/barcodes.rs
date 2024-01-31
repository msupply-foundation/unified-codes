use gql_client::GraphQLError;
use serde::Serialize;

use crate::{BarcodeData, DgraphClient};

#[derive(Serialize, Debug)]
pub struct BarcodeQueryVars {
    pub first: Option<u32>,
    pub offset: Option<u32>,
}

pub async fn barcodes(
    client: &DgraphClient,
    vars: BarcodeQueryVars,
) -> Result<Option<BarcodeData>, GraphQLError> {
    let query = r#"
query barcodes($first: Int, $offset: Int) {
  data: queryBarcode(first: $first, offset: $offset) {
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
        .query_with_vars::<BarcodeData, BarcodeQueryVars>(query, vars)
        .await?;

    Ok(data)
}
