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

const getDetails = (entity: EntityDetails) => ({
  id: entity.code,
  name: entity.name,
  properties: entity.properties.map(p => ({
    ...p,
    id: `${entity.code}_${p.type}`,
  })),
});
