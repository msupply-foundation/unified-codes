use chrono::{NaiveDate, NaiveDateTime};

#[derive(Clone, PartialEq, Debug)]
pub struct SimpleStringFilter {
    pub equal_to: Option<String>,
    pub like: Option<String>,
}

impl SimpleStringFilter {
    pub fn equal_to(value: &str) -> Self {
        SimpleStringFilter {
            equal_to: Some(value.to_owned()),
            like: None,
        }
    }

    pub fn like(value: &str) -> Self {
        SimpleStringFilter {
            equal_to: None,
            like: Some(value.to_owned()),
        }
    }
}

#[derive(Clone, PartialEq, Debug)]
pub struct StringFilter {
    pub equal_to: Option<String>,
    pub not_equal_to: Option<String>,
    pub equal_any: Option<Vec<String>>,
    pub not_equal_all: Option<Vec<String>>,
    pub like: Option<String>,
    pub starts_with: Option<String>,
    pub ends_with: Option<String>,
    pub is_null: Option<bool>,
}

impl StringFilter {
    pub fn equal_to(value: &str) -> Self {
        StringFilter {
            equal_to: Some(value.to_owned()),
            not_equal_to: None,
            equal_any: None,
            not_equal_all: None,
            like: None,
            starts_with: None,
            ends_with: None,
            is_null: None,
        }
    }

    pub fn not_equal_to(value: &str) -> Self {
        StringFilter {
            equal_to: None,
            not_equal_to: Some(value.to_owned()),
            equal_any: None,
            not_equal_all: None,
            like: None,
            starts_with: None,
            ends_with: None,
            is_null: None,
        }
    }

    pub fn equal_any(value: Vec<String>) -> Self {
        StringFilter {
            equal_to: None,
            not_equal_to: None,
            equal_any: Some(value),
            not_equal_all: None,
            like: None,
            starts_with: None,
            ends_with: None,
            is_null: None,
        }
    }

    pub fn not_equal_all(value: Vec<String>) -> Self {
        StringFilter {
            equal_to: None,
            not_equal_to: None,
            equal_any: None,
            not_equal_all: Some(value),
            like: None,
            starts_with: None,
            ends_with: None,
            is_null: None,
        }
    }

    pub fn like(value: &str) -> Self {
        StringFilter {
            equal_to: None,
            not_equal_to: None,
            equal_any: None,
            not_equal_all: None,
            like: Some(value.to_owned()),
            starts_with: None,
            ends_with: None,
            is_null: None,
        }
    }

    pub fn starts_with(value: &str) -> Self {
        StringFilter {
            equal_to: None,
            not_equal_to: None,
            equal_any: None,
            not_equal_all: None,
            like: None,
            starts_with: Some(value.to_owned()),
            ends_with: None,
            is_null: None,
        }
    }

    pub fn ends_with(value: &str) -> Self {
        StringFilter {
            equal_to: None,
            not_equal_to: None,
            equal_any: None,
            not_equal_all: None,
            like: None,
            starts_with: None,
            ends_with: Some(value.to_owned()),
            is_null: None,
        }
    }
}

#[derive(Clone, PartialEq, Debug)]
pub struct EqualFilter<T> {
    pub equal_to: Option<T>,
    pub not_equal_to: Option<T>,
    pub equal_any: Option<Vec<T>>,
    pub not_equal_all: Option<Vec<T>>,
    pub is_null: Option<bool>,
}

impl<T> EqualFilter<T> {
    pub fn equal_to_generic(value: T) -> Self {
        EqualFilter {
            equal_to: Some(value),
            not_equal_to: None,
            equal_any: None,
            not_equal_all: None,
            is_null: None,
        }
    }

    pub fn equal_any_generic(value: Vec<T>) -> Self {
        EqualFilter {
            equal_to: None,
            not_equal_to: None,
            equal_any: Some(value),
            not_equal_all: None,
            is_null: None,
        }
    }
}

impl EqualFilter<i64> {
    pub fn equal_to_i64(value: i64) -> Self {
        EqualFilter {
            equal_to: Some(value),
            not_equal_to: None,
            equal_any: None,
            not_equal_all: None,
            is_null: None,
        }
    }
}

impl EqualFilter<i32> {
    pub fn equal_to_i32(value: i32) -> Self {
        EqualFilter {
            equal_to: Some(value),
            not_equal_to: None,
            equal_any: None,
            not_equal_all: None,
            is_null: None,
        }
    }
}
impl EqualFilter<bool> {
    pub fn equal_to_bool(value: bool) -> Self {
        EqualFilter {
            equal_to: Some(value),
            not_equal_to: None,
            equal_any: None,
            not_equal_all: None,
            is_null: None,
        }
    }
}

