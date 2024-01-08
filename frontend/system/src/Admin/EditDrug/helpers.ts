import { UpsertEntityInput } from '@common/types';
import { DrugInput, EntityDetails, VaccineInput } from './types';
import { EntityCategory, EntityType } from '../../constants';

export const getAllEntityCodes = (
  entity: EntityDetails | undefined
): string[] => {
  if (!entity) return [];

  const codes = [entity.code];

  const addChildCodes = (e: EntityDetails) =>
    e.children?.forEach(c => {
      codes.push(c.code);
      addChildCodes(c);
    });

  addChildCodes(entity);

  return codes;
};

export const buildDrugInputFromEntity = (entity: EntityDetails): DrugInput => {
  return {
    ...getDetails(entity),
    routes:
      entity.children
        ?.filter(route => route.type === 'form_category') // form_category === route
        .map(route => ({
          ...getDetails(route),
          forms:
            route.children
              ?.filter(route => route.type === 'form')
              .map(form => ({
                ...getDetails(form),
                strengths:
                  form.children
                    ?.filter(route => route.type === 'strength')
                    .map(strength => ({
                      ...getDetails(strength),
                      units:
                        strength.children
                          ?.filter(route => route.type === 'unit_of_use')
                          .map(unit => ({
                            ...getDetails(unit),
                            immediatePackagings:
                              unit.children
                                ?.filter(
                                  route => route.type === 'PackImmediate'
                                )
                                .map(immPack => ({
                                  ...getDetails(immPack),
                                })) || [],
                          })) || [],
                    })) || [],
              })) || [],
        })) || [],
  };
};

export const buildEntityFromDrugInput = (
  drug: DrugInput
): UpsertEntityInput => {
  return {
    parentCode: '933f3f00', // Drug parent code
    code: drug.code,
    name: drug.name,
    description: drug.name,
    type: EntityType.Product,
    category: EntityCategory.Drug,
    properties: drug.properties?.map(p => ({
      code: p.id,
      key: p.type,
      value: p.value,
    })),
    children: drug.routes?.map(route => ({
      code: route.code,
      name: route.name,
      description: `${drug.name} ${route.name}`,
      type: EntityType.Route,
      category: EntityCategory.Drug,
      properties: route.properties?.map(p => ({
        code: p.id,
        key: p.type,
        value: p.value,
      })),
      children: route.forms?.map(form => ({
        code: form.code,
        name: form.name,
        description: `${drug.name} ${route.name} ${form.name}`,
        type: EntityType.Form,
        category: EntityCategory.Drug,
        properties: form.properties?.map(p => ({
          code: p.id,
          key: p.type,
          value: p.value,
        })),
        children: form.strengths?.map(strength => ({
          code: strength.code,
          name: strength.name,
          description: `${drug.name} ${route.name} ${form.name} ${strength.name}`,
          type: EntityType.Strength,
          category: EntityCategory.Drug,
          properties: strength.properties?.map(p => ({
            code: p.id,
            key: p.type,
            value: p.value,
          })),
          children: strength.units?.map(unit => ({
            code: unit.code,
            name: unit.name,
            description: `${drug.name} ${route.name} ${form.name} ${strength.name} ${unit.name}`,
            type: EntityType.Unit,
            category: EntityCategory.Drug,
            properties: unit.properties?.map(p => ({
              code: p.id,
              key: p.type,
              value: p.value,
            })),
          })),
        })),
      })),
    })),
  };
};

export const buildVaccineInputFromEntity = (
  entity: EntityDetails
): VaccineInput => {
  return {
    ...getDetails(entity),
    components:
      entity.children
        ?.filter(component => component.type === 'component')
        .map(component => ({
          ...getDetails(component),
          brands:
            component.children
              ?.filter(brand => brand.type === 'brand')
              .map(brand => ({
                ...getDetails(brand),
                routes:
                  brand.children
                    ?.filter(route => route.type === 'form_category') // form_category === route
                    .map(route => ({
                      ...getDetails(route),
                      forms:
                        route.children
                          ?.filter(route => route.type === 'form')
                          .map(form => ({
                            ...getDetails(form),
                            strengths:
                              form.children
                                ?.filter(route => route.type === 'strength')
                                .map(strength => ({
                                  ...getDetails(strength),
                                  units:
                                    strength.children
                                      ?.filter(
                                        route => route.type === 'unit_of_use'
                                      )
                                      .map(unit => getDetails(unit)) || [],
                                })) || [],
                          })) || [],
                    })) || [],
              })) || [],
        })) || [],
  };
};

