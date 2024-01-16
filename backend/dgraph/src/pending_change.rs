use gql_client::GraphQLError;
use serde::Serialize;

use crate::{DgraphClient, PendingChange, PendingChangeData};

#[derive(Serialize, Debug)]
struct Vars {
    request_id: String,
}

pub async fn pending_change(
    client: &DgraphClient,
    request_id: String,
) -> Result<Option<PendingChange>, GraphQLError> {
    let query = r#"
query PendingChangeQuery($request_id: String!) {
  data: queryPendingChange(filter: { request_id: { eq: $request_id } }) {
    __typename
    request_id
    name
    category
    change_type
    date_requested
    requested_by_user_id
    requested_for
    body
    status
  }
}"#;

    let variables = Vars { request_id };

    let result = client
        .gql
        .query_with_vars::<PendingChangeData, Vars>(query, variables)
        .await?;

    match result {
        Some(result) => match result.data.first() {
            Some(entity) => Ok(Some(entity.clone())),
            None => Ok(None),
        },
        None => Ok(None),
    }
}
