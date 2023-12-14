use async_graphql::*;
use dgraph::Entity;

use super::DrugInteractionType;
use super::PropertiesType;

#[derive(Clone, Debug)]
pub struct EntityType {
    pub id: String,
    pub code: String,
    pub description: String,
    pub r#type: String,
    pub properties: Vec<PropertiesType>,
    pub children: Vec<EntityType>,
    pub parents: Vec<EntityType>,
}

impl EntityType {
    pub fn from_domain(entity: Entity) -> EntityType {
        EntityType {
            id: entity.id,
            code: entity.code,
            description: entity.description,
            r#type: entity.r#type,
            properties: PropertiesType::from_domain(entity.properties),
            children: entity
                .children
                .iter()
                .map(|c| EntityType::from_domain(c.clone()))
                .collect(),
            parents: entity
                .parents
                .iter()
                .map(|c| EntityType::from_domain(c.clone()))
                .collect(),
        }
    }
}

#[Object]
impl EntityType {
    pub async fn uid(&self) -> &str {
        &self.id
    }
    pub async fn code(&self) -> &str {
        &self.code
    }
    pub async fn description(&self) -> &str {
        &self.description
    }
    pub async fn r#type(&self) -> &str {
        get_type_for_entity(&self)
    }

    pub async fn properties(&self) -> &Vec<PropertiesType> {
        &self.properties
    }

    pub async fn children(&self) -> &Vec<EntityType> {
        &self.children
    }

    pub async fn product(&self) -> Option<EntityType> {
        // TODO: Probably a loader? Implement Product Lookup
        None
    }

    pub async fn parents(&self) -> &Vec<EntityType> {
        // TODO: Right now this only get's the parent one up...
        &self.parents
    }

    pub async fn interactions(&self) -> Option<Vec<DrugInteractionType>> {
        // TODO: Probably a loader? Implement Drug Interaction Lookup
        None
    }
}

/*
type EntityCollectionType {
  data: [EntityType!]!
  totalLength: Int!
}
*/
#[derive(Debug, SimpleObject)]
pub struct EntityCollectionType {
    pub data: Vec<EntityType>,
    pub total_length: i32,
}

/*
 Graphql V2 (Dgraph) Types:
 Root = 'Root',
 Category = 'Category',
 Product = 'Product',
 Route = 'Route',
 Form = 'Form',
 FormQualifier = 'FormQualifier',
 DoseStrength = 'DoseStrength',
 Unit = 'Unit',
 PackImmediate = 'PackImmediate',
 PackSize = 'PackSize',
 PackOuter = 'PackOuter',
 Manufacturer = 'Manufacturer',
 Brand = 'Brand',

GraphQL V1 (old) Types:
DRUG = 'drug',
FORM_CATEGORY = 'form_category',
FORM = 'form',
FORM_QUALIFIER = 'form_qualifier',
UNIT_OF_USE = 'unit_of_use',
STRENGTH = 'strength',
PACK_IMMEDIATE = 'PackImmediate',

New types need to be mapped to old types where a mapping exists.
Logic referenced from old data-service (typescript) - https://github.com/msupply-foundation/unified-codes/blob/276158a1aa13ec911610ff3759ae7cf8b527d19c/data-service/src/v1/types/DgraphDataSource.ts#L200

*/
fn get_type_for_entity(entity: &EntityType) -> &str {
    match entity.r#type.as_str() {
        "Product" => match entity.parents.first() {
            Some(parent) => {
                if parent.description == "Drug" {
                    return "drug";
                }
                if parent.description == "Consumable" {
                    return "consumable";
                }
                if parent.description == "Other" {
                    return "other";
                }
                return &entity.r#type;
            }
            None => {
                return "Category"; // Must be querying a category node, since there's no parent?
            }
        },
        "Route" => return "form_category",
        "Form" => return "form",
        "FormQualifier" => return "form_qualifier",
        "DoseStrength" => return "strength",
        "Unit" => return "unit_of_use",
        _ => return &entity.r#type,
    }
}

#[cfg(test)]
mod test {
    use dgraph::Entity;

    use super::{get_type_for_entity, EntityType};

