use dgraph::Entity;

pub struct EntityCollection {
    pub data: Vec<Entity>,
    pub total_length: u32,
}
