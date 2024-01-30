use diesel::Expression;

diesel_postfix_operator!(AscNoCase, " COLLATE NOCASE ASC NULLS FIRST", ());
diesel_postfix_operator!(DescNoCase, " COLLATE NOCASE DESC NULLS LAST", ());
diesel_postfix_operator!(AscNullsFirst, " ASC NULLS FIRST", ());
diesel_postfix_operator!(DescNullsLast, " DESC NULLS LAST", ());
diesel_postfix_operator!(AscNullsLast, " ASC NULLS LAST", ());
diesel_postfix_operator!(DescNullsFirst, " DESC NULLS FIRST", ());

// Expression extensions for order by
pub trait OrderByExtensions: Sized {
    /// Creates a SQL - COLLATE NOCASE ASC NULLS FIRST expression
    ///
    /// NOCASE collation must exist, i.e.
    /// ```sql
    /// CREATE COLLATION NOCASE (provider = icu, locale = pg_catalog."default", deterministic = false);
    ///```
    ///
    /// NULLS FIRST required since postgres and sqlite treats nulls differently in sort
    /// Should work in sqlite 3.3 and above
    ///
    /// # Examples
    ///
    /// See tests, can be added as doc tests here if this is lib crate
    ///
    fn asc_no_case(self) -> AscNoCase<Self> {
        AscNoCase::new(self)
    }

    /// Creates a SQL - COLLATE NOCASE DESC NULLS FIRST expression
    ///
    /// NOCASE collation must exist, i.e.
    /// ```sql
    /// CREATE COLLATION NOCASE (provider = icu, locale = pg_catalog."default", deterministic = false);
    ///```
    ///
    /// NULLS FIRST required since postgres and sqlite treats nulls differently in sort
    /// Should work in sqlite 3.3 and above
    ///
    /// # Examples
    ///
    /// See tests, can be added as doc tests here if this is lib crate
    ///
    ///
    fn desc_no_case(self) -> DescNoCase<Self> {
        DescNoCase::new(self)
    }

    /// Creates a SQL ASC NULLS FIRST expression
    ///
    /// Required since postgres and sqlite treats nulls differently in sort
    /// Should work in sqlite 3.3 and above
    ///
    /// # Examples
    ///
    /// See tests, can be added as doc tests here if this is lib crate
    ///
    fn asc_nulls_first(self) -> AscNullsFirst<Self> {
        AscNullsFirst::new(self)
    }

    /// Creates a SQL DESC NULLS LAST expression
    ///
    /// Required since postgres and sqlite treats nulls differently in sort
    /// Should work in sqlite 3.3 and above
    ///
    /// # Examples
    ///
    /// See tests, can be added as doc tests here if this is lib crate
    ///
    fn desc_nulls_last(self) -> DescNullsLast<Self> {
        DescNullsLast::new(self)
    }

    /// Creates a SQL ASC NULLS LAST expression
    ///
    /// Required since postgres and sqlite treats nulls differently in sort
    /// Should work in sqlite 3.3 and above
    ///
    /// # Examples
    ///
    /// See tests, can be added as doc tests here if this is lib crate
    ///
    fn asc_nulls_last(self) -> AscNullsLast<Self> {
        AscNullsLast::new(self)
    }

    /// Creates a SQL DESC NULLS FIRST expression
    ///
    /// Required since postgres and sqlite treats nulls differently in sort
    /// Should work in sqlite 3.3 and above
    ///
    /// # Examples
    ///
    /// See tests, can be added as doc tests here if this is lib crate
    ///
    fn desc_nulls_first(self) -> DescNullsFirst<Self> {
        DescNullsFirst::new(self)
    }
}

impl<T> OrderByExtensions for T where T: Expression {}

#[cfg(test)]
mod tests {
    use diesel::{debug_query, sqlite::Sqlite, QueryDsl};

    use crate::diesel_extensions::OrderByExtensions;

    table! {
        item (id) {
            id -> Text,
            name -> Text,
            expiry_date -> Nullable<Date>,
        }
    }

    #[test]
    fn asc_nulls_first_test() {
        let query = item::dsl::item.order(item::dsl::name.asc_nulls_first());
        let sql = debug_query::<Sqlite, _>(&query).to_string();
        assert_eq!(
            sql,
            r#"SELECT `item`.`id`, `item`.`name`, `item`.`expiry_date` FROM `item` ORDER BY `item`.`name` ASC NULLS FIRST -- binds: []"#
        );
    }

    #[test]
    fn desc_nulls_last_test() {
        let query = item::dsl::item.order(item::dsl::name.desc_nulls_last());
        let sql = debug_query::<Sqlite, _>(&query).to_string();
        assert_eq!(
            sql,
            r#"SELECT `item`.`id`, `item`.`name`, `item`.`expiry_date` FROM `item` ORDER BY `item`.`name` DESC NULLS LAST -- binds: []"#
        );
    }

    #[test]
    fn asc_nulls_last_test() {
        let query = item::dsl::item.order(item::dsl::expiry_date.asc_nulls_last());
        let sql = debug_query::<Sqlite, _>(&query).to_string();
        assert_eq!(
            sql,
            r#"SELECT `item`.`id`, `item`.`name`, `item`.`expiry_date` FROM `item` ORDER BY `item`.`expiry_date` ASC NULLS LAST -- binds: []"#
        );
    }

    #[test]
    fn desc_nulls_first_test() {
        let query = item::dsl::item.order(item::dsl::expiry_date.desc_nulls_first());
        let sql = debug_query::<Sqlite, _>(&query).to_string();
        assert_eq!(
            sql,
            r#"SELECT `item`.`id`, `item`.`name`, `item`.`expiry_date` FROM `item` ORDER BY `item`.`expiry_date` DESC NULLS FIRST -- binds: []"#
        );
    }

    #[test]
    fn desc_no_case_test() {
        let query = item::dsl::item.order(item::dsl::name.desc_no_case());
        let sql = debug_query::<Sqlite, _>(&query).to_string();
        assert_eq!(
            sql,
            r#"SELECT `item`.`id`, `item`.`name`, `item`.`expiry_date` FROM `item` ORDER BY `item`.`name` COLLATE NOCASE DESC NULLS LAST -- binds: []"#
        );
    }

    #[test]
    fn asc_no_case_test() {
        let query = item::dsl::item.order(item::dsl::name.asc_no_case());
        let sql = debug_query::<Sqlite, _>(&query).to_string();
        assert_eq!(
            sql,
            r#"SELECT `item`.`id`, `item`.`name`, `item`.`expiry_date` FROM `item` ORDER BY `item`.`name` COLLATE NOCASE ASC NULLS FIRST -- binds: []"#
        );
    }
}
