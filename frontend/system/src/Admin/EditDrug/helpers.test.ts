import {
  buildDrugInputFromEntity,
  getAllEntityCodes,
  isValidDrugInput,
} from './helpers';

describe('getAllEntityCodes', () => {
  it('returns empty array when entity is not defined', () => {
    expect(getAllEntityCodes(undefined)).toMatchObject([]);
  });
  it('returns codes of entity and all its children', () => {
    const entityDetails = {
      code: '7c8c2b5b',
      name: 'Acetic Acid',
      type: 'drug',
      properties: [],
      children: [
        {
          code: '6e5f7a00',
          name: 'Topical',
          type: 'Route',
          properties: [],
          children: [
            {
              code: '66e85500',
              name: 'Solution',
              type: 'Form',
              properties: [],
              children: [
                {
                  code: '36e874bf',
                  name: '2%',
                  type: 'DoseStrength',
                  properties: [],
                  children: [
                    {
                      code: 'e4edcb00',
                      name: '15mL',
                      type: 'Unit',
                      properties: [],
                    },
                  ],
                },
                {
                  code: '36e874bg',
                  name: '3%',
                  type: 'DoseStrength',
                  properties: [],
                  children: [
                    {
                      code: 'e4edcb01',
                      name: '15mL',
                      type: 'Unit',
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
      properties: [],
      children: [
        {
          code: '6e5f7a00',
          name: 'Topical',
          type: 'Route',
          properties: [],
          children: [
            {
              code: '66e85500',
              name: 'Solution',
              type: 'Form',
              properties: [],
              children: [
                {
                  code: '36e874bf',
                  name: '2%',
                  type: 'DoseStrength',
                  properties: [],
                  children: [
                    {
                      code: 'e4edcb00',
                      name: '15mL',
                      type: 'Unit',
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
      properties: [],
      children: [
        {
          code: '6e5f7a00',
          name: 'Topical',
          type: 'Route',
          properties: [],
          children: [
            {
              code: '66e85500',
              name: 'Solution',
              type: 'Form', // include: direct child of route
              properties: [],
              children: [],
            },
            {
              code: 'e4edcb00',
              name: '15mL',
              type: 'Unit', // exclude: not a direct child of route
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

describe('isValidDrugInput', () => {
  it('returns true when drug input is valid', () => {
    const drugInput = {
      id: '7c8c2b5b',
      name: 'Acetic Acid',
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
    const drugInput = {
      id: '7c8c2b5b',
      name: 'Acetic Acid',
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
});
