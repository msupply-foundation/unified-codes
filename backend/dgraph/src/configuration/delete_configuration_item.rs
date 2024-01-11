use gql_client::GraphQLError;
use serde::{Deserialize, Serialize};

use crate::DgraphClient;

#[derive(Serialize, Debug, Clone)]
struct DeleteVars {
    code: String,
}

#[allow(non_snake_case)]
#[derive(Deserialize, Debug, Clone)]
pub struct UpsertResponseData {
    pub data: UpsertResponse,
}

#[allow(non_snake_case)]
#[derive(Deserialize, Debug, Clone)]
pub struct UpsertResponse {
    pub numUids: u32,
}

pub async fn delete_configuration_item(
    client: &DgraphClient,
    code: String,
) -> Result<UpsertResponse, GraphQLError> {
    let query = r#"
mutation DeleteConfigurationInput($code: String) {
  data: deleteConfigurationItem(filter: {code: {eq: $code}}) {
    numUids
  }
}"#;
    let variables = DeleteVars { code: code };

    let result = client
        .gql
        .query_with_vars::<UpsertResponseData, DeleteVars>(&query, variables.clone())
        .await?;

    match result {
        Some(result) => {
            return Ok(UpsertResponse {
                numUids: result.data.numUids,
            })
        }
        None => return Ok(UpsertResponse { numUids: 0 }),
    };
}

#[cfg(test)]
#[cfg(feature = "dgraph-tests")]
mod tests {
    use util::uuid::uuid;

    use crate::insert_configuration_item::{insert_configuration_item, ConfigurationItemInput};

    use super::*;

    #[tokio::test]
    async fn test_delete_configuration_item() {
        let client = DgraphClient::new("http://localhost:8080/graphql");

        let code = uuid();
        let config_type = "test_type".to_string();

        // Create a new configuration item
        let config_item = ConfigurationItemInput {
            code: code.clone(),
            name: "test_name".to_string(),
            r#type: config_type.clone(),
        };

        let result = insert_configuration_item(&client, config_item, true).await;
        if result.is_err() {
            println!(
                "insert_config_item err: {:#?} {:#?}",
                result,
                result.clone().unwrap_err().json()
            );
        }
        assert!(result.is_ok());

        // Delete the configuration item
        let result = delete_configuration_item(&client, code.clone()).await;
        if result.is_err() {
            println!(
                "delete_config_item err: {:#?} {:#?}",
                result,
                result.clone().unwrap_err().json()
            );
        }
        assert!(result.is_ok());
    }
}