    #[test]
    fn test_get_type_for_entity() {
        // 1. Test a Drug
        let entity = Entity {
            id: "0x1".to_string(),
            code: "c7750265".to_string(),
            description: "Abacavir".to_string(),
            r#type: "Product".to_string(),
            properties: vec![],
            children: vec![],
            parents: vec![Entity {
                id: "0x2".to_string(),
                code: "933f3f00".to_string(),
                description: "Drug".to_string(),
                r#type: "Category".to_string(),
                properties: vec![],
                children: vec![],
                parents: vec![],
            }],
        };
        let entity_type = EntityType::from_domain(entity);

        let t = get_type_for_entity(&entity_type);
        assert_eq!(t, "drug");

        // 2. Test a Consumable
        let entity = Entity {
            id: "0x1".to_string(),
            code: "af482fa09".to_string(),
            description: "Biohazard Spill Kit".to_string(),
            r#type: "Product".to_string(),
            properties: vec![],
            children: vec![],
            parents: vec![Entity {
                id: "0x2".to_string(),
                code: "77fcbb00".to_string(),
                description: "Consumable".to_string(),
                r#type: "Category".to_string(),
                properties: vec![],
                children: vec![],
                parents: vec![],
            }],
        };
        let entity_type = EntityType::from_domain(entity);

        let t = get_type_for_entity(&entity_type);
        assert_eq!(t, "consumable");

        // 3. Test a Route = Form Category
        let entity = Entity {
            id: "0x2".to_string(),
            code: "b49ec300".to_string(),
            description: "Abacavir Oral".to_string(),
            r#type: "Route".to_string(),
            properties: vec![],
            children: vec![],
            parents: vec![Entity {
                id: "0x1".to_string(),
                code: "c7750265".to_string(),
                description: "Abacavir".to_string(),
                r#type: "Product".to_string(),
                properties: vec![],
                children: vec![],
                parents: vec![],
            }],
        };
        let entity_type = EntityType::from_domain(entity);

        let t = get_type_for_entity(&entity_type);
        assert_eq!(t, "form_category");

        // 4. Test DoseStrength = strength
        let entity = Entity {
            id: "0x3".to_string(),
            code: "db3d2000".to_string(),
            description: "Abacavir Oral Solution 20mg per mL".to_string(),
            r#type: "DoseStrength".to_string(),
            properties: vec![],
            children: vec![],
            parents: vec![Entity {
                id: "0x2".to_string(),
                code: "b49ec300".to_string(),
                description: "Abacavir Oral".to_string(),
                r#type: "Route".to_string(),
                properties: vec![],
                children: vec![],
                parents: vec![Entity {
                    id: "0x1".to_string(),
                    code: "c7750265".to_string(),
                    description: "Abacavir".to_string(),
                    r#type: "Product".to_string(),
                    properties: vec![],
                    children: vec![],
                    parents: vec![],
                }],
            }],
        };

        assert_eq!(
            get_type_for_entity(&EntityType::from_domain(entity)),
            "strength"
        );

        // 4. Test Unit = unit_of_use

        let entity = Entity {
            id: "0x4".to_string(),
            code: "358b04bf".to_string(),
            description: "Abacavir Oral Solution 20mg per mL 240mL".to_string(),
            r#type: "Unit".to_string(),
            properties: vec![],
            children: vec![],
            parents: vec![Entity {
                id: "0x3".to_string(),
                code: "db3d2000".to_string(),
                description: "Abacavir Oral Solution 20mg per mL".to_string(),
                r#type: "DoseStrength".to_string(),
                properties: vec![],
                children: vec![],
                parents: vec![Entity {
                    id: "0x2".to_string(),
                    code: "b49ec300".to_string(),
                    description: "Abacavir Oral".to_string(),
                    r#type: "Route".to_string(),
                    properties: vec![],
                    children: vec![],
                    parents: vec![Entity {
                        id: "0x1".to_string(),
                        code: "c7750265".to_string(),
                        description: "Abacavir".to_string(),
                        r#type: "Product".to_string(),
                        properties: vec![],
                        children: vec![],
                        parents: vec![],
                    }],
                }],
            }],
        };
        assert_eq!(
            get_type_for_entity(&EntityType::from_domain(entity)),
            "unit_of_use"
        );
    }
}
