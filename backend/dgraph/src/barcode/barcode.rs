use gql_client::GraphQLError;
use serde::Serialize;

use crate::{Barcode, BarcodeData, DgraphClient};

#[derive(Serialize, Debug, Clone)]
struct BarcodeVars {
    gtin: String,
}

pub async fn barcode_by_gtin(
    client: &DgraphClient,
    gtin: String,
) -> Result<Option<Barcode>, GraphQLError> {
    let query = r#"
query barcode($gtin: String!) {
  data: queryBarcode(filter: {gtin: {eq: $gtin}}) {
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
    let vars = BarcodeVars { gtin };

    let result = client
        .gql
        .query_with_vars::<BarcodeData, BarcodeVars>(query, vars)
        .await?;

    match result {
        Some(result) => match result.data.first() {
            Some(barcode) => Ok(Some(barcode.clone())),
            None => Ok(None),
        },
        None => Ok(None),
    }
}
