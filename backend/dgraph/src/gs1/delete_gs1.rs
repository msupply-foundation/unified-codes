use gql_client::GraphQLError;
use serde::Serialize;

use crate::{DeleteResponse, DeleteResponseData, DgraphClient};

#[derive(Serialize, Debug, Clone)]
struct DeleteVars {
    gtin: String,
}

pub async fn delete_gs1(
    client: &DgraphClient,
    gtin: String,
) -> Result<DeleteResponse, GraphQLError> {
    let query = r#"
mutation DeleteGS1($gtin: String) {
  data: deleteGS1(filter: {gtin: {eq: $gtin}}) {
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
    use crate::{
        gs1::gs1::gs1_by_gtin,
        insert_gs1::{insert_gs1, EntityCode, GS1Input},
    };
    use util::uuid::uuid;

    use super::*;

    #[tokio::test]
    async fn test_delete_configuration_item() {
        let client = DgraphClient::new("http://localhost:8080/graphql");

        // Create a GS1Input instance
        let gs1_input = GS1Input {
            manufacturer: "test_manufacturer".to_string(),
            gtin: uuid(),
            entity: EntityCode {
                code: "c7750265".to_string(),
            },
        };

        let result = insert_gs1(&client, gs1_input.clone(), true).await;
        if result.is_err() {
            println!(
                "insert_gs1 err: {:#?} {:#?}",
                result,
                result.clone().unwrap_err().json()
            );
        };

        // GS1 exists
        let result = gs1_by_gtin(&client, gs1_input.gtin.clone()).await;

        if result.is_err() {
            println!(
                "gs1_by_gtin err: {:#?} {:#?}",
                result,
                result.clone().unwrap_err().json()
            );
        };

        assert!(result.unwrap().is_some());

        let result = delete_gs1(&client, gs1_input.gtin.clone()).await;
        if result.is_err() {
            println!(
                "delete_gs1 err: {:#?} {:#?}",
                result,
                result.clone().unwrap_err().json()
            );
        };
        assert!(result.is_ok());

        // GS1 no longer exists
        let result = gs1_by_gtin(&client, gs1_input.gtin.clone()).await;

        if result.is_err() {
            println!(
                "gs1_by_gtin err: {:#?} {:#?}",
                result,
                result.clone().unwrap_err().json()
            );
        };

        assert!(result.unwrap().is_none());
    }
}
