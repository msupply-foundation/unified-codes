/**
 * GraphQL API Integration tests
 *
 * @group integration
 */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const crossFetch = require('cross-fetch');

const url = 'http://localhost:4000/v1/graphql';
// const url = 'https://codes.msupply.foundation:2048/v1/graphql';

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