impl EqualFilter<String> {
    pub fn equal_to(value: &str) -> Self {
        EqualFilter {
            equal_to: Some(value.to_owned()),
            not_equal_to: None,
            equal_any: None,
            not_equal_all: None,
            is_null: None,
        }
    }

    pub fn not_equal_to(value: &str) -> Self {
        EqualFilter {
            equal_to: None,
            not_equal_to: Some(value.to_owned()),
            equal_any: None,
            not_equal_all: None,
            is_null: None,
        }
    }

    pub fn equal_any(value: Vec<String>) -> Self {
        EqualFilter {
            equal_to: None,
            not_equal_to: None,
            equal_any: Some(value),
            not_equal_all: None,
            is_null: None,
        }
    }

    pub fn not_equal_all(value: Vec<String>) -> Self {
        EqualFilter {
            equal_to: None,
            not_equal_to: None,
            equal_any: None,
            not_equal_all: Some(value),
            is_null: None,
        }
    }

    pub fn is_null(value: bool) -> Self {
        EqualFilter {
            equal_to: None,
            not_equal_to: None,
            equal_any: None,
            not_equal_all: None,
            is_null: Some(value),
        }
    }
}

#[derive(Clone, Debug, PartialEq)]
pub struct DatetimeFilter {
    pub equal_to: Option<NaiveDateTime>,
    pub before_or_equal_to: Option<NaiveDateTime>,
    pub after_or_equal_to: Option<NaiveDateTime>,
    pub is_null: Option<bool>,
}

impl DatetimeFilter {
    pub fn date_range(from: NaiveDateTime, to: NaiveDateTime) -> DatetimeFilter {
        DatetimeFilter {
            equal_to: None,
            after_or_equal_to: Some(from),
            before_or_equal_to: Some(to),
            is_null: None,
        }
    }

    pub fn equal_to(value: NaiveDateTime) -> Self {
        DatetimeFilter {
            equal_to: Some(value.to_owned()),
            after_or_equal_to: None,
            before_or_equal_to: None,
            is_null: None,
        }
    }

    pub fn after_or_equal_to(value: NaiveDateTime) -> Self {
        DatetimeFilter {
            equal_to: None,
            after_or_equal_to: Some(value.to_owned()),
            before_or_equal_to: None,
            is_null: None,
        }
    }

    pub fn before_or_equal_to(value: NaiveDateTime) -> Self {
        DatetimeFilter {
            equal_to: None,
            after_or_equal_to: None,
            before_or_equal_to: Some(value),
            is_null: None,
        }
    }

    pub fn is_null(value: bool) -> Self {
        DatetimeFilter {
            equal_to: None,
            after_or_equal_to: None,
            before_or_equal_to: None,
            is_null: Some(value),
        }
    }
}

#[derive(Clone, Debug, PartialEq)]
pub struct DateFilter {
    pub equal_to: Option<NaiveDate>,
    pub before_or_equal_to: Option<NaiveDate>,
    pub after_or_equal_to: Option<NaiveDate>,
}

impl DateFilter {
    pub fn date_range(from: &NaiveDate, to: &NaiveDate) -> DateFilter {
        DateFilter {
            equal_to: None,
            after_or_equal_to: Some(*from),
            before_or_equal_to: Some(*to),
        }
    }

    pub fn after_or_equal_to(value: NaiveDate) -> Self {
        DateFilter {
            equal_to: None,
            after_or_equal_to: Some(value.to_owned()),
            before_or_equal_to: None,
        }
    }

    pub fn equal_to(value: NaiveDate) -> Self {
        DateFilter {
            equal_to: Some(value.to_owned()),
            after_or_equal_to: None,
            before_or_equal_to: None,
        }
    }

    pub fn before_or_equal_to(value: NaiveDate) -> Self {
        DateFilter {
            equal_to: None,
            after_or_equal_to: None,
            before_or_equal_to: Some(value),
        }
    }
}

#[derive(PartialEq, Debug)]
pub struct Sort<T> {
    pub key: T,
    pub desc: Option<bool>,
}

pub const DEFAULT_PAGINATION_LIMIT: u32 = 100;

#[derive(Debug, PartialEq)]
pub struct PaginationOption {
    pub limit: Option<u32>,
    pub offset: Option<u32>,
}

pub struct Pagination {
    pub limit: u32,
    pub offset: u32,
}

impl Pagination {
    pub fn new() -> Pagination {
        Pagination {
            offset: 0,
            limit: DEFAULT_PAGINATION_LIMIT,
        }
    }

    pub fn all() -> Pagination {
        Pagination {
            offset: 0,
            limit: std::u32::MAX,
        }
    }

    pub fn one() -> Pagination {
        Pagination {
            offset: 0,
            limit: 1,
        }
    }
}

impl Default for Pagination {
    fn default() -> Self {
        Self::new()
    }
}
