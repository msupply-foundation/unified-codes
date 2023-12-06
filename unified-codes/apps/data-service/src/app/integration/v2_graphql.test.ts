require('isomorphic-fetch');

const url = 'http://localhost:4000/v1/graphql';
// const url = 'https://codes.msupply.foundation:2048/v1/graphql';

test('Abacavir - get entity', () => {
  // From live server 2023-12-06
  // But with correct code_nzulm code 10740371000116108
  const expected = {
    data: {
      entity: {
        code: 'c7750265',
        description: 'Abacavir',
        type: 'drug',
        properties: [
          {
            type: 'code_rxnav',
            value: '190521',
          },
          {
            type: 'who_eml',
            value: '6.4.2.1',
          },
          {
            type: 'code_nzulm',
            value: '10740371000116108',
          },
          {
            type: 'code_unspsc',
            value: '51342501',
          },
        ],
        children: [
          {
            code: 'b49ec300',
            description: 'Abacavir Oral',
            type: 'form_category',
            properties: null,
            children: [
              {
                code: '888e7a00',
                description: 'Abacavir Oral Solution',
                type: 'form',
                properties: null,
                children: [
                  {
                    code: 'db3d2000',
                    description: 'Abacavir Oral Solution 20mg per mL',
                    type: 'strength',
                    properties: null,
                    children: [
                      {
                        code: '358b04bf',
                        description: 'Abacavir Oral Solution 20mg per mL 240mL',
                        type: 'unit_of_use',
                        properties: null,
                        children: null,
                      },
                    ],
                  },
                ],
              },
              {
                code: '945b5500',
                description: 'Abacavir Oral Tablet',
                type: 'form',
                properties: null,
                children: [
                  {
                    code: '3590a4bf',
                    description: 'Abacavir Oral Tablet 300mg',
                    type: 'strength',
                    properties: null,
                    children: null,
                  },
                ],
              },
            ],
          },
        ],
      },
    },
  };

  return fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `{
  entity (code: "c7750265") {
    code
    description
    type
    properties {
      type
      value
    }
    children {
      code
      description
      type
      properties {
        type
        value
      }
      children {
        code
        description
        type
        properties {
          type
          value
        }
        children {
          code
          description
          type
          properties {
            type
            value
          }
          children {
            code
            description
            type
            properties {
              type
              value
            }
            children {
              code
              description
              type
              properties {
                type
                value
              }
            }
          }
        }
      }
    }
  }
}`,
    }),
  })
    .then((res) => res.json())
    .then((res) => {
      expect(res.data.entity.code).toEqual('c7750265');
      expect(res.data.entity.description).toEqual('Abacavir');
      expect(JSON.stringify(res)).toContain('888e7a00');
      expect(JSON.stringify(res)).toContain('db3d2000');
      expect(JSON.stringify(res)).toContain('358b04bf');
      expect(JSON.stringify(res)).toContain('945b5500');
      expect(JSON.stringify(res)).toContain('3590a4bf');
      expect(res.data.entity.properties).toEqual(expected.data.entity.properties);
    });
});

test('Web UI Search - ace', () => {
  const expected = {
    data: {
      entities: {
        data: [
          {
            code: '33d71824',
            description: 'Acetazolamide',
            type: 'drug',
            uid: '0x186d1',
          },
          {
            code: '7c8c2b5b',
            description: 'Acetic Acid',
            type: 'drug',
            uid: '0x186d5',
          },
          {
            code: 'c8ba31a5',
            description: 'Acetylcysteine',
            type: 'drug',
            uid: '0x186da',
          },
          {
            code: 'cf00cc3f',
            description: 'Acetylsalicylic Acid',
            type: 'drug',
            uid: '0x186e6',
          },
        ],
        totalLength: 4,
      },
    },
  };

  return fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `{
            entities(filter: { code: "" categories: ["drug"] description: "ace" type: "drug" orderBy: { field: "description" descending: false } } offset: 0 first: 25) {
                data {
                    code
                    description
                    type
                    uid
                },
                totalLength,
            }
        }`,
    }),
  })
    .then((res) => res.json())
    .then((res) => {
      expect(res.data.entities.data.length).toBeGreaterThan(3);
      expect(res.data.entities.data.map((entity) => entity.code)).toContain('33d71824');
      expect(res.data.entities.data.map((entity) => entity.code)).toContain('7c8c2b5b');
      expect(res.data.entities.data.map((entity) => entity.code)).toContain('c8ba31a5');
      expect(res.data.entities.data.map((entity) => entity.code)).toContain('cf00cc3f');
    });
});

test('mSupply Search - ace', () => {
  const searchTerm = 'ace';
  const expectedCodes = [
    '373324bf',
    '36e874bf',
    'e4edcb00',
    '35a214bf',
    'ddc16200',
    '35a724bf',
    'f72aec00',
    '80cdff00',
    'c7757000',
    '35c2f4bf',
    '35d384bf',
    '35de24bf',
    '35e654bf',
    '46a0743e',
    '35ce74bf',
    '35d934bf',
    '35c954bf',
  ];

  return fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `{
            entities(filter: { description: "${searchTerm}" type: "drug unit_of_use medicinal_product" orderBy: { field: "description" descending: false } } offset: 0 first: 25) {
                data { code description type properties { type value } product { properties { type value } } }, totalLength
            }
        }`,
    }),
  })
    .then((res) => res.json())
    .then((res) => {
      for (const expectedCode of expectedCodes) {
        expect(res.data.entities.data.map((entity) => entity.code)).toContain(expectedCode);
      }
    });
});
