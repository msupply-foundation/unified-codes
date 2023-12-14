use async_graphql::{InputObject, InputType};
use chrono::{DateTime, NaiveDate, Utc};
use repository::{DateFilter, DatetimeFilter, EqualFilter, SimpleStringFilter, StringFilter};

// simple string filter
#[derive(InputObject, Clone)]
pub struct SimpleStringFilterInput {
    /// Search term must be an exact match (case sensitive)
    equal_to: Option<String>,
    /// Search term must be included in search candidate (case insensitive)
    like: Option<String>,
}

impl From<SimpleStringFilterInput> for SimpleStringFilter {
    fn from(f: SimpleStringFilterInput) -> Self {
        SimpleStringFilter {
            equal_to: f.equal_to,
            like: f.like,
        }
    }
}

impl From<SimpleStringFilterInput> for StringFilter {
    fn from(f: SimpleStringFilterInput) -> Self {
        StringFilter {
            equal_to: f.equal_to,
            like: f.like,
            not_equal_to: None,
            equal_any: None,
            not_equal_all: None,
            starts_with: None,
            ends_with: None,
            is_null: None,
        }
    }
}
#[derive(InputObject, Clone)]
pub struct StringFilterInput {
    /// Search term must be an exact match (case sensitive)
    equal_to: Option<String>,
    /// Search term must be included in search candidate (case insensitive)
    like: Option<String>,
    not_equal_to: Option<String>,
    equal_any: Option<Vec<String>>,
    not_equal_all: Option<Vec<String>>,
    starts_with: Option<String>,
    ends_with: Option<String>,
    is_null: Option<bool>,
}

impl From<StringFilterInput> for StringFilter {
    fn from(f: StringFilterInput) -> Self {
        StringFilter {
            equal_to: f.equal_to,
            like: f.like,
            not_equal_to: f.not_equal_to,
            equal_any: f.equal_any,
            not_equal_all: f.not_equal_all,
            starts_with: f.starts_with,
            ends_with: f.ends_with,
            is_null: f.is_null,
        }
    }
}

#[derive(InputObject, Clone)]
#[graphql(concrete(name = "EqualFilterStringInput", params(String)))]
#[graphql(concrete(name = "EqualFilterNumberInput", params(i32)))]
#[graphql(concrete(name = "EqualFilterBigNumberInput", params(i64)))]
pub struct EqualFilterInput<T: InputType> {
    pub equal_to: Option<T>,
    pub equal_any: Option<Vec<T>>,
    pub not_equal_to: Option<T>,
}

pub type EqualFilterStringInput = EqualFilterInput<String>;
pub type EqualFilterNumberInput = EqualFilterInput<i32>;
pub type EqualFilterBigNumberInput = EqualFilterInput<i64>;

impl<I: InputType> EqualFilterInput<I> {
    pub fn map_to_domain<F, T>(self, to_domain: F) -> EqualFilter<T>
    where
        F: Fn(I) -> T,
    {
        EqualFilter {
            equal_to: self.equal_to.map(&to_domain),
            not_equal_to: self.not_equal_to.map(&to_domain),
            equal_any: self
                .equal_any
                .map(|inputs| inputs.into_iter().map(&to_domain).collect()),
            not_equal_all: None,
            is_null: None,
        }
    }
}

impl<T> From<EqualFilterInput<T>> for EqualFilter<T>
where
    T: InputType,
{
    fn from(
        EqualFilterInput {
            equal_to,
            equal_any,
            not_equal_to,
        }: EqualFilterInput<T>,
    ) -> Self {
        EqualFilter {
            equal_to,
            equal_any,
            not_equal_to,
            not_equal_all: None,
            is_null: None,
        }
    }
}

// Datetime filter

#[derive(InputObject, Clone)]
pub struct DatetimeFilterInput {
    pub equal_to: Option<DateTime<Utc>>,
    pub before_or_equal_to: Option<DateTime<Utc>>,
    pub after_or_equal_to: Option<DateTime<Utc>>,
}

impl From<DatetimeFilterInput> for DatetimeFilter {
    fn from(f: DatetimeFilterInput) -> Self {
        DatetimeFilter {
            equal_to: f.equal_to.map(|t| t.naive_utc()),
            before_or_equal_to: f.before_or_equal_to.map(|t| t.naive_utc()),
            after_or_equal_to: f.after_or_equal_to.map(|t| t.naive_utc()),
            is_null: None,
        }
    }
}

#[derive(InputObject, Clone)]
pub struct DateFilterInput {
    pub equal_to: Option<NaiveDate>,
    pub before_or_equal_to: Option<NaiveDate>,
    pub after_or_equal_to: Option<NaiveDate>,
}

impl From<DateFilterInput> for DateFilter {
    fn from(f: DateFilterInput) -> Self {
        DateFilter {
            equal_to: f.equal_to,
            before_or_equal_to: f.before_or_equal_to,
            after_or_equal_to: f.after_or_equal_to,
        }
    }
}
