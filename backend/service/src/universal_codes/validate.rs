use dgraph::{GraphQLError, PendingChange};

pub async fn check_pending_change_exists(
    client: &dgraph::DgraphClient,
    request_id: &str,
) -> Result<Option<PendingChange>, GraphQLError> {
    dgraph::pending_change(&client, request_id.to_string()).await
}

pub async fn check_pending_change_does_not_exist(
    client: &dgraph::DgraphClient,
    request_id: &str,
) -> Result<bool, GraphQLError> {
    let pending_change = check_pending_change_exists(client, request_id).await?;

    Ok(pending_change.is_none())
}
