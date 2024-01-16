use dgraph::PendingChange;

pub struct PendingChangeCollection {
    pub data: Vec<PendingChange>,
    pub total_length: u32,
}
