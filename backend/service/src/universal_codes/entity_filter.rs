pub struct EntitySearchFilter {
    pub code: Option<String>,
    pub description: Option<String>,
    pub order_by: Option<EntitySort>,
    pub categories: Option<Vec<String>>,
    pub r#type: Option<String>,
    pub search: Option<String>,
    pub r#match: Option<String>,
}

pub struct EntitySort {
    pub descending: Option<bool>,
    pub field: String,
}
