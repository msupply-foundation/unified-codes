use gql_client::GraphQLError;
use serde::Serialize;

use crate::{DeleteResponse, DeleteResponseData, DgraphClient};

#[derive(Serialize, Debug, Clone)]
struct DeleteVars {
    interaction_id: String,
}

pub async fn delete_interaction(
    client: &DgraphClient,
    interaction_id: String,
) -> Result<DeleteResponse, GraphQLError> {
    let query = r#"
mutation DeleteDrugInteraction($id: String) {
  data: deleteDrugInteraction(filter: {interaction_id: {eq: $id}}) {
    numUids
  }
}"#;
    let variables = DeleteVars {
        interaction_id: interaction_id,
    };

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
    // Deletes are tested in the insert tests, so no specific tests are needed here
}