export const buildEntityFromVaccineInput = (
  vaccine: VaccineInput
): UpsertEntityInput => {
  return {
    parentCode: 'vaccine', // TODO! Vaccine parent code!
    code: vaccine.code,
    name: vaccine.name,
    description: vaccine.name,
    type: EntityType.Product,
    category: EntityCategory.Vaccine,
    properties: vaccine.properties?.map(p => ({
      code: p.id,
      key: p.type,
      value: p.value,
    })),
    children: vaccine.components?.map(component => ({
      code: component.code,
      name: component.name,
      description: `${vaccine.name} ${component.name}`,
      type: EntityType.Component,
      category: EntityCategory.Vaccine,
      properties: component.properties?.map(p => ({
        code: p.id,
        key: p.type,
        value: p.value,
      })),
      children: component.brands?.map(brand => ({
        code: brand.code,
        name: brand.name,
        description: `${vaccine.name} ${component.name} ${brand.name}`,
        type: EntityType.Brand,
        category: EntityCategory.Vaccine,
        properties: brand.properties?.map(p => ({
          code: p.id,
          key: p.type,
          value: p.value,
        })),
        children: brand.routes?.map(route => ({
          code: route.code,
          name: route.name,
          description: `${vaccine.name} ${component.name} ${brand.name} ${route.name}`,
          type: EntityType.Route,
          category: EntityCategory.Drug,
          properties: route.properties?.map(p => ({
            code: p.id,
            key: p.type,
            value: p.value,
          })),
          children: route.forms?.map(form => ({
            code: form.code,
            name: form.name,
            description: `${vaccine.name} ${component.name} ${brand.name} ${route.name} ${form.name}`,
            type: EntityType.Form,
            category: EntityCategory.Vaccine,
            properties: form.properties?.map(p => ({
              code: p.id,
              key: p.type,
              value: p.value,
            })),
            children: form.strengths?.map(strength => ({
              code: strength.code,
              name: strength.name,
              description: `${vaccine.name} ${component.name} ${brand.name} ${route.name} ${form.name} ${strength.name}`,
              type: EntityType.Strength,
              category: EntityCategory.Vaccine,
              properties: strength.properties?.map(p => ({
                code: p.id,
                key: p.type,
                value: p.value,
              })),
              children: strength.units?.map(unit => ({
                code: unit.code,
                name: unit.name,
                description: `${vaccine.name} ${component.name} ${brand.name} ${route.name} ${form.name} ${strength.name} ${unit.name}`,
                type: EntityType.Unit,
                category: EntityCategory.Vaccine,
                properties: unit.properties?.map(p => ({
                  code: p.id,
                  key: p.type,
                  value: p.value,
                })),
              })),
            })),
          })),
        })),
      })),
    })),
  };
};

const getDetails = (entity: EntityDetails) => ({
  id: entity.code,
  code: entity.code,
  name: entity.name,
  properties: entity.properties.map(p => ({
    ...p,
    id: p.code,
  })),
});

export const isValidDrugInput = (input: DrugInput) => {
  if (!input.name) return false;

  for (const route of input.routes || []) {
    if (!route.name) return false;
    for (const form of route.forms || []) {
      if (!form.name) return false;
      for (const strength of form.strengths || []) {
        if (!strength.name) return false;
        for (const unit of strength.units || []) {
          if (!unit.name) return false;
        }
      }
    }
  }

  return true;
};

export const isValidVaccineInput = (input: VaccineInput) => {
  if (!input.name) return false;

  for (const component of input.components || []) {
    if (!component.name) return false;
    for (const brand of component.brands || []) {
      if (!brand.name) return false;
      for (const route of brand.routes || []) {
        if (!route.name) return false;
        for (const form of route.forms || []) {
          if (!form.name) return false;
          for (const strength of form.strengths || []) {
            if (!strength.name) return false;
            for (const unit of strength.units || []) {
              if (!unit.name) return false;
            }
          }
        }
      }
    }
  }

  return true;
};
