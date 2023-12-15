/// Example expand, when called with:
///
/// ```
/// apply_equal_filter!(query, filter.id, organisation_dsl::id)
/// ```
///
/// ```
/// if let Some(equal_filter) = filter.id {
///     if let Some(value) = equal_filter.equal_to {
///         query = query.filter(organisation_dsl::id.eq(value));
///     }
///
///     if let Some(value) = equal_filter.equal_any {
///         query = query.filter(organisation_dsl::id.eq_any(value));
///     }
/// }
/// ```
macro_rules! apply_equal_filter {
    ($query:ident, $filter_field:expr, $dsl_field:expr ) => {{
        if let Some(equal_filter) = $filter_field {
            if let Some(value) = equal_filter.equal_to {
                $query = $query.filter($dsl_field.eq(value));
            }

            if let Some(value) = equal_filter.not_equal_to {
                $query = $query.filter($dsl_field.ne(value));
            }

            if let Some(value) = equal_filter.equal_any {
                $query = $query.filter($dsl_field.eq_any(value));
            }

            if let Some(value) = equal_filter.not_equal_all {
                $query = $query.filter($dsl_field.ne_all(value));
            }

            $query = match equal_filter.is_null {
                Some(true) => $query.filter($dsl_field.is_null()),
                Some(false) => $query.filter($dsl_field.is_not_null()),
                None => $query,
            }
        }
    }};
}

macro_rules! apply_string_filter {
    ($query:ident, $filter_field:expr, $dsl_field:expr ) => {{
        if let Some(filter) = $filter_field {
            if let Some(value) = filter.equal_to {
                $query = $query.filter($dsl_field.eq(value));
            }
            if let Some(value) = filter.not_equal_to {
                $query = $query.filter($dsl_field.ne(value));
            }
            if let Some(value) = filter.equal_any {
                $query = $query.filter($dsl_field.eq_any(value));
            }
            if let Some(value) = filter.not_equal_all {
                $query = $query.filter($dsl_field.ne_all(value));
            }
            if let Some(value) = filter.like {
                // in sqlite like is case insensitive (but on only works with ASCII chars)
                $query = $query.filter($dsl_field.like(format!("%{}%", value)));
            }
            if let Some(value) = filter.starts_with {
                // in sqlite like is case insensitive (but on only works with ASCII chars)
                $query = $query.filter($dsl_field.like(format!("{}%", value)));
            }
            if let Some(value) = filter.ends_with {
                // in sqlite like is case insensitive (but on only works with ASCII chars)
                $query = $query.filter($dsl_field.like(format!("%{}", value)));
            }
            $query = match filter.is_null {
                Some(true) => $query.filter($dsl_field.is_null()),
                Some(false) => $query.filter($dsl_field.is_not_null()),
                None => $query,
            }
        }
    }};
}

/// Example expand, when called with:
///
/// ```
/// apply_date_time_filter!(query, filter.created_datetime, invoice_dsl::created_datetime)
/// ```
///
/// ```
/// if let Some(date_time_filter) = filter.created_datetime {
///     if let Some(value) = date_time_filter.equal_to {
///         query = query.filterd(invoice_dsl::created_datetime.eq(value));
///     }
///
///     if let Some(value) = date_time_filter.before_or_equal_to {
///         query = query.filterd(invoice_dsl::created_datetime.le(value));
///     }
///
///     if let Some(value) = date_time_filter.after_or_equal_to {
///         query = query.filterd(invoice_dsl::created_datetime.ge(value));
///     }
/// }
/// ```
#[allow(unused_macros)]
macro_rules! apply_date_time_filter {
    ($query:ident, $filter_field:expr, $dsl_field:expr ) => {{
        if let Some(date_time_filter) = $filter_field {
            if let Some(value) = date_time_filter.equal_to {
                $query = $query.filter($dsl_field.eq(value));
            }

            if let Some(value) = date_time_filter.before_or_equal_to {
                $query = $query.filter($dsl_field.le(value));
            }

            if let Some(value) = date_time_filter.after_or_equal_to {
                $query = $query.filter($dsl_field.ge(value));
            }

            $query = match date_time_filter.is_null {
                Some(true) => $query.filter($dsl_field.is_null()),
                Some(false) => $query.filter($dsl_field.is_not_null()),
                None => $query,
            }
        }
    }};
}

#[allow(unused_macros)]
macro_rules! apply_date_filter {
    ($query:ident, $filter_field:expr, $dsl_field:expr ) => {{
        if let Some(date_filter) = $filter_field {
            if let Some(value) = date_filter.equal_to {
                $query = $query.filter($dsl_field.eq(value));
            }

            if let Some(value) = date_filter.before_or_equal_to {
                $query = $query.filter($dsl_field.le(value));
            }

            if let Some(value) = date_filter.after_or_equal_to {
                $query = $query.filter($dsl_field.ge(value));
            }
        }
    }};
}

/// Example expand, when called with:
///
/// ```
/// apply_sort_no_case!(query, sort, organisation_dsl, name)
/// ```
///
/// ```
/// if sort.desc.unwrap_or(false) {
///     query = query.order(organisation_dsl::name.desc_no_case());
/// } else {
///     query = query.order(organisation_dsl::name.asc_no_case());
/// }
/// ```
macro_rules! apply_sort_no_case {
    ($query:ident, $sort:ident, $dsl_field:expr) => {{
        use crate::diesel_extensions::OrderByExtensions;
        if $sort.desc.unwrap_or(false) {
            $query = $query.order($dsl_field.desc_no_case());
        } else {
            $query = $query.order($dsl_field.asc_no_case());
        }
    }};
}

/// Example expand, when called with:
///
/// ```
/// apply_sort!(query, sort, organisation_dsl, name)
/// ```
///
/// ```
/// if sort.desc.unwrap_or(false) {
///     query = query.order(organisation_dsl::name.desc());
/// } else {
///     query = query.order(organisation_dsl::name.asc());
/// }
/// ```
#[allow(unused_macros)]
macro_rules! apply_sort {
    ($query:ident, $sort:ident, $dsl_field:expr) => {{
        if $sort.desc.unwrap_or(false) {
            $query = $query.order($dsl_field.desc());
        } else {
            $query = $query.order($dsl_field.asc());
        }
    }};
}

/// Example expand, when called with:
///
/// ```
/// apply_sort_asc_nulls_last!(query, sort, organisation_dsl, name)
/// ```
///
/// ```
/// if sort.desc.unwrap_or(false) {
///     query = query.order(organisation_dsl::name.desc_nulls_first());
/// } else {
///     query = query.order(organisation_dsl::name.asc_nulls_last());
/// }
/// ```
#[allow(unused_macros)]
macro_rules! apply_sort_asc_nulls_last {
    ($query:ident, $sort:ident, $dsl_field:expr) => {{
        use crate::diesel_extensions::OrderByExtensions;
        if $sort.desc.unwrap_or(false) {
            $query = $query.order($dsl_field.desc_nulls_first());
        } else {
            $query = $query.order($dsl_field.asc_nulls_last());
        }
    }};
}
#[allow(unused_imports)]
pub(crate) use apply_date_time_filter;
pub(crate) use apply_equal_filter;
#[allow(unused_imports)]
pub(crate) use apply_sort;
#[allow(unused_imports)]
pub(crate) use apply_sort_asc_nulls_last;
pub(crate) use apply_sort_no_case;
pub(crate) use apply_string_filter;
