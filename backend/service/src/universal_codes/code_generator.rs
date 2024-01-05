// Function to generate a universal code similar to existing ones  e.g. 358b04bf, c7750265 etc
use util::uuid::uuid;

pub fn generate_code() -> String {
    let uuid = uuid();
    let uuid = uuid.replace("-", "");
    let uuid = uuid.chars().take(8).collect::<String>();
    uuid
}
