use async_graphql::*;

#[derive(Clone, Debug, PartialEq)]
pub struct AlternativeNameType {
    pub code: String,
    pub name: String,
}

#[Object]
impl AlternativeNameType {
    pub async fn code(&self) -> &str {
        &self.code
    }

    pub async fn name(&self) -> &str {
        &self.name
    }

    pub async fn r#type(&self) -> &str {
        "alternative_name"
    }
}

impl AlternativeNameType {
    pub fn from_domain(names: String) -> Vec<AlternativeNameType> {
        names
            .split(",")
            .map(|name| AlternativeNameType {
                code: name.to_string(),
                name: name.to_string(),
            })
            .collect()
    }
}

#[cfg(test)]
mod test {
    use super::AlternativeNameType;

    #[test]
    fn alt_name_type_from_domain_maps_names() {
        let alt_names = "test_1,test_2".to_string();

        let res = AlternativeNameType::from_domain(alt_names);

        assert_eq!(
            res,
            vec![
                AlternativeNameType {
                    code: "test_1".to_string(),
                    name: "test_1".to_string(),
                },
                AlternativeNameType {
                    code: "test_2".to_string(),
                    name: "test_2".to_string(),
                },
            ]
        );
    }
}
