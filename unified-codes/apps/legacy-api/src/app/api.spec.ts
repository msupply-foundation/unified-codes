/* eslint-disable no-undef */
import nock from 'nock';

import createApiServer from './api';
import queries from './queries';

const server = createApiServer();

describe('Test health endpoint', () => {
  test('Health response has status code 200 on no params', (done) => {
    const expectedStatusCode = 200;

    server
      .inject({
        method: 'GET',
        url: '/health',
      })
      .then((response) => {
        const { statusCode } = response;
        expect(statusCode).toBe(expectedStatusCode);
        done();
      });
  });
});

describe('Test items endpoint', () => {
  test('Items response has status code 200 on no params', (done) => {
    const mockGraphResponse = {
      data: {
        query: [
          {
            code: '5589F4BF',
            description: 'Paracetamol oral tablet, 300mg',
          },
          {
            code: '368C74BE',
            description: 'Amoxicillin oral tablet, 500mg',
          },
          {
            code: '368C74BF',
            description: 'Amoxicillin oral capsule, 250mg',
          },
        ],
      },
      extensions: {
        txn: {
          // eslint-disable-next-line @typescript-eslint/camelcase
          start_ts: 1,
        },
      },
    };

    const expectedStatusCode = 200;

    nock('http://localhost:8080')
      .post('/query')
      .query((queryObject) => !!queryObject.timeout)
      .reply(200, mockGraphResponse);
    server
      .inject({
        method: 'GET',
        url: '/items',
      })
      .then((response) => {
        const { statusCode } = response;
        expect(statusCode).toBe(expectedStatusCode);
        done();
      });
  });

  test('Items response has correct results on no params', (done) => {
    const sortItems = (items) => {
      return items.concat().sort((itemA, itemB) => {
        if (itemA.code < itemB.code) return 1;
        else if (itemA.code === itemB.code) return 0;
        else return -1;
      });
    };

    const mockGraphResponse = {
      data: {
        query: [
          {
            code: '5589F4BF',
            description: 'Paracetamol oral tablet, 300mg',
          },
          {
            code: '368C74BE',
            description: 'Amoxicillin oral tablet, 500mg',
          },
          {
            code: '368C74BF',
            description: 'Amoxicillin oral capsule, 250mg',
          },
        ],
      },
      extensions: {
        txn: {
          // eslint-disable-next-line @typescript-eslint/camelcase
          start_ts: 1,
        },
      },
    };

    const expectedResults = [
      {
        code: '5589F4BF',
        name: 'Paracetamol oral tablet, 300mg',
      },
      {
        code: '368C74BE',
        name: 'Amoxicillin oral tablet, 500mg',
      },
      {
        code: '368C74BF',
        name: 'Amoxicillin oral capsule, 250mg',
      },
    ];

    nock('http://localhost:8080')
      .post('/query')
      .query((queryObject) => !!queryObject.timeout)
      .reply(200, mockGraphResponse);
    server
      .inject({
        method: 'GET',
        url: '/items',
      })
      .then((response) => {
        const { body } = response;
        const results = JSON.parse(body);
        expect(sortItems(results)).toMatchObject(sortItems(expectedResults));
        done();
      });
  });

  test('Items response has status code 200 on valid code', (done) => {
    const mockCode = '5589F4BF';
    const mockGraphResponse = {
      data: {
        query: [
          {
            code: '5589F4BF',
            description: 'Paracetamol oral tablet, 300mg',
          },
        ],
      },
      extensions: {
        txn: {
          // eslint-disable-next-line @typescript-eslint/camelcase
          start_ts: 1,
        },
      },
    };

    const expectedResults = [
      {
        code: '5589F4BF',
        name: 'Paracetamol oral tablet, 300mg',
      },
    ];

    nock('http://localhost:8080')
      .post('/query')
      .query((queryObject) => !!queryObject.timeout)
      .reply(200, (_, requestBody) => {
        const { query, variables } = requestBody as { query: string, variables: { $code: string }};
        const validQuery = query === queries.items.get;
        const validVariables = variables.$code === mockCode;
        if (validQuery && validVariables) {
          return mockGraphResponse;
        }
      });
    server
      .inject({
        method: 'GET',
        url: `/items?code=${mockCode}`,
      })
      .then((response) => {
        const { body } = response;
        const results = JSON.parse(body);
        expect(results).toMatchObject(expectedResults);
        done();
      });
  });

  test('Items response has correct results on valid code', (done) => {
    const mockCode = '5589F4BF';
    const mockGraphResponse = {
      data: {
        query: [
          {
            code: '5589F4BF',
            description: 'Paracetamol oral tablet, 300mg',
          },
        ],
      },
      extensions: {
        txn: {
          // eslint-disable-next-line @typescript-eslint/camelcase
          start_ts: 1,
        },
      },
    };

    const expectedResults = [
      {
        code: '5589F4BF',
        name: 'Paracetamol oral tablet, 300mg',
      },
    ];

    nock('http://localhost:8080')
      .post('/query')
      .query((queryObject) => !!queryObject.timeout)
      .reply(200, (_, requestBody) => {
        const { query, variables } = requestBody as { query: string, variables: { $code: string }};
        const validQuery = query === queries.items.get;
        const validVariables = variables.$code === mockCode;
        if (validQuery && validVariables) {
          return mockGraphResponse;
        }
      });
    server
      .inject({
        method: 'GET',
        url: `/items?code=${mockCode}`,
      })
      .then((response) => {
        const { body } = response;
        const results = JSON.parse(body);
        expect(results).toMatchObject(expectedResults);
        done();
      });
  });

  test('Items response has status code 200 on exact name search', (done) => {
    const mockName = 'Paracetamol oral tablet, 300mg';
    const mockGraphResponse = {
      data: {
        query: [
          {
            code: '5589F4BF',
            description: 'Paracetamol oral tablet, 300mg',
          },
        ],
      },
      extensions: {
        txn: {
          // eslint-disable-next-line @typescript-eslint/camelcase
          start_ts: 1,
        },
      },
    };

    const expectedStatusCode = 200;

    nock('http://localhost:8080')
      .post('/query')
      .query((queryObject) => !!queryObject.timeout)
      .reply(200, (_, requestBody) => {
        const { query, variables } = requestBody as { query: string, variables: { $name: string }};
        const validQuery = query === queries.items.searchExact;
        const validVariables = variables.$name === mockName;
        if (validQuery && validVariables) {
          return mockGraphResponse;
        }
      });
    server
      .inject({
        method: 'GET',
        url: `/items?name=${name}&exact=true`,
      })
      .then((response) => {
        const { statusCode } = response;
        expect(statusCode).toBe(expectedStatusCode);
        done();
      });
  });

  test('Items response has correct results on exact name search', (done) => {
    const mockName = 'Paracetamol oral tablet, 300mg';
    const mockGraphResponse = {
      data: {
        query: [
          {
            code: '5589F4BF',
            description: 'Paracetamol oral tablet, 300mg',
          },
        ],
      },
      extensions: {
        txn: {
          // eslint-disable-next-line @typescript-eslint/camelcase
          start_ts: 1,
        },
      },
    };

    const expectedResults = [
      {
        code: '5589F4BF',
        name: 'Paracetamol oral tablet, 300mg',
      },
    ];

    nock('http://localhost:8080')
      .post('/query')
      .query((queryObject) => !!queryObject.timeout)
      .reply(200, (_, requestBody) => {
        const { query, variables } = requestBody as { query: string, variables: { $name: string }};
        const validQuery = query === queries.items.searchExact;
        const validVariables = variables.$name === mockName;
        if (validQuery && validVariables) {
          return mockGraphResponse;
        }
      });
    server
      .inject({
        method: 'GET',
        url: `/items?name=${name}&exact=true`,
      })
      .then((response) => {
        const { body } = response;
        const results = JSON.parse(body);
        expect(results).toMatchObject(expectedResults);
        done();
      });
  });

  test('Items response has status code 200 on non-exact name search', (done) => {
    const mockName = 'Amox';
    const mockGraphResponse = {
      data: {
        query: [
          {
            code: '368C74BE',
            description: 'Amoxicillin oral tablet, 500mg',
          },
          {
            code: '368C74BF',
            description: 'Amoxicillin oral capsule, 250mg',
          },
        ],
      },
      extensions: {
        txn: {
          // eslint-disable-next-line @typescript-eslint/camelcase
          start_ts: 1,
        },
      },
    };

    const expectedStatusCode = 200;

    nock('http://localhost:8080')
      .post('/query')
      .query((queryObject) => !!queryObject.timeout)
      .reply(200, (_, requestBody) => {
        const { query, variables } = requestBody as { query: string, variables: { $term: string }};
        const validQuery = query === queries.items.search;
        const validVariables = variables.$term.includes(mockName);
        if (validQuery && validVariables) {
          return mockGraphResponse;
        }
      });
    server
      .inject({
        method: 'GET',
        url: `/items?name=${mockName}&exact=false`,
      })
      .then((response) => {
        const { statusCode } = response;
        expect(statusCode).toBe(expectedStatusCode);
        done();
      });
  });

  test('Items response has correct results on non-exact name search', (done) => {
    const mockName = 'Amox';
    const mockGraphResponse = {
      data: {
        query: [
          {
            code: '368C74BE',
            description: 'Amoxicillin oral tablet, 500mg',
          },
          {
            code: '368C74BF',
            description: 'Amoxicillin oral capsule, 250mg',
          },
        ],
      },
      extensions: {
        txn: {
          // eslint-disable-next-line @typescript-eslint/camelcase
          start_ts: 1,
        },
      },
    };

    const expectedResults = [
      {
        code: '368C74BE',
        name: 'Amoxicillin oral tablet, 500mg',
      },
      {
        code: '368C74BF',
        name: 'Amoxicillin oral capsule, 250mg',
      },
    ];

    nock('http://localhost:8080')
      .post('/query')
      .query((queryObject) => !!queryObject.timeout)
      .reply(200, (_, requestBody) => {
        const { query, variables } = requestBody as { query: string, variables: { $term: string }};
        const validQuery = query === queries.items.search;
        const validVariables = variables.$term.includes(mockName);
        if (validQuery && validVariables) {
          return mockGraphResponse;
        }
      });
    server
      .inject({
        method: 'GET',
        url: `/items?name=${mockName}&exact=false`,
      })
      .then((response) => {
        const { body } = response;
        const results = JSON.parse(body);
        expect(results).toMatchObject(expectedResults);
        done();
      });
  });

  test('Items response has status code 200 on short non-exact name search', (done) => {
    const mockName = 'Am';
    const mockGraphResponse = {
      data: {
        query: [
          {
            code: '368C74BE',
            name: 'Amoxicillin oral tablet 500mg',
          },
          {
            code: '368C74BF',
            name: 'Amoxicillin oral capsule, 250mg',
          },
        ],
      },
      extensions: {
        txn: {
          // eslint-disable-next-line @typescript-eslint/camelcase
          start_ts: 1,
        },
      },
    };

    const expectedStatusCode = 200;

    nock('http://localhost:8080')
      .post('/query')
      .query((queryObject) => !!queryObject.timeout)
      .reply(200, mockGraphResponse);
    server
      .inject({
        method: 'GET',
        url: `/items?name=${mockName}&exact=false`,
      })
      .then((response) => {
        const { statusCode } = response;
        expect(statusCode).toBe(expectedStatusCode);
        done();
      });
  });

  test('Items response has correct results on short non-exact name search', (done) => {
    const mockName = 'Am';
    const mockGraphResponse = {
      data: {
        query: [
          {
            code: '368C74BE',
            name: 'Amoxicillin oral tablet 500mg',
          },
          {
            code: '368C74BF',
            name: 'Amoxicillin oral capsule, 250mg',
          },
        ],
      },
      extensions: {
        txn: {
          // eslint-disable-next-line @typescript-eslint/camelcase
          start_ts: 1,
        },
      },
    };

    const expectedResults = [
      {
        code: '368C74BE',
        name: 'Amoxicillin oral tablet, 500mg',
      },
      {
        code: '368C74BF',
        name: 'Amoxicillin oral capsule, 250mg',
      },
    ];

    nock('http://localhost:8080')
      .post('/query')
      .query((queryObject) => !!queryObject.timeout)
      .reply(200, mockGraphResponse);
    server
      .inject({
        method: 'GET',
        url: `/items?name=${mockName}&exact=false`,
      })
      .then((response) => {
        const { body } = response;
        const results = JSON.parse(body);
        expect(results).toMatchObject(expectedResults);
        done();
      });
  });

  test('Items response has status code 400 on invalid params', (done) => {
    const expectedStatusCode = 400;

    server
      .inject({
        method: 'GET',
        url: '/items',
        query: { invalidParam: 'invalidData' },
      })
      .then((response) => {
        const { statusCode } = response;
        expect(statusCode).toBe(expectedStatusCode);
        done();
      });
  });
});

