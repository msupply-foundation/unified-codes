/**
 * GraphQL API Integration tests
 *
 * @group integration
 */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const crossFetch = require('cross-fetch');

// const url = 'http://localhost:4000/v1/graphql';
const url = 'http://localhost:4007/v1/graphql';
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

  return crossFetch(url, {
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
    .then(res => res.json())
    .then(res => {
      expect(res.data.entity.code).toEqual('c7750265');
      expect(res.data.entity.description).toEqual('Abacavir');
      expect(JSON.stringify(res)).toContain('888e7a00');
      expect(JSON.stringify(res)).toContain('db3d2000');
      expect(JSON.stringify(res)).toContain('358b04bf');
      expect(JSON.stringify(res)).toContain('945b5500');
      expect(JSON.stringify(res)).toContain('3590a4bf');
      expect(res.data.entity.properties).toEqual(
        expected.data.entity.properties
      );
    });
});

test('Invalid - get entity', () => {
  const expected = {
    data: {
      entity: null,
    },
  };

  return crossFetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `{
  entity (code: "invalid") {
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
    .then(res => res.json())
    .then(res => {
      expect(res.data.entity).toEqual(expected.data.entity);
    });
});

test('Web UI Search - ace', () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const expected = {
    data: {
      entities: {
        data: [
          {
            code: '33d71824',
            description: 'Acetazolamide',
            type: 'drug',
          },
          {
            code: '7c8c2b5b',
            description: 'Acetic Acid',
            type: 'drug',
          },
          {
            code: 'c8ba31a5',
            description: 'Acetylcysteine',
            type: 'drug',
          },
          {
            code: 'cf00cc3f',
            description: 'Acetylsalicylic Acid',
            type: 'drug',
          },
        ],
        totalLength: 4,
      },
    },
  };

  return crossFetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `{
            entities(filter: { code: "" categories: ["drug"] description: "ace" type: "drug" orderBy: { field: "description" descending: false } } offset: 0 first: 25) {
                data {
                    code
                    description
                    type
                },
                totalLength,
            }
        }`,
    }),
  })
    .then(res => res.json())
    .then(res => {
      expect(res.data.entities.data.length).toBeGreaterThan(3);
      expect(res.data.entities.data.map(entity => entity.code)).toContain(
        '33d71824'
      );
      expect(res.data.entities.data.map(entity => entity.code)).toContain(
        '7c8c2b5b'
      );
      expect(res.data.entities.data.map(entity => entity.code)).toContain(
        'c8ba31a5'
      );
      expect(res.data.entities.data.map(entity => entity.code)).toContain(
        'cf00cc3f'
      );
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

  return crossFetch(url, {
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
    .then(res => res.json())
    .then(res => {
      for (const expectedCode of expectedCodes) {
        expect(res.data.entities.data.map(entity => entity.code)).toContain(
          expectedCode
        );
      }
    });
});

test('full entity type', () => {
  // Note: Deliberately not querying uid, as it is not stable
  const query = `
query FullEntity {
  entity(code: "12e6911d") {
    type
    code
    description
    interactions {
      name
      description
      severity
      rxcui
      source
    }
    parents {
      code
    }
    product {
      code
    }
    properties {
      type
      value
    }
    children {
      code
    }
  }
}
  `;

  const expected = {
    data: {
      entity: {
        type: 'drug',
        code: '12e6911d',
        description: 'Benzylpenicillin Sodium',
        interactions: null,
        parents: [
          {
            code: '933f3f00',
          },
        ],
        product: null,
        properties: [
          {
            type: 'code_rxnav',
            value: '9900',
          },
          {
            type: 'who_eml',
            value: '6.2.1',
          },
          {
            type: 'code_nzulm',
            value: '10091071000116105',
          },
          {
            type: 'code_unspsc',
            value: '51283416',
          },
        ],
        children: [
          {
            code: '54e9ed00',
          },
        ],
      },
    },
  };

  return crossFetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: query,
    }),
  })
    .then(res => res.json())
    .then(res => {
      expect(res).toEqual(expected);
    });
});

test('filter-description-default', () => {
  const expected = {
    data: {
      entities: {
        data: [
          {
            code: '11c27038',
            description: 'Albendazole',
          },
          {
            code: '6d8482f7',
            description: 'Allopurinol',
          },
          {
            code: '61b3a61d',
            description: 'Alprostadil',
          },
        ],
        totalLength: 3,
      },
    },
  };

  const query = `{
            entities(filter: { code: "" categories: ["drug"] description: "Al", type: "drug" orderBy: { field: "description" descending: false } } offset: 0 first: 25) {
                data {
                    code
                    description
                },
                totalLength,
            }
        }`;

  return crossFetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: query,
    }),
  })
    .then(res => res.json())
    .then(res => {
      expect(res).toEqual(expected);
    });
});

test('filter-description-begin', () => {
  const expected = {
    data: {
      entities: {
        data: [
          {
            code: '11c27038',
            description: 'Albendazole',
          },
          {
            code: '6d8482f7',
            description: 'Allopurinol',
          },
          {
            code: '61b3a61d',
            description: 'Alprostadil',
          },
        ],
        totalLength: 3,
      },
    },
  };

  const query = `{
            entities(filter: { code: "" categories: ["drug"] description: "Al", match: "begin", type: "drug" orderBy: { field: "description" descending: false } } offset: 0 first: 25) {
                data {
                    code
                    description
                },
                totalLength,
            }
        }`;

  return crossFetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: query,
    }),
  })
    .then(res => res.json())
    .then(res => {
      expect(res).toEqual(expected);
    });
});

test('filter-description-exact', () => {
  const expected = {
    data: {
      entities: {
        data: [
          {
            code: '11c27038',
            description: 'Albendazole',
          },
        ],
        totalLength: 1,
      },
    },
  };

  const query = `{
            entities(filter: { code: "" categories: ["drug"] description: "Albendazole",  match: "exact", type: "drug" orderBy: { field: "description" descending: false } } offset: 0 first: 25) {
                data {
                    code
                    description
                },
                totalLength,
            }
        }`;

  return crossFetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: query,
    }),
  })
    .then(res => res.json())
    .then(res => {
      expect(res).toEqual(expected);
    });
});

test('filter-description-contains', () => {
  const expected = {
    data: {
      entities: {
        data: [
          {
            code: '11c27038',
            description: 'Albendazole',
          },
          {
            code: '61fe4813',
            description: 'Benznidazole',
          },
          {
            code: '8aa42218',
            description: 'Mebendazole',
          },
          {
            code: 'a1004adb',
            description: 'Metronidazole',
          },
          {
            code: 'fe76247c',
            description: 'Midazolam',
          },
          {
            code: '3217b037',
            description: 'Triclabendazole',
          },
        ],
        totalLength: 6,
      },
    },
  };

  const query = `{
            entities(filter: { code: "" categories: ["drug"] description: "daz", match: "contains", type: "drug" orderBy: { field: "description" descending: false } } offset: 0 first: 25) {
                data {
                    code
                    description
                },
                totalLength,
            }
        }`;

  return crossFetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: query,
    }),
  })
    .then(res => res.json())
    .then(res => {
      expect(res).toEqual(expected);
    });
});

// Note: This test fails as the old API doesn't implement code search!!!
test('filter-code-exact', () => {
  const expected = {
    data: {
      entities: {
        data: [
          {
            code: '11c27038',
            description: 'Albendazole',
          },
        ],
        totalLength: 1,
      },
    },
  };

  const query = `{
            entities(filter: { code: "11c27038" categories: ["drug"] description: "", match: "contains", type: "drug" orderBy: { field: "description" descending: false } } offset: 0 first: 25) {
                data {
                    code
                    description
                },
                totalLength,
            }
        }`;

  return crossFetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: query,
    }),
  })
    .then(res => res.json())
    .then(res => {
      expect(res).toEqual(expected);
    });
});

// Test the category filter for consumables
test('filter-category-consumable', () => {
  const expected = {
    data: {
      entities: {
        data: [
          {
            code: 'af482fa09',
            description: 'Biohazard Spill Kit',
          },
          {
            code: 'ad73d65c3',
            description:
              'UNFPA Consumable Kit for Contraceptive Implants Insertion or Removal',
          },
          {
            code: '5b5c29e4e',
            description: 'UNFPA Dignity Kit',
          },
          {
            code: '802ebeaa',
            description: 'UNFPA Reproductive Health Kit',
          },
        ],
        totalLength: 4,
      },
    },
  };

  const query = `{
            entities(filter: { code: "" categories: ["consumable"] description: "Kit", match: "contains", type: "consumable" orderBy: { field: "description" descending: false } } offset: 0 first: 25) {
                data {
                    code
                    description
                },
                totalLength,
            }
        }`;

  return crossFetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: query,
    }),
  })
    .then(res => res.json())
    .then(res => {
      expect(res).toEqual(expected);
    });
});
