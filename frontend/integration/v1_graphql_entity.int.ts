/**
 * GraphQL API Integration tests
 *
 * @group integration
 */

import crossFetch from 'cross-fetch';

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
        product: {
          code: '12e6911d',
        },
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
