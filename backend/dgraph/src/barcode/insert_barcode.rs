use gql_client::GraphQLError;
use serde::Serialize;

use crate::{DgraphClient, UpsertResponse, UpsertResponseData};

#[derive(Serialize, Debug, Clone)]
pub struct EntityCode {
    pub code: String,
}

#[derive(Serialize, Debug, Clone)]
pub struct BarcodeInput {
    pub manufacturer: String,
    pub gtin: String,
    pub entity: EntityCode,
}

#[derive(Serialize, Debug, Clone)]
struct UpsertVars {
    input: BarcodeInput,
    upsert: bool,
}

pub async fn insert_barcode(
    client: &DgraphClient,
    barcode: BarcodeInput,
    upsert: bool,
) -> Result<UpsertResponse, GraphQLError> {
    let query = r#"
mutation AddBarcode($input: [AddBarcodeInput!]!, $upsert: Boolean = false) {
  data: addBarcode(input: $input, upsert: $upsert) {
    numUids
  }
}"#;
    let variables = UpsertVars {
        input: barcode,
        upsert,
    };

    let result = client
        .query_with_retry::<UpsertResponseData, UpsertVars>(&query, variables)
        .await?;

    match result {
        Some(result) => {
            return Ok(UpsertResponse {
                numUids: result.data.numUids,
            })
        }
        None => return Ok(UpsertResponse { numUids: 0 }),
    }
}

#[cfg(test)]
#[cfg(feature = "dgraph-tests")]
mod tests {
    use crate::barcode::barcode::barcode_by_gtin;
    use crate::barcode::delete_barcode::delete_barcode;
    use util::uuid::uuid;

    use super::*;

    #[tokio::test]
    async fn test_insert_barcode() {
        // Create a DgraphClient instance
        let client = DgraphClient::new("http://localhost:8080/graphql");

        let barcode_input = BarcodeInput {
            manufacturer: "test_manufacturer".to_string(),
            gtin: uuid(),
            entity: EntityCode {
                code: "c7750265".to_string(),
            },
        };

        let result = insert_barcode(&client, barcode_input.clone(), true).await;
        if result.is_err() {
            println!(
                "insert_barcode err: {:#?} {:#?}",
                result,
                result.clone().unwrap_err().json()
            );
        };

        // Check if the new record can be found by querying for the gtin
        let result = barcode_by_gtin(&client, barcode_input.gtin.clone()).await;

        if result.is_err() {
            println!(
                "barcode_by_gtin err: {:#?} {:#?}",
                result,
                result.clone().unwrap_err().json()
            );
        };

        let data = result.unwrap().unwrap();
        assert_eq!(data.manufacturer, barcode_input.manufacturer);

        // Delete the record
        let _result = delete_barcode(&client, barcode_input.gtin.clone())
            .await
            .unwrap();
    }
}
