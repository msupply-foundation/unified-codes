// Function to generate a universal code similar to existing ones  e.g. 358b04bf, c7750265 etc
use util::uuid::uuid;

pub fn generate_code() -> String {
    let uuid = uuid();
    let uuid = uuid.replace("-", "");
    let uuid = uuid.chars().take(8).collect::<String>();

    // TODO: Check if code already exists in database
    // TODO: If code already exists, generate a new one
    // TODO: Improve this more? Maybe should derive from a hash of the description, or path, or something?
    uuid
}
