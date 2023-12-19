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

test('Web UI Search - ace - descending', () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const expected = {
    data: {
      entities: {
        data: [
          {
            code: 'cf00cc3f',
            description: 'Acetylsalicylic Acid',
            name: 'Acetylsalicylic Acid',
          },
          {
            code: 'c8ba31a5',
            description: 'Acetylcysteine',
            name: 'Acetylcysteine',
          },
          {
            code: '7c8c2b5b',
            description: 'Acetic Acid',
            name: 'Acetic Acid',
          },
          {
            code: '33d71824',
            description: 'Acetazolamide',
            name: 'Acetazolamide',
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
            entities(filter: { code: "" categories: ["drug"] description: "ace" type: "drug" orderBy: { field: "description", descending: true } } offset: 0 first: 25) {
                data {
                    code
                    description
                    name
                },
                totalLength,
            }
        }`,
    }),
  })
    .then(res => res.json())
    .then(res => {
      expect(res).toEqual(expected);
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
