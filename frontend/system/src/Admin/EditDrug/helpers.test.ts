import { buildDrugInputFromEntity } from './helpers';

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
          type: 'form_category',
          properties: [],
          children: [
            {
              code: '66e85500',
              name: 'Solution',
              type: 'form',
              properties: [],
              children: [
                {
                  code: '36e874bf',
                  name: '2%',
                  type: 'strength',
                  properties: [],
                  children: [
                    {
                      code: 'e4edcb00',
                      name: '15mL',
                      type: 'unit_of_use',
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
      code: '7c8c2b5b',
      name: 'Acetic Acid',
      type: 'drug',
      properties: [
        { type: 'who_eml', value: '28' },
        { type: 'code_unspsc', value: '51471602' },
      ],
      children: [
        {
          code: '6e5f7a00',
          name: 'Topical',
          type: 'form_category',
          properties: [{ type: 'code_rxnav', value: '168' }],
          children: [],
        },
      ],
    };

    const result = buildDrugInputFromEntity(entityDetails);

    expect(result).toEqual({
      id: '7c8c2b5b',
      name: 'Acetic Acid',
      properties: [
        { id: '7c8c2b5b_who_eml', type: 'who_eml', value: '28' },
        { id: '7c8c2b5b_code_unspsc', type: 'code_unspsc', value: '51471602' },
      ],
      routes: [
        {
          id: '6e5f7a00',
          name: 'Topical',
          properties: [
            { id: '6e5f7a00_code_rxnav', type: 'code_rxnav', value: '168' },
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
          type: 'form_category',
          properties: [],
          children: [
            {
              code: '66e85500',
              name: 'Solution',
              type: 'form', // include: direct child of form_category (route)
              properties: [],
              children: [],
            },
            {
              code: 'e4edcb00',
              name: '15mL',
              type: 'unit_of_use', // exclude: not a direct child of route
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
              strengths: [],
            },
          ],
        },
      ],
    });
  });
});
