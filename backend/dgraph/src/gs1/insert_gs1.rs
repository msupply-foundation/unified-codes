use gql_client::GraphQLError;
use serde::Serialize;

use crate::{DgraphClient, UpsertResponse, UpsertResponseData};

#[derive(Serialize, Debug, Clone)]
pub struct EntityCode {
    pub code: String,
}

#[derive(Serialize, Debug, Clone)]
pub struct GS1Input {
    pub manufacturer: String,
    pub gtin: String,
    pub entity: EntityCode,
}

#[derive(Serialize, Debug, Clone)]
struct UpsertVars {
    input: GS1Input,
    upsert: bool,
}

pub async fn insert_gs1(
    client: &DgraphClient,
    gs1: GS1Input,
    upsert: bool,
) -> Result<UpsertResponse, GraphQLError> {
    let query = r#"
mutation AddGS1($input: [AddGS1Input!]!, $upsert: Boolean = false) {
  data: addGS1(input: $input, upsert: $upsert) {
    numUids
  }
}"#;
    let variables = UpsertVars { input: gs1, upsert };

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
    use crate::gs1::delete_gs1::delete_gs1;
    use crate::gs1::gs1::gs1_by_gtin;
    use util::uuid::uuid;

    use super::*;

    #[tokio::test]
    async fn test_insert_gs1() {
        // Create a DgraphClient instance
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

        // Check if the new record can be found by querying for the gtin
        let result = gs1_by_gtin(&client, gs1_input.gtin.clone()).await;

        if result.is_err() {
            println!(
                "gs1_by_gtin err: {:#?} {:#?}",
                result,
                result.clone().unwrap_err().json()
            );
        };

        let data = result.unwrap().unwrap();
        assert_eq!(data.manufacturer, gs1_input.manufacturer);

        // Delete the record
        let _result = delete_gs1(&client, gs1_input.gtin.clone()).await;
    }
}
