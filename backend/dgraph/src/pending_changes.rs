use gql_client::GraphQLError;
use serde::Serialize;

use crate::{ChangeStatus, DgraphClient, DgraphFilterType, DgraphOrderByType, PendingChangeData};

#[derive(Serialize, Debug, Default)]
pub struct ChangeStatusDgraphFilterType {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub regexp: Option<ChangeStatus>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub eq: Option<ChangeStatus>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub r#in: Option<Vec<ChangeStatus>>,
}

#[derive(Serialize, Debug, Default)]
pub struct PendingChangesDgraphFilter {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub name: Option<DgraphFilterType>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub status: Option<ChangeStatusDgraphFilterType>,
}

#[derive(Serialize, Debug)]
pub struct PendingChangesQueryVars {
    pub filter: PendingChangesDgraphFilter,
    pub first: Option<u32>,
    pub offset: Option<u32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub order: Option<DgraphOrderByType>,
}

pub async fn pending_changes(
    client: &DgraphClient,
    variables: PendingChangesQueryVars,
) -> Result<Option<PendingChangeData>, GraphQLError> {
    let query = r#"
query PendingChangesQuery($filter: PendingChangeFilter, $first: Int, $offset: Int, $order: PendingChangeOrder) {
  data: queryPendingChange(filter: $filter, first: $first, offset: $offset, order: $order ) {
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

  aggregates: aggregatePendingChange(filter: $filter) {
    count
  }
}"#;
    let result = client
        .gql
        .query_with_vars::<PendingChangeData, PendingChangesQueryVars>(query, variables)
        .await?;

    Ok(result)
}
