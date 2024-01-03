import { UpsertEntityInput } from '@common/types';
import { DrugInput, EntityDetails } from './types';

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
  // We'll update everything using a DEEP mutation.
  // Only new properties and/or entities will be added.
  // If we want to do updates, we'll need to change things a bit.
  return {
    code: '933f3f00', // Drug parent code TODO: Constant?
    children: [
      {
        code: drug.code,
        name: drug.name,
        description: drug.name,
        type: 'Product',
        category: 'Drug',
        properties: drug.properties?.map(p => ({
          key: p.type,
          value: p.value,
        })),
        children: drug.routes?.map(route => ({
          code: route.code,
          name: route.name,
          description: `${drug.name} ${route.name}`,
          type: 'form_category',
          category: 'Drug',
          properties: route.properties?.map(p => ({
            key: p.type,
            value: p.value,
          })),
          children: route.forms?.map(form => ({
            code: form.code,
            name: form.name,
            description: `${drug.name} ${route.name} ${form.name}`,
            type: 'form',
            category: 'Drug',
            properties: form.properties?.map(p => ({
              key: p.type,
              value: p.value,
            })),
            children: form.strengths?.map(strength => ({
              code: strength.code,
              name: strength.name,
              description: `${drug.name} ${route.name} ${form.name} ${strength.name}`,
              type: 'strength',
              category: 'Drug',
              properties: strength.properties?.map(p => ({
                key: p.type,
                value: p.value,
              })),
              children: strength.units?.map(unit => ({
                code: unit.code,
                name: unit.name,
                description: `${drug.name} ${route.name} ${form.name} ${strength.name} ${unit.name}`,
                type: 'unit_of_use',
                category: 'Drug',
                properties: unit.properties?.map(p => ({
                  key: p.type,
                  value: p.value,
                })),
              })),
            })),
          })),
        })),
      },
    ],
  };
};

const getDetails = (entity: EntityDetails) => ({
  id: entity.code,
  code: entity.code,
  name: entity.name,
  properties: entity.properties.map(p => ({
    ...p,
    id: `${entity.code}_${p.type}`,
  })),
});
