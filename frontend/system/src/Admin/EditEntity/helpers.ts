import { UpsertEntityInput } from '@common/types';
import {
  ConsumableInput,
  DrugInput,
  EntityDetails,
  Property,
  VaccineInput,
} from './types';
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

  return codes.filter(c => c !== '');
};

export const buildDrugInputFromEntity = (entity: EntityDetails): DrugInput => {
  return {
    ...getDetails(entity),
    routes:
      entity.children
        ?.filter(route => route.type === EntityType.Route)
        .map(route => ({
          ...getDetails(route),
          forms:
            route.children
              ?.filter(route => route.type === EntityType.Form)
              .map(form => ({
                ...getDetails(form),
                strengths:
                  form.children
                    ?.filter(route => route.type === EntityType.Strength)
                    .map(strength => ({
                      ...getDetails(strength),
                      units:
                        strength.children
                          ?.filter(route => route.type === EntityType.Unit)
                          .map(unit => ({
                            ...getDetails(unit),
                            immediatePackagings:
                              unit.children
                                ?.filter(
                                  route =>
                                    route.type === EntityType.ImmediatePackaging
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
    properties: drug.properties?.map(mapProperty),
    children: drug.routes?.map(route => ({
      code: route.code,
      name: route.name,
      description: `${drug.name} ${route.name}`,
      type: EntityType.Route,
      category: EntityCategory.Drug,
      properties: route.properties?.map(mapProperty),
      children: route.forms?.map(form => ({
        code: form.code,
        name: form.name,
        description: `${drug.name} ${route.name} ${form.name}`,
        type: EntityType.Form,
        category: EntityCategory.Drug,
        properties: form.properties?.map(mapProperty),
        children: form.strengths?.map(strength => ({
          code: strength.code,
          name: strength.name,
          description: `${drug.name} ${route.name} ${form.name} ${strength.name}`,
          type: EntityType.Strength,
          category: EntityCategory.Drug,
          properties: strength.properties?.map(mapProperty),
          children: strength.units?.map(unit => ({
            code: unit.code,
            name: unit.name,
            description: `${drug.name} ${route.name} ${form.name} ${strength.name} ${unit.name}`,
            type: EntityType.Unit,
            category: EntityCategory.Drug,
            properties: unit.properties?.map(mapProperty),
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
    activeIngredients:
      entity.children
        ?.filter(ingred => ingred.type === EntityType.ActiveIngredients)
        .map(ingred => ({
          ...getDetails(ingred),
          brands:
            ingred.children
              ?.filter(brand => brand.type === EntityType.Brand)
              .map(brand => ({
                ...getDetails(brand),
                routes:
                  brand.children
                    ?.filter(route => route.type === EntityType.Route)
                    .map(route => ({
                      ...getDetails(route),
                      forms:
                        route.children
                          ?.filter(form => form.type === EntityType.Form)
                          .map(form => ({
                            ...getDetails(form),
                            strengths:
                              form.children
                                ?.filter(
                                  strength =>
                                    strength.type === EntityType.Strength
                                )
                                .map(strength => ({
                                  ...getDetails(strength),
                                  units:
                                    strength.children
                                      ?.filter(
                                        unit => unit.type === EntityType.Unit
                                      )
                                      .map(unit => ({
                                        ...getDetails(unit),
                                        immediatePackagings:
                                          unit.children
                                            ?.filter(
                                              immPack =>
                                                immPack.type ===
                                                EntityType.ImmediatePackaging
                                            )
                                            .map(unit => getDetails(unit)) ||
                                          [],
                                      })) || [],
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
    parentCode: '5048e0ad', // Vaccine parent code
    code: vaccine.code,
    name: vaccine.name,
    description: vaccine.name,
    type: EntityType.Product,
    category: EntityCategory.Vaccine,
    properties: vaccine.properties?.map(mapProperty),
    children: vaccine.activeIngredients?.map(ingred => ({
      code: ingred.code,
      name: ingred.name,
      description: `${vaccine.name} ${ingred.name}`,
      type: EntityType.ActiveIngredients,
      category: EntityCategory.Vaccine,
      properties: ingred.properties?.map(mapProperty),
      children: ingred.brands?.map(brand => ({
        code: brand.code,
        name: brand.name,
        description: `${vaccine.name} ${ingred.name} ${brand.name}`,
        type: EntityType.Brand,
        category: EntityCategory.Vaccine,
        properties: brand.properties?.map(mapProperty),
        children: brand.routes?.map(route => ({
          code: route.code,
          name: route.name,
          description: `${vaccine.name} ${ingred.name} ${brand.name} ${route.name}`,
          type: EntityType.Route,
          category: EntityCategory.Drug,
          properties: route.properties?.map(mapProperty),
          children: route.forms?.map(form => ({
            code: form.code,
            name: form.name,
            description: `${vaccine.name} ${ingred.name} ${brand.name} ${route.name} ${form.name}`,
            type: EntityType.Form,
            category: EntityCategory.Vaccine,
            properties: form.properties?.map(mapProperty),
            children: form.strengths?.map(strength => ({
              code: strength.code,
              name: strength.name,
              description: `${vaccine.name} ${ingred.name} ${brand.name} ${route.name} ${form.name} ${strength.name}`,
              type: EntityType.Strength,
              category: EntityCategory.Vaccine,
              properties: strength.properties?.map(mapProperty),
              children: strength.units?.map(unit => ({
                code: unit.code,
                name: unit.name,
                description: `${vaccine.name} ${ingred.name} ${brand.name} ${route.name} ${form.name} ${strength.name} ${unit.name}`,
                type: EntityType.Unit,
                category: EntityCategory.Vaccine,
                properties: unit.properties?.map(mapProperty),
                children: unit.immediatePackagings?.map(immPack => ({
                  code: immPack.code,
                  name: immPack.name,
                  description: `${vaccine.name} ${ingred.name} ${brand.name} ${route.name} ${form.name} ${strength.name} ${unit.name} ${immPack.name}`,
                  type: EntityType.ImmediatePackaging,
                  category: EntityCategory.Vaccine,
                  properties: immPack.properties?.map(mapProperty),
                })),
              })),
            })),
          })),
        })),
      })),
    })),
  };
};

export const buildConsumableInputFromEntity = (
  entity: EntityDetails
): ConsumableInput => {
  return {
    ...getDetails(entity),
    presentations:
      entity.children
        ?.filter(pres => pres.type === EntityType.Presentation)
        .map(pres => ({
          ...getDetails(pres),
          extraDescriptions:
            pres.children
              ?.filter(
                description => description.type === EntityType.ExtraDescription
              )
              .map(description => ({
                ...getDetails(description),
              })) || [],
        })) || [],
    extraDescriptions:
      entity.children
        ?.filter(
          description => description.type === EntityType.ExtraDescription
        )
        .map(description => ({
          ...getDetails(description),
        })) || [],
  };
};

export const buildEntityFromConsumableInput = (
  consumable: ConsumableInput
): UpsertEntityInput => {
  return {
    parentCode: '77fcbb00', // Consumable parent code
    code: consumable.code,
    name: consumable.name,
    description: consumable.name,
    type: EntityType.Product,
    category: EntityCategory.Consumable,
    properties: consumable.properties?.map(mapProperty),
    children: [
      // Presentations
      ...consumable.presentations.map(pres => ({
        code: pres.code,
        name: pres.name,
        description: `${consumable.name} ${pres.name}`,
        type: EntityType.Presentation,
        category: EntityCategory.Consumable,
        properties: pres.properties?.map(mapProperty),
        children: pres.extraDescriptions?.map(description => ({
          code: description.code,
          name: description.name,
          description: `${consumable.name} ${pres.name} ${description.name}`,
          type: EntityType.ExtraDescription,
          category: EntityCategory.Consumable,
          properties: description.properties?.map(mapProperty),
        })),
      })),
      // Extra Descriptions
      ...consumable.extraDescriptions.map(description => ({
        code: description.code,
        name: description.name,
        description: `${consumable.name} ${description.name}`,
        type: EntityType.ExtraDescription,
        category: EntityCategory.Consumable,
        properties: description.properties?.map(mapProperty),
      })),
    ],
  };
};

const mapProperty = (p: Property) => ({
  code: p.code,
  key: p.type,
  value: p.value,
});

const getDetails = (entity: EntityDetails) => ({
  id: entity.code,
  code: entity.code !== '' ? entity.code : undefined,
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

  for (const ingred of input.activeIngredients || []) {
    if (!ingred.name) return false;
    for (const brand of ingred.brands || []) {
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

export const isValidConsumableInput = (input: ConsumableInput) => {
  if (!input.name) return false;

  for (const presentation of input.presentations || []) {
    if (!presentation.name) return false;
    for (const description of presentation.extraDescriptions || []) {
      if (!description.name) return false;
    }
  }
  for (const description of input.extraDescriptions || []) {
    if (!description.name) return false;
  }

  return true;
};

export const buildEntityDetailsFromPendingChangeBody = (
  input: UpsertEntityInput
): EntityDetails => {
  return {
    code: input.code || '',
    name: input.name || '',
    type: input.type || '',
    properties:
      input.properties?.map(p => ({
        code: p.code,
        value: p.value,
        type: p.key,
      })) || [],
    children:
      input.children?.map(buildEntityDetailsFromPendingChangeBody) || [],
  };
};
