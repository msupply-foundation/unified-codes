use gql_client::GraphQLError;

use crate::{DgraphClient, GS1Data};

pub async fn gs1s(client: &DgraphClient) -> Result<Option<GS1Data>, GraphQLError> {
    let query = r#"
query gs1s {
  data: queryGS1 {
    manufacturer
    gtin
    entity {
        description
        name
        code
    }
  }
}
"#;
    let data = client.gql.query::<GS1Data>(query).await?;

    Ok(data)
}
