#[cynic::schema("universal_codes")]
mod schema {}

#[derive(cynic::QueryVariables, Debug)]
pub struct EntitySearchVariables<'a> {
    pub first: Option<i32>,
    pub offset: Option<i32>,
    pub search: Option<&'a str>,
}

#[derive(cynic::QueryFragment, Debug)]
#[cynic(graphql_type = "Query", variables = "EntitySearchVariables")]
pub struct EntitySearch {
    // #[arguments(filter: { description: { regexp: $search }, or: { code: { alloftext: $search } } }, first: $first, offset: $offset)]
    pub query_entity: Option<Vec<Option<Entity>>>,
}

#[derive(cynic::QueryFragment, Debug)]
pub struct Entity {
    pub id: cynic::Id,
    pub code: Option<String>,
    pub description: Option<String>,
}

#[cfg(test)]
mod tests {
    use cynic::GraphQlResponse;

    use super::*;

    #[test]
    fn all_films_query_gql_output() {
        use cynic::QueryBuilder;

        let vars = EntitySearchVariables {
            first: Some(10),
            offset: Some(0),
            search: Some("/Heparin.Sodium.*/"),
        };

        let operation = EntitySearch::build(vars);

        // println!("{:?}", operation.query);
        // println!("vars{:?}", operation.variables);

        let response = reqwest::blocking::Client::new()
            .post("http://localhost:8080/graphql")
            .json(&operation)
            .send()
            .unwrap();

        println!("{:?}", response.text());

        // let all_films_result = response.json::<GraphQlResponse<EntitySearch>>().unwrap();

        // println!("{:?}", all_films_result);
    }
}
