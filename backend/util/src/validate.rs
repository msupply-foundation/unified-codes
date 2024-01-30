use regex::Regex;

lazy_static! {
    static ref SPECIAL_CHARS_RE: Regex = Regex::new(r"[^ 0-9A-Za-z_\-@.+:/(),&]").unwrap();
    static ref USERNAME_INVALID_CHARS: Regex = Regex::new(r"[^0-9A-Za-z_\-@.+]").unwrap(); //Username can only include A-Z,0-9, '-' and '_' '@' '+' and '.'
}

pub fn is_valid_name(string: &str) -> bool {
    SPECIAL_CHARS_RE.is_match(string.trim())
}
pub fn is_valid_username(string: &str) -> bool {
    USERNAME_INVALID_CHARS.is_match(string.trim())
}
