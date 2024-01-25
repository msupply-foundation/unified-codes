import { EntityType } from '../../constants';
import {
  buildConsumableInputFromEntity,
  buildDrugInputFromEntity,
  buildEntityFromConsumableInput,
  buildVaccineInputFromEntity,
  getAllEntityCodes,
  isValidConsumableInput,
  isValidDrugInput,
  isValidVaccineInput,
} from './helpers';
import { ConsumableInput, DrugInput, VaccineInput } from './types';

describe('getAllEntityCodes', () => {
  it('returns empty array when entity is not defined', () => {
    expect(getAllEntityCodes(undefined)).toMatchObject([]);
  });
  it('returns array of codes with empty strings filtered out', () => {
    const entityDetails = {
      code: '7c8c2b5b',
      name: 'Acetic Acid',
      type: 'drug',
      alternativeNames: [],
      properties: [],
      children: [
        {
          code: '6e5f7a00',
          name: 'Topical',
          type: 'Route',
          alternativeNames: [],
          properties: [],
          children: [
            {
              code: '',
              name: 'Solution',
              type: 'Form',
              alternativeNames: [],
              properties: [],
              children: [],
            },
          ],
        },
      ],
    };
    expect(getAllEntityCodes(entityDetails)).toMatchObject([
      '7c8c2b5b',
      '6e5f7a00',
    ]);
  });
  it('returns codes of entity and all its children', () => {
    const entityDetails = {
      code: '7c8c2b5b',
      name: 'Acetic Acid',
      type: 'drug',
      alternativeNames: [
        {
          name: 'Other name',
          code: 'some_alt_name_code',
        },
      ],
      properties: [],
      children: [
        {
          code: '6e5f7a00',
          name: 'Topical',
          type: 'Route',
          alternativeNames: [],
          properties: [],
          children: [
            {
              code: '66e85500',
              name: 'Solution',
              type: 'Form',
              alternativeNames: [],
              properties: [],
              children: [
                {
                  code: '36e874bf',
                  name: '2%',
                  type: 'DoseStrength',
                  alternativeNames: [],
                  properties: [],
                  children: [
                    {
                      code: 'e4edcb00',
                      name: '15mL',
                      type: 'Unit',
                      alternativeNames: [],
                      properties: [],
                    },
                  ],
                },
                {
                  code: '36e874bg',
                  name: '3%',
                  type: 'DoseStrength',
                  alternativeNames: [],
                  properties: [],
                  children: [
                    {
                      code: 'e4edcb01',
                      name: '15mL',
                      type: 'Unit',
                      alternativeNames: [],
                      properties: [],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    };

    const result = getAllEntityCodes(entityDetails);

    expect(result).toEqual([
      '7c8c2b5b',
      'some_alt_name_code',
      '6e5f7a00',
      '66e85500',
      '36e874bf',
      'e4edcb00',
      '36e874bg',
      'e4edcb01',
    ]);
  });
});

describe('buildDrugInputFromEntity', () => {
  it('builds input from entity details', () => {
    const entityDetails = {
      code: '7c8c2b5b',
      name: 'Acetic Acid',
      type: 'drug',
      alternativeNames: [
        {
          name: 'AltName',
          code: 'ABC123',
        },
      ],
      properties: [],
      children: [
        {
          code: '6e5f7a00',
          name: 'Topical',
          type: 'Route',
          alternativeNames: [],
          properties: [],
          children: [
            {
              code: '66e85500',
              name: 'Solution',
              type: 'Form',
              alternativeNames: [],
              properties: [],
              children: [
                {
                  code: '36e874bf',
                  name: '2%',
                  type: 'DoseStrength',
                  alternativeNames: [],
                  properties: [],
                  children: [
                    {
                      code: 'e4edcb00',
                      name: '15mL',
                      type: 'Unit',
                      alternativeNames: [],
                      properties: [],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    };

    const result = buildDrugInputFromEntity(entityDetails);

    expect(result).toEqual({
      id: '7c8c2b5b',
      code: '7c8c2b5b',
      name: 'Acetic Acid',
      alternativeNames: [
        {
          id: 'AltNameABC123',
          code: 'ABC123',
          name: 'AltName',
        },
      ],
      properties: [],
      routes: [
        {
          id: '6e5f7a00',
          code: '6e5f7a00',
          name: 'Topical',
          properties: [],
          forms: [
            {
              id: '66e85500',
              code: '66e85500',
              name: 'Solution',
              properties: [],
              strengths: [
                {
                  id: '36e874bf',
                  code: '36e874bf',
                  name: '2%',
                  properties: [],
                  units: [
                    {
                      id: 'e4edcb00',
                      code: 'e4edcb00',
                      name: '15mL',
                      properties: [],
                      immediatePackagings: [],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });
  });

  it('includes properties', () => {
    const entityDetails = {
      id: '7c8c2b5b',
      code: '7c8c2b5b',
      name: 'Acetic Acid',
      type: 'drug',
      alternativeNames: [],
      properties: [
        {
          id: '7c8c2b5b_who_eml',
          code: '7c8c2b5b_who_eml',
          type: 'who_eml',
          value: '28',
        },
        {
          id: '7c8c2b5b_code_unspsc',
          code: '7c8c2b5b_code_unspsc',
          type: 'code_unspsc',
          value: '51471602',
        },
      ],
      children: [
        {
          id: '6e5f7a00',
          code: '6e5f7a00',
          name: 'Topical',
          type: 'Route',
          alternativeNames: [],
          properties: [
            {
              id: '6e5f7a00_code_rxnav',
              code: '6e5f7a00_code_rxnav',
              type: 'code_rxnav',
              value: '168',
            },
          ],
          children: [],
        },
      ],
    };

    const result = buildDrugInputFromEntity(entityDetails);

    expect(result).toEqual({
      id: '7c8c2b5b',
      code: '7c8c2b5b',
      name: 'Acetic Acid',
      alternativeNames: [],
      properties: [
        {
          id: '7c8c2b5b_who_eml',
          code: '7c8c2b5b_who_eml',
          type: 'who_eml',
          value: '28',
        },
        {
          id: '7c8c2b5b_code_unspsc',
          code: '7c8c2b5b_code_unspsc',
          type: 'code_unspsc',
          value: '51471602',
        },
      ],
      routes: [
        {
          id: '6e5f7a00',
          code: '6e5f7a00',
          name: 'Topical',
          properties: [
            {
              id: '6e5f7a00_code_rxnav',
              code: '6e5f7a00_code_rxnav',
              type: 'code_rxnav',
              value: '168',
            },
          ],
          forms: [],
        },
      ],
    });
  });

  it.todo(
    'sensible result when a child is not at the expected level of the hierarchy'
  );
  // for now we'll just ignore nodes that show up at strange levels, until we decide whether/where we
  // support breaking the hierarchy structure
  it('only includes children in the result if they are for the correct level of the hierarchy', () => {
    const entityDetails = {
      code: '7c8c2b5b',
      name: 'Acetic Acid',
      type: 'drug',
      alternativeNames: [],
      properties: [],
      children: [
        {
          code: '6e5f7a00',
          name: 'Topical',
          type: 'Route',
          alternativeNames: [],
          properties: [],
          children: [
            {
              code: '66e85500',
              name: 'Solution',
              type: 'Form', // include: direct child of route
              alternativeNames: [],
              properties: [],
              children: [],
            },
            {
              code: 'e4edcb00',
              name: '15mL',
              type: 'Unit', // exclude: not a direct child of route
              alternativeNames: [],
              properties: [],
              children: [],
            },
          ],
        },
      ],
    };

    const result = buildDrugInputFromEntity(entityDetails);

    expect(result).toEqual({
      id: '7c8c2b5b',
      code: '7c8c2b5b',
      name: 'Acetic Acid',
      alternativeNames: [],
      properties: [],
      routes: [
        {
          id: '6e5f7a00',
          code: '6e5f7a00',
          name: 'Topical',
          properties: [],
          forms: [
            {
              id: '66e85500',
              code: '66e85500',
              name: 'Solution',
              properties: [],
              strengths: [],
            },
          ],
        },
      ],
    });
  });
});

describe('buildVaccineInputFromEntity', () => {
  it('builds input from entity details', () => {
    const entityDetails = {
      code: '7c8c2b5b',
      name: 'Some Vaccine',
      type: 'Vaccine',
      alternativeNames: [],
      properties: [],
      children: [
        {
          code: '6e5f7a00',
          name: 'Intramuscular',
          type: 'Route',
          alternativeNames: [],
          properties: [],
          children: [
            {
              code: '66e85500',
              name: 'Injection: suspension',
              type: 'Form',
              alternativeNames: [],
              properties: [
                {
                  id: '6e5f7a00_code_rxnav',
                  code: '6e5f7a00_code_rxnav',
                  type: 'code_rxnav',
                  value: '168',
                },
              ],
              children: [
                {
                  code: 'ae5f7a00',
                  name: '2021 Variant',
                  type: EntityType.VaccineNameDetails,
                  alternativeNames: [],
                  properties: [],
                  children: [
                    {
                      code: '7e5f7a02',
                      name: 'Component 1/Component 2',
                      type: EntityType.ActiveIngredients,
                      alternativeNames: [],
                      properties: [],
                      children: [
                        {
                          code: 'a6e85500',
                          name: 'Brand 2',
                          type: 'Brand',
                          alternativeNames: [],
                          properties: [],
                          children: [],
                        },
                      ],
                    },
                  ],
                },
                {
                  code: '7e5f7a00',
                  name: 'Component 1/Component 2',
                  type: EntityType.ActiveIngredients,
                  alternativeNames: [],
                  properties: [],
                  children: [
                    {
                      code: '86e85500',
                      name: 'Brand 1',
                      type: 'Brand',
                      alternativeNames: [],
                      properties: [],
                      children: [
                        {
                          code: '36e874bf',
                          name: '2 IU/1 IU',
                          type: 'DoseStrength',
                          alternativeNames: [],
                          properties: [],
                          children: [
                            {
                              code: 'e4edcb00',
                              name: '0.5mL',
                              type: 'Unit',
                              alternativeNames: [],
                              properties: [],
                              children: [
                                {
                                  code: 'x4edcb00',
                                  name: 'Ampoule',
                                  type: 'PackImmediate',
                                  alternativeNames: [],
                                  properties: [],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    };

    const result = buildVaccineInputFromEntity(entityDetails);

    expect(result).toEqual({
      id: '7c8c2b5b',
      code: '7c8c2b5b',
      name: 'Some Vaccine',
      alternativeNames: [],
      properties: [],
      routes: [
        {
          id: '6e5f7a00',
          code: '6e5f7a00',
          name: 'Intramuscular',
          properties: [],
          forms: [
            {
              id: '66e85500',
              code: '66e85500',
              name: 'Injection: suspension',
              properties: [
                {
                  id: '6e5f7a00_code_rxnav',
                  code: '6e5f7a00_code_rxnav',
                  type: 'code_rxnav',
                  value: '168',
                },
              ],
              details: [
                {
                  id: 'ae5f7a00',
                  code: 'ae5f7a00',
                  name: '2021 Variant',
                  properties: [],
                  activeIngredients: [
                    {
                      id: '7e5f7a02',
                      code: '7e5f7a02',
                      name: 'Component 1/Component 2',
                      properties: [],
                      brands: [
                        {
                          id: 'a6e85500',
                          code: 'a6e85500',
                          name: 'Brand 2',
                          properties: [],
                          strengths: [],
                        },
                      ],
                    },
                  ],
                },
              ],
              activeIngredients: [
                {
                  id: '7e5f7a00',
                  code: '7e5f7a00',
                  name: 'Component 1/Component 2',
                  properties: [],
                  brands: [
                    {
                      id: '86e85500',
                      code: '86e85500',
                      name: 'Brand 1',
                      properties: [],

                      strengths: [
                        {
                          id: '36e874bf',
                          code: '36e874bf',
                          name: '2 IU/1 IU',
                          properties: [],
                          units: [
                            {
                              id: 'e4edcb00',
                              code: 'e4edcb00',
                              name: '0.5mL',
                              properties: [],
                              immediatePackagings: [
                                {
                                  id: 'x4edcb00',
                                  code: 'x4edcb00',
                                  name: 'Ampoule',
                                  properties: [],
                                  packSizes: [],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    } as VaccineInput);
  });

  // TODO: decide on/update this:
  // for now we'll just ignore nodes that show up at strange levels, until we decide whether/where we
  // support breaking the hierarchy structure
  it('only includes children in the result if they are for the correct level of the hierarchy', () => {
    const entityDetails = {
      code: '7c8c2b5b',
      name: 'Some Vaccine',
      type: 'Vaccine',
      alternativeNames: [],
      properties: [],
      children: [
        {
          code: '6e5f7a00',
          name: 'Intramuscular',
          type: 'Route', // include: valid child
          alternativeNames: [],
          properties: [],
        },
        {
          code: 'e4edcb00',
          name: '0.5mL',
          type: 'Unit', // exclude: invalid (should be deeper in the tree)
          alternativeNames: [],
          properties: [],
        },
      ],
    };

    const result = buildVaccineInputFromEntity(entityDetails);

    expect(result).toEqual({
      id: '7c8c2b5b',
      code: '7c8c2b5b',
      name: 'Some Vaccine',
      properties: [],
      alternativeNames: [],
      routes: [
        {
          id: '6e5f7a00',
          code: '6e5f7a00',
          name: 'Intramuscular',
          properties: [],
          forms: [],
        },
      ],
    } as VaccineInput);
  });
});

describe('buildConsumableInputFromEntity', () => {
  it('builds input from entity details', () => {
    const entityDetails = {
      code: '7c8c2b5b',
      name: 'Examination Glove',
      type: 'Consumable',
      alternativeNames: [],
      properties: [],
      children: [
        {
          code: '7e5f7a00',
          name: 'Large',
          type: 'Presentation',
          alternativeNames: [],
          properties: [
            {
              id: '6e5f7a00_code_rxnav',
              code: '6e5f7a00_code_rxnav',
              type: 'code_rxnav',
              value: '168',
            },
          ],
          children: [
            {
              code: '86e85500',
              name: 'Pink',
              type: 'ExtraDescription',
              alternativeNames: [],
              properties: [],
              children: [],
            },
            {
              code: '76e85501',
              name: 'Black',
              type: 'ExtraDescription',
              alternativeNames: [],
              properties: [],
              children: [],
            },
          ],
        },
      ],
    };

    const result = buildConsumableInputFromEntity(entityDetails);

    expect(result).toEqual({
      id: '7c8c2b5b',
      code: '7c8c2b5b',
      name: 'Examination Glove',
      properties: [],
      presentations: [
        {
          id: '7e5f7a00',
          code: '7e5f7a00',
          name: 'Large',
          properties: [
            {
              id: '6e5f7a00_code_rxnav',
              code: '6e5f7a00_code_rxnav',
              type: 'code_rxnav',
              value: '168',
            },
          ],
          extraDescriptions: [
            {
              id: '86e85500',
              code: '86e85500',
              name: 'Pink',
              properties: [],
            },
            {
              id: '76e85501',
              code: '76e85501',
              name: 'Black',
              properties: [],
            },
          ],
        },
      ],
      extraDescriptions: [],
    });
  });
});

describe('buildEntityFromConsumableInput', () => {
  it('correctly builds entity', () => {
    const input: ConsumableInput = {
      id: '7c8c2b5b',
      code: '7c8c2b5b',
      name: 'Examination Glove',
      properties: [],
      alternativeNames: [],
      presentations: [
        {
          id: '7e5f7a00',
          code: '7e5f7a00',
          name: 'Large',
          properties: [
            {
              id: '6e5f7a00_code_rxnav',
              code: '6e5f7a00_code_rxnav',
              type: 'code_rxnav',
              value: '168',
            },
          ],
          extraDescriptions: [
            {
              id: '86e85500',
              code: '86e85500',
              name: 'Pink',
              properties: [],
            },
            {
              id: '76e85501',
              code: '76e85501',
              name: 'Black',
              properties: [],
            },
          ],
        },
      ],
      extraDescriptions: [
        {
          id: '36e85501',
          code: '36e85501',
          name: 'Bundled',
          properties: [],
        },
      ],
    };

    const result = buildEntityFromConsumableInput(input);

    expect(result).toEqual({
      parentCode: '77fcbb00',
      code: '7c8c2b5b',
      name: 'Examination Glove',
      description: 'Examination Glove',
      type: 'Product',
      category: 'Consumable',
      properties: [],
      children: [
        {
          code: '7e5f7a00',
          name: 'Large',
          description: 'Examination Glove Large',
          type: 'Presentation',
          category: 'Consumable',
          properties: [
            {
              code: '6e5f7a00_code_rxnav',
              key: 'code_rxnav',
              value: '168',
            },
          ],
          children: [
            {
              code: '86e85500',
              name: 'Pink',
              description: 'Examination Glove Large Pink',
              type: 'ExtraDescription',
              category: 'Consumable',
              properties: [],
            },
            {
              code: '76e85501',
              name: 'Black',
              description: 'Examination Glove Large Black',
              type: 'ExtraDescription',
              category: 'Consumable',
              properties: [],
            },
          ],
        },
        {
          code: '36e85501',
          name: 'Bundled',
          description: 'Examination Glove Bundled',
          type: 'ExtraDescription',
          category: 'Consumable',
          properties: [],
        },
      ],
    });
  });
});

describe('isValidDrugInput', () => {
  it('returns true when drug input is valid', () => {
    const drugInput: DrugInput = {
      id: '7c8c2b5b',
      name: 'Acetic Acid',
      alternativeNames: [],
      properties: [],
      routes: [
        {
          id: '6e5f7a00',
          name: 'Topical',
          properties: [],
          forms: [
            {
              id: '66e85500',
              name: 'Solution',
              properties: [],
              strengths: [
                {
                  id: '36e874bf',
                  name: '2%',
                  properties: [],
                  units: [
                    {
                      id: 'e4edcb00',
                      name: '15mL',
                      properties: [],
                      immediatePackagings: [],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    };

    const result = isValidDrugInput(drugInput);

    expect(result).toBe(true);
  });

  it('returns false when a field is missing a name', () => {
    const drugInput: DrugInput = {
      id: '7c8c2b5b',
      name: 'Acetic Acid',
      alternativeNames: [],
      properties: [],
      routes: [
        {
          id: '6e5f7a00',
          name: 'Topical',
          properties: [],
          forms: [
            {
              id: '66e85500',
              name: 'Solution',
              properties: [],
              strengths: [
                {
                  id: '36e874bf',
                  name: '',
                  properties: [],
                  units: [
                    {
                      id: 'e4edcb00',
                      name: '15mL',
                      properties: [],
                      immediatePackagings: [],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    };

    const result = isValidDrugInput(drugInput);

    expect(result).toBe(false);
  });

  it('returns false when a name is duplicated', () => {
    const drugInput: DrugInput = {
      id: '7c8c2b5b',
      name: 'Acetic Acid',
      alternativeNames: [],
      properties: [],
      routes: [
        {
          id: '6e5f7a00',
          name: 'Topical',
          properties: [],
          forms: [
            {
              id: '66e85500',
              name: 'Solution',
              properties: [],
              strengths: [
                {
                  id: '36e874bf',
                  name: 'SAME NAME',
                  properties: [],
                  units: [],
                },
                {
                  id: '36e874b2',
                  name: 'SAME NAME',
                  properties: [],
                  units: [],
                },
              ],
            },
          ],
        },
      ],
    };

    const result = isValidDrugInput(drugInput);

    expect(result).toBe(false);
  });
});

describe('isValidVaccineInput', () => {
  it('returns true when vaccine input is valid', () => {
    const vaccineInput: VaccineInput = {
      id: '7c8c2b5b',
      name: 'Some Vaccine',
      properties: [],
      alternativeNames: [],
      routes: [
        {
          id: '6e5f7a00',
          name: 'Intramuscular',
          properties: [],
          forms: [
            {
              id: '66e85500',
              name: 'Injection: suspension',
              properties: [],
              details: [],
              activeIngredients: [
                {
                  id: '7e5f7a00',
                  name: 'Component 1/Component 2',
                  properties: [],
                  brands: [
                    {
                      id: '86e85500',
                      name: 'Brand 1',
                      properties: [],
                      strengths: [
                        {
                          id: '36e874bf',
                          name: '2 IU/1 IU',
                          properties: [],
                          units: [
                            {
                              id: 'e4edcb00',
                              name: '0.5mL',
                              properties: [],
                              immediatePackagings: [],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    };

    const result = isValidVaccineInput(vaccineInput);

    expect(result).toBe(true);
  });

  it('returns false when a field is missing a name', () => {
    const vaccineInput: VaccineInput = {
      id: '7c8c2b5b',
      name: 'Some Vaccine',
      alternativeNames: [],
      properties: [],
      routes: [
        {
          id: '7e5f7a00',
          name: 'Oral',
          properties: [],
          forms: [
            {
              id: '86e85500',
              name: '',
              properties: [],
              activeIngredients: [],
              details: [],
            },
          ],
        },
      ],
    };

    const result = isValidVaccineInput(vaccineInput);

    expect(result).toBe(false);
  });

  it('returns false when there is a duplicate name', () => {
    const vaccineInput: VaccineInput = {
      id: '7c8c2b5b',
      name: 'Some Vaccine',
      alternativeNames: [],
      properties: [],
      routes: [
        {
          id: '7e5f7a00',
          name: 'Oral',
          properties: [],
          forms: [
            {
              id: '86e85500',
              name: 'SAME',
              properties: [],
              details: [],
              activeIngredients: [],
            },
            {
              id: '26e85500',
              name: 'SAME',
              properties: [],
              details: [],
              activeIngredients: [],
            },
          ],
        },
      ],
    };

    const result = isValidVaccineInput(vaccineInput);

    expect(result).toBe(false);
  });
});

describe('isValidConsumableInput', () => {
  it('returns true when consumable input is valid', () => {
    const input: ConsumableInput = {
      id: '7c8c2b5b',
      code: '7c8c2b5b',
      name: 'Examination Glove',
      properties: [],
      alternativeNames: [],
      presentations: [
        {
          id: '7e5f7a00',
          code: '7e5f7a00',
          name: 'Large',
          properties: [
            {
              id: '6e5f7a00_code_rxnav',
              code: '6e5f7a00_code_rxnav',
              type: 'code_rxnav',
              value: '168',
            },
          ],
          extraDescriptions: [
            {
              id: '86e85500',
              code: '86e85500',
              name: 'Pink',
              properties: [],
            },
            {
              id: '76e85501',
              code: '76e85501',
              name: 'Black',
              properties: [],
            },
          ],
        },
      ],
      extraDescriptions: [
        {
          id: '36e85501',
          code: '36e85501',
          name: 'Bundled',
          properties: [],
        },
      ],
    };

    const result = isValidConsumableInput(input);

    expect(result).toBe(true);
  });

  it('returns false when a field is missing a name', () => {
    const consumableInput = {
      id: '7c8c2b5b',
      name: 'Examination Glove',
      properties: [],
      extraDescriptions: [],
      alternativeNames: [],
      presentations: [
        {
          id: '7e5f7a00',
          name: '',
          properties: [],
          extraDescriptions: [],
        },
      ],
    };

    const result = isValidConsumableInput(consumableInput);

    expect(result).toBe(false);
  });

  it('returns false when there is a duplicate name', () => {
    const consumableInput = {
      id: '7c8c2b5b',
      name: 'Examination Glove',
      properties: [],
      extraDescriptions: [],
      alternativeNames: [],
      presentations: [
        {
          id: '2e5f7a00',
          name: 'SAME',
          properties: [],
          extraDescriptions: [],
        },
        {
          id: '7e5f7a00',
          name: 'SAME',
          properties: [],
          extraDescriptions: [],
        },
      ],
    };

    const result = isValidConsumableInput(consumableInput);

    expect(result).toBe(false);
  });
});
