use async_graphql::dataloader::*;
use async_graphql::*;
use dgraph::{entity_with_parents_by_code, DgraphClient, Entity};
use std::collections::HashMap;

pub struct ProductLoader {
    pub dgraph_client: DgraphClient,
}

#[async_trait::async_trait]
impl Loader<String> for ProductLoader {
    type Value = Option<Entity>;
    type Error = async_graphql::Error;

    async fn load(
        &self,
        record_ids: &[String],
    ) -> Result<HashMap<String, Self::Value>, Self::Error> {
        let mut result_map: HashMap<String, Option<Entity>> = HashMap::new();

        for record_id in record_ids {
            // Get the entity with all parents with the given record_id
            let entity =
                entity_with_parents_by_code(&self.dgraph_client, record_id.to_owned()).await?;
            let product_entity = get_product_from_entity(entity);

            result_map.insert(record_id.to_string(), product_entity);
        }
        Ok(result_map)
    }
}

// Recursively get the product entity from the given entity
fn get_product_from_entity(entity: Option<Entity>) -> Option<Entity> {
    println!("get_product_from_entity: {:?}", entity);

    let entity = match entity {
        Some(entity) => entity,
        None => return None,
    };
    if entity.r#type == "Product" {
        return Some(entity);
    }

    if entity.parents.len() > 0 {
        return get_product_from_entity(Some(entity.parents[0].clone()));
    }
    None
}
