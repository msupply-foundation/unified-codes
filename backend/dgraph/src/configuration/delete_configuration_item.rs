use gql_client::GraphQLError;
use serde::Serialize;

use crate::{DeleteResponse, DeleteResponseData, DgraphClient};

#[derive(Serialize, Debug, Clone)]
struct DeleteVars {
    code: String,
}

pub async fn delete_configuration_item(
    client: &DgraphClient,
    code: String,
) -> Result<DeleteResponse, GraphQLError> {
    let query = r#"
mutation DeleteConfigurationInput($code: String) {
  data: deleteConfigurationItem(filter: {code: {eq: $code}}) {
    numUids
  }
}"#;
    let variables = DeleteVars { code: code };

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
