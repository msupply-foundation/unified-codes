use gql_client::GraphQLError;
use serde::Serialize;

use crate::{DeleteResponse, DeleteResponseData, DgraphClient};

#[derive(Serialize, Debug, Clone)]
struct DeleteVars {
    code: String,
}

// Dgraph sometimes returns an error like this:
// {"errors":[{"message":"Transaction has been aborted. Please retry","locations":[{"line":2,"column":3}],"extensions":{"code":"Error"}}],"data":null}
// Seems to mostly happen in tests, but in case this happens in production we'll retry a few times
// Sounds like this could possibly be to do with updating the same index? X-Dgraph-IgnoreIndexConflict?
const RETRIES: u32 = 3;

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

    let mut attempts = 0;
    while attempts < RETRIES {
        let result = client
            .gql
            .query_with_vars::<DeleteResponseData, DeleteVars>(&query, variables.clone())
            .await;

        let result = match result {
            Ok(result) => result,
            Err(err) => {
                attempts += 1;

                if attempts >= RETRIES {
                    return Err(err);
                }
                log::error!(
                    "delete_configuration_item failed, retrying: {:#?} {:#?}",
                    attempts,
                    variables
                );
                continue;
            }
        };

        match result {
            Some(result) => {
                return Ok(DeleteResponse {
                    numUids: result.data.numUids,
                })
            }
            None => return Ok(DeleteResponse { numUids: 0 }),
        };
    }
    Err(GraphQLError::with_text(format!(
        "delete_configuration_item failed after {} retries",
        RETRIES
    )))
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
