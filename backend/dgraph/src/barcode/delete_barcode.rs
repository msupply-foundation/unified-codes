use gql_client::GraphQLError;
use serde::Serialize;

use crate::{DeleteResponse, DeleteResponseData, DgraphClient};

#[derive(Serialize, Debug, Clone)]
struct DeleteVars {
    gtin: String,
}

pub async fn delete_barcode(
    client: &DgraphClient,
    gtin: String,
) -> Result<DeleteResponse, GraphQLError> {
    let query = r#"
mutation DeleteBarcode($gtin: String) {
  data: deleteBarcode(filter: {gtin: {eq: $gtin}}) {
    numUids
  }
}"#;
    let variables = DeleteVars { gtin };

    let result = client
        .query_with_retry::<DeleteResponseData, DeleteVars>(&query, variables)
        .await?;

    match result {
        Some(result) => {
            return Ok(DeleteResponse {
                numUids: result.data.numUids,
            })
        }
        None => return Ok(DeleteResponse { numUids: 0 }),
    }
}

#[cfg(test)]
#[cfg(feature = "dgraph-tests")]
mod tests {
    use util::uuid::uuid;

    use crate::{
        barcode::barcode::barcode_by_gtin,
        insert_barcode::{insert_barcode, BarcodeInput, EntityCode},
    };

    use super::*;

    #[tokio::test]
    async fn test_delete_barcode() {
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

        // Barcode exists
        let result = barcode_by_gtin(&client, barcode_input.gtin.clone()).await;

        if result.is_err() {
            println!(
                "barcode_by_gtin err: {:#?} {:#?}",
                result,
                result.clone().unwrap_err().json()
            );
        };

        assert!(result.unwrap().is_some());

        let result = delete_barcode(&client, barcode_input.gtin.clone()).await;
        if result.is_err() {
            println!(
                "delete_barcode err: {:#?} {:#?}",
                result,
                result.clone().unwrap_err().json()
            );
        };
        assert!(result.is_ok());

        // Barcode no longer exists
        let result = barcode_by_gtin(&client, barcode_input.gtin.clone()).await;

        if result.is_err() {
            println!(
                "barcode_by_gtin err: {:#?} {:#?}",
                result,
                result.clone().unwrap_err().json()
            );
        };

        assert!(result.unwrap().is_none());
    }
}
