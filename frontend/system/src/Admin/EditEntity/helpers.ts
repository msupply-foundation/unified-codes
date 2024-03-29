import { UpsertEntityInput } from '@common/types';
import {
  ActiveIngredients,
  ConsumableInput,
  DrugInput,
  Entity,
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

  entity.alternativeNames?.forEach(n => codes.push(n.code));

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
    alternativeNames: entity.alternativeNames.map(mapAltName),
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
                                  packSizes:
                                    immPack.children
                                      ?.filter(
                                        packSize =>
                                          packSize.type === EntityType.PackSize
                                      )
                                      .map(packSize => getDetails(packSize)) ||
                                    [],
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
  const entityDetails = (e: Entity) => ({
    code: e.code,
    name: e.name,
    category: EntityCategory.Drug,
    properties: e.properties?.map(mapProperty),
  });

  return {
    parentCode: '933f3f00', // Drug parent code
    ...entityDetails(drug),
    description: drug.name,
    type: EntityType.Product,
    alternativeNames: drug.alternativeNames.map(({ name, code }) => ({
      name,
      code: code ?? '',
    })),
    children: drug.routes?.map(route => ({
      ...entityDetails(route),
      description: `${drug.name} ${route.name}`,
      type: EntityType.Route,
      children: route.forms?.map(form => ({
        ...entityDetails(form),
        description: `${drug.name} ${route.name} ${form.name}`,
        type: EntityType.Form,
        children: form.strengths?.map(strength => ({
          ...entityDetails(strength),
          description: `${drug.name} ${route.name} ${form.name} ${strength.name}`,
          type: EntityType.Strength,
          children: strength.units?.map(unit => ({
            ...entityDetails(unit),
            description: `${drug.name} ${route.name} ${form.name} ${strength.name} ${unit.name}`,
            type: EntityType.Unit,
            children: unit.immediatePackagings?.map(immPack => ({
              ...entityDetails(immPack),
              description: `${drug.name} ${route.name} ${form.name} ${strength.name} ${unit.name} ${immPack.name}`,
              type: EntityType.ImmediatePackaging,
              children: immPack.packSizes?.map(packSize => ({
                ...entityDetails(packSize),
                description: `${drug.name} ${route.name} ${form.name} ${strength.name} ${unit.name} ${immPack.name} ${packSize.name}`,
                type: EntityType.PackSize,
              })),
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
  const getActiveIngredients = (entity: EntityDetails) =>
    entity.children
      ?.filter(ingred => ingred.type === EntityType.ActiveIngredients)
      .map(ingred => ({
        ...getDetails(ingred),
        brands:
          ingred.children
            ?.filter(brand => brand.type === EntityType.Brand)
            .map(brand => ({
              ...getDetails(brand),
              strengths:
                brand.children
                  ?.filter(strength => strength.type === EntityType.Strength)
                  .map(strength => ({
                    ...getDetails(strength),
                    units:
                      strength.children
                        ?.filter(unit => unit.type === EntityType.Unit)
                        .map(unit => ({
                          ...getDetails(unit),
                          immediatePackagings:
                            unit.children
                              ?.filter(
                                immPack =>
                                  immPack.type === EntityType.ImmediatePackaging
                              )
                              .map(immPack => ({
                                ...getDetails(immPack),
                                packSizes:
                                  immPack.children
                                    ?.filter(
                                      packSize =>
                                        packSize.type === EntityType.PackSize
                                    )
                                    .map(packSize => getDetails(packSize)) ||
                                  [],
                              })) || [],
                        })) || [],
                  })) || [],
            })) || [],
      })) || [];

  return {
    ...getDetails(entity),
    alternativeNames: entity.alternativeNames.map(mapAltName),
    routes:
      entity.children
        ?.filter(route => route.type === EntityType.Route)
        .map(route => ({
          ...getDetails(route),
          forms:
            route.children
              ?.filter(form => form.type === EntityType.Form)
              .map(form => ({
                ...getDetails(form),
                activeIngredients: getActiveIngredients(form),
                details:
                  form.children
                    ?.filter(
                      details => details.type === EntityType.VaccineNameDetails
                    )
                    .map(details => ({
                      ...getDetails(details),
                      activeIngredients: getActiveIngredients(details),
                    })) || [],
              })) || [],
        })) || [],
  };
};

export const buildEntityFromVaccineInput = (
  vaccine: VaccineInput
): UpsertEntityInput => {
  const entityDetails = (ent: Entity, description: string) => ({
    code: ent.code,
    name: ent.name,
    description: `${description} ${ent.name}`.trim(),
    category: EntityCategory.Vaccine,
    properties: ent.properties?.map(mapProperty),
  });

  const mapActiveIngredient = (
    activeIngredients: ActiveIngredients,
    description: string
  ) => {
    const ingrDetails = entityDetails(activeIngredients, description);
    return {
      ...ingrDetails,
      type: EntityType.ActiveIngredients,
      children: activeIngredients.brands?.map(brand => {
        const brandDetails = entityDetails(brand, ingrDetails.description);
        return {
          ...brandDetails,
          type: EntityType.Brand,
          children: brand.strengths?.map(strength => {
            const strengthDetails = entityDetails(
              strength,
              brandDetails.description
            );
            return {
              ...strengthDetails,
              type: EntityType.Strength,
              children: strength.units?.map(unit => {
                const unitDetails = entityDetails(
                  unit,
                  strengthDetails.description
                );
                return {
                  ...unitDetails,
                  type: EntityType.Unit,
                  children: unit.immediatePackagings?.map(immPack => {
                    const immPackDetails = entityDetails(
                      immPack,
                      unitDetails.description
                    );
                    return {
                      ...immPackDetails,
                      type: EntityType.ImmediatePackaging,
                      children: immPack.packSizes?.map(packSize => ({
                        ...entityDetails(packSize, immPackDetails.description),
                        type: EntityType.PackSize,
                      })),
                    };
                  }),
                };
              }),
            };
          }),
        };
      }),
    };
  };
  const vaccDetails = entityDetails(vaccine, '');
  return {
    ...vaccDetails,
    parentCode: '5048e0ad', // Vaccine parent code
    type: EntityType.Product,
    alternativeNames: vaccine.alternativeNames.map(n => ({
      name: n.name,
      code: n.code ?? '',
    })),
    children: vaccine.routes?.map(route => {
      const routeDetails = entityDetails(route, vaccDetails.description);
      return {
        ...routeDetails,
        type: EntityType.Route,
        children: route.forms?.map(form => {
          const formDeets = entityDetails(form, routeDetails.description);
          return {
            ...formDeets,
            type: EntityType.Form,
            children: [
              ...form.activeIngredients?.map(c =>
                mapActiveIngredient(c, formDeets.description)
              ),
              ...form.details?.map(details => {
                const detailDetails = entityDetails(
                  details,
                  formDeets.description
                );
                return {
                  ...detailDetails,
                  type: EntityType.VaccineNameDetails,
                  children: details.activeIngredients?.map(c =>
                    mapActiveIngredient(c, detailDetails.description)
                  ),
                };
              }),
            ],
          };
        }),
      };
    }),
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
                packSizes:
                  description.children
                    ?.filter(packSize => packSize.type === EntityType.PackSize)
                    .map(packSize => getDetails(packSize)) || [],
              })) || [],
          packSizes:
            pres.children
              ?.filter(packSize => packSize.type === EntityType.PackSize)
              .map(packSize => ({
                ...getDetails(packSize),
              })) || [],
        })) || [],
    extraDescriptions:
      entity.children
        ?.filter(
          description => description.type === EntityType.ExtraDescription
        )
        .map(description => ({
          ...getDetails(description),
          packSizes:
            description.children
              ?.filter(packSize => packSize.type === EntityType.PackSize)
              .map(packSize => getDetails(packSize)) || [],
        })) || [],
    alternativeNames: entity.alternativeNames.map(mapAltName),
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
    alternativeNames: consumable.alternativeNames.map(n => ({
      name: n.name,
      code: n.code ?? '',
    })),
    children: [
      // Presentations
      ...consumable.presentations.map(pres => ({
        code: pres.code,
        name: pres.name,
        description: `${consumable.name} ${pres.name}`,
        type: EntityType.Presentation,
        category: EntityCategory.Consumable,
        properties: pres.properties?.map(mapProperty),
        children: [
          ...pres.extraDescriptions?.map(description => ({
            code: description.code,
            name: description.name,
            description: `${consumable.name} ${pres.name} ${description.name}`,
            type: EntityType.ExtraDescription,
            category: EntityCategory.Consumable,
            properties: description.properties?.map(mapProperty),
            children: description.packSizes?.map(packSize => ({
              code: packSize.code,
              name: packSize.name,
              description: `${consumable.name} ${pres.name} ${description.name} ${packSize.name}`,
              type: EntityType.PackSize,
              category: EntityCategory.Consumable,
              properties: packSize.properties?.map(mapProperty),
            })),
          })),
          ...pres.packSizes?.map(packSize => ({
            code: packSize.code,
            name: packSize.name,
            description: `${consumable.name} ${pres.name} ${packSize.name}`,
            type: EntityType.PackSize,
            category: EntityCategory.Consumable,
            properties: packSize.properties?.map(mapProperty),
          })),
        ],
      })),
      // Extra Descriptions
      ...consumable.extraDescriptions.map(description => ({
        code: description.code,
        name: description.name,
        description: `${consumable.name} ${description.name}`,
        type: EntityType.ExtraDescription,
        category: EntityCategory.Consumable,
        properties: description.properties?.map(mapProperty),
        children: description.packSizes?.map(packSize => ({
          code: packSize.code,
          name: packSize.name,
          description: `${consumable.name} ${description.name} ${packSize.name}`,
          type: EntityType.PackSize,
          category: EntityCategory.Consumable,
          properties: packSize.properties?.map(mapProperty),
        })),
      })),
    ],
  };
};

const mapProperty = (p: Property) => ({
  code: p.code,
  key: p.type,
  value: p.value,
});

const mapAltName = (n: { code: string; name: string }) => ({
  id: n.name + n.code, // add ID field so react knows which node to update
  code: n.code,
  name: n.name,
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

const hasDuplicates = (entities: Entity[]) => {
  const entityNames = entities.map(e => e.name);
  return entityNames.some((name, idx) => entityNames.indexOf(name) !== idx);
};

export const isValidDrugInput = (input: DrugInput) => {
  if (!input.name) return false;

  if (hasDuplicates(input.alternativeNames)) return false;
  for (const altName of input.alternativeNames || []) {
    if (!altName.name) return false;
  }

  if (hasDuplicates(input.routes)) return false;
  for (const route of input.routes || []) {
    if (!route.name) return false;
    if (hasDuplicates(route.forms)) return false;
    for (const form of route.forms || []) {
      if (!form.name) return false;
      if (hasDuplicates(form.strengths)) return false;
      for (const strength of form.strengths || []) {
        if (!strength.name) return false;
        if (hasDuplicates(strength.units)) return false;
        for (const unit of strength.units || []) {
          if (!unit.name) return false;
          if (hasDuplicates(unit.immediatePackagings)) return false;
          for (const immPack of unit.immediatePackagings || []) {
            if (!immPack.name) return false;
            if (hasDuplicates(immPack.packSizes)) return false;
            for (const packSize of immPack.packSizes || []) {
              if (!packSize.name) return false;
            }
          }
        }
      }
    }
  }

  return true;
};

export const isValidVaccineInput = (input: VaccineInput) => {
  if (!input.name) return false;

  const activeIngredientsIsValid = (ingred: ActiveIngredients) => {
    if (!ingred.name) return false;
    if (hasDuplicates(ingred.brands)) return false;
    for (const brand of ingred.brands || []) {
      if (!brand.name) return false;
      if (hasDuplicates(brand.strengths)) return false;
      for (const strength of brand.strengths || []) {
        if (!strength.name) return false;
        if (hasDuplicates(strength.units)) return false;
        for (const unit of strength.units || []) {
          if (!unit.name) return false;
          if (hasDuplicates(unit.immediatePackagings)) return false;
          for (const immPack of unit.immediatePackagings || []) {
            if (!immPack.name) return false;
            if (hasDuplicates(immPack.packSizes)) return false;
            for (const size of immPack.packSizes || []) {
              if (!size.name) return false;
            }
          }
        }
      }
    }
    return true;
  };

  if (hasDuplicates(input.alternativeNames)) return false;
  for (const altName of input.alternativeNames || []) {
    if (!altName.name) return false;
  }

  if (hasDuplicates(input.routes)) return false;
  for (const route of input.routes || []) {
    if (!route.name) return false;
    if (hasDuplicates(route.forms)) return false;
    for (const form of route.forms || []) {
      if (!form.name) return false;
      if (hasDuplicates(form.activeIngredients)) return false;
      for (const ingred of form.activeIngredients || []) {
        if (!activeIngredientsIsValid(ingred)) return false;
      }
      if (hasDuplicates(form.details)) return false;
      for (const detail of form.details || []) {
        if (!detail.name) return false;
        if (hasDuplicates(detail.activeIngredients)) return false;
        for (const ingredient of detail.activeIngredients || []) {
          if (!activeIngredientsIsValid(ingredient)) return false;
        }
      }
    }
  }

  return true;
};

export const isValidConsumableInput = (input: ConsumableInput) => {
  if (!input.name) return false;

  if (hasDuplicates(input.alternativeNames)) return false;
  for (const altName of input.alternativeNames || []) {
    if (!altName.name) return false;
  }

  if (hasDuplicates(input.presentations)) return false;
  for (const presentation of input.presentations || []) {
    if (!presentation.name) return false;
    if (hasDuplicates(presentation.extraDescriptions)) return false;
    for (const description of presentation.extraDescriptions || []) {
      if (!description.name) return false;
    }
  }
  if (hasDuplicates(input.extraDescriptions)) return false;
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
    alternativeNames: input.alternativeNames || [],
    barcodes: [],
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
