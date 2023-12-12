use ::reqwest::blocking::Client;
use entities_query::EntitiesQueryQueryEntity;
use graphql_client::{reqwest::post_graphql_blocking as post_graphql, GraphQLQuery};
use std::error::Error;

#[derive(GraphQLQuery)]
#[graphql(
    schema_path = "../dgraph-schema.json",
    query_path = "src/search.graphql",
    response_derives = "Debug, Serialize, Deserialize"
)]
pub struct EntitiesQuery;

fn entity_search(
    variables: entities_query::Variables,
) -> Result<Vec<std::option::Option<EntitiesQueryQueryEntity>>, Box<dyn Error>> {
    let client = Client::new();

    let response_body =
        post_graphql::<EntitiesQuery, _>(&client, "http://localhost:8080/graphql", variables)?;

    let response_data = response_body
        .data
        .expect("missing response data")
        .query_entity;

    Ok(response_data.unwrap())
}

#[cfg(test)]
mod tests {

    use super::*;

    #[test]
    fn test_graphql() {
        let variables = entities_query::Variables {
            search: Some("/Heparin.Sodium.*/".to_string()),
            first: Some(10),
            offset: Some(0),
        };
        let result = entity_search(variables);
        println!("{:#?}", result);
    }
}