describe('Test version endpoint', () => {
  test('Version response has status code 200 on no params', (done) => {
    const expectedStatusCode = 200;

    server
      .inject({
        method: 'GET',
        url: '/version',
      })
      .then((response) => {
        const { statusCode } = response;
        expect(statusCode).toBe(expectedStatusCode);
        done();
      });
  });

  test('Version response has version property on no params', (done) => {
    const expectedProperty = 'version';

    server
      .inject({
        method: 'GET',
        url: '/version',
      })
      .then((response) => {
        const body = response.json();
        expect(body).toHaveProperty(expectedProperty);
        done();
      });
  });

  test('Version response has versionShort property on no params', (done) => {
    const expectedProperty = 'versionShort';

    server
      .inject({
        method: 'GET',
        url: '/version',
      })
      .then((response) => {
        const body = response.json();
        expect(body).toHaveProperty(expectedProperty);
        done();
      });
  });
});

describe('Test invalid endpoint', () => {
  test('Invalid endpoint response has status code 404 on no params', (done) => {
    const expectedStatusCode = 404;

    server
      .inject({
        method: 'GET',
        url: '/invalid',
      })
      .then((response) => {
        const { statusCode } = response;
        expect(statusCode).toBe(expectedStatusCode);
        done();
      });
  });
});
