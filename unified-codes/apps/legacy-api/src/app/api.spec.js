/* eslint-disable no-undef */
import nock from 'nock';

import createApiServer from './api';
import queries from './queries';

const server = createApiServer();

describe('Test health endpoint', () => {
  test('Health endpoint response has status code 200', (done) => {
    server
      .inject({
        method: 'GET',
        url: '/health',
      })
      .then((response) => {
        const { statusCode } = response;
        expect(statusCode).toBe(200);
        done();
      });
  });
});

describe('Test items endpoint', () => {
  test('Items endpoint with no params has status code 200', (done) => {
    const dgraphResponse = {
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
          start_ts: 1,
        },
      },
    };

    nock('http://localhost:8080')
      .post('/query')
      .query((queryObject) => !!queryObject.timeout)
      .reply(200, dgraphResponse);
    server
      .inject({
        method: 'GET',
        url: '/items',
      })
      .then((response) => {
        const { statusCode } = response;
        expect(statusCode).toBe(200);
        done();
      });
  });

  test('Items endpoint with no params returns all items', (done) => {
    const sortItems = (items) => {
      return items.concat().sort((itemA, itemB) => {
        if (itemA.code < itemB.code) return 1;
        else if (itemA.code === itemB.code) return 0;
        else return -1;
      });
    };

    const items = [
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

    const dgraphResponse = {
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
          start_ts: 1,
        },
      },
    };

    nock('http://localhost:8080')
      .post('/query')
      .query((queryObject) => !!queryObject.timeout)
      .reply(200, dgraphResponse);
    server
      .inject({
        method: 'GET',
        url: '/items',
      })
      .then((response) => {
        const body = JSON.parse(response.body);
        expect(sortItems(body)).toMatchObject(sortItems(items));
        done();
      });
  });

  test('Items endpoint with valid code returns matching item', (done) => {
    const code = '5589F4BF';

    const graphResponse = {
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
          start_ts: 1,
        },
      },
    };

    const apiResponse = [
      {
        code: '5589F4BF',
        name: 'Paracetamol oral tablet, 300mg',
      },
    ];

    nock('http://localhost:8080')
      .post('/query')
      .query((queryObject) => !!queryObject.timeout)
      .reply(200, (_, requestBody) => {
        const { query, variables } = requestBody;
        const validQuery = query === queries.items.get;
        const validVariables = variables.$code === code;
        if (validQuery && validVariables) {
          return graphResponse;
        }
      });
    server
      .inject({
        method: 'GET',
        url: `/items?code=${code}`,
      })
      .then((response) => {
        const { body } = response;
        expect(body).toBe(JSON.stringify(apiResponse));
        done();
      });
  });

  test('Items endpoint with exact name search returns matching item', (done) => {
    const name = 'Paracetamol oral tablet, 300mg';

    const graphResponse = {
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
          start_ts: 1,
        },
      },
    };

    const apiResponse = [
      {
        code: '5589F4BF',
        name: 'Paracetamol oral tablet, 300mg',
      },
    ];

    nock('http://localhost:8080')
      .post('/query')
      .query((queryObject) => !!queryObject.timeout)
      .reply(200, (_, requestBody) => {
        const { query, variables } = requestBody;
        const validQuery = query === queries.items.searchExact;
        const validVariables = variables.$name === name;
        if (validQuery && validVariables) {
          return graphResponse;
        }
      });
    server
      .inject({
        method: 'GET',
        url: `/items?name=${name}&exact=true`,
      })
      .then((response) => {
        const body = JSON.parse(response.body);
        expect(body).toMatchObject(apiResponse);
        done();
      });
  });

  test('Items endpoint with non-exact name search returns matching items', (done) => {
    const searchName = 'Amox';

    const graphResponse = {
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
          start_ts: 1,
        },
      },
    };

    const apiResponse = [
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
        const { query, variables } = requestBody;
        const validQuery = query === queries.items.search;
        const validVariables = variables.$term.includes(searchName);
        if (validQuery && validVariables) {
          return graphResponse;
        }
      });
    server
      .inject({
        method: 'GET',
        url: `/items?name=${searchName}&exact=false`,
      })
      .then((response) => {
        const body = JSON.parse(response.body);
        expect(body).toMatchObject(apiResponse);
        done();
      });
  });

  test('Items endpoint with non-exact short name search returns results', (done) => {
    const searchName = 'Am';

    const graphResponse = {
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
          start_ts: 1,
        },
      },
    };

    const apiResponse = [
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
      .reply(200, graphResponse);
    server
      .inject({
        method: 'GET',
        url: `/items?name=${searchName}&exact=false`,
      })
      .then((response) => {
        const { statusCode } = response;
        expect(statusCode).toBe(200);
        done();
      });
  });

  test('Items endpoint with invalid params has status code 400', (done) => {
    server
      .inject({
        method: 'GET',
        url: '/items',
        query: { invalidParam: 'invalidData' },
      })
      .then((response) => {
        const { statusCode } = response;
        expect(statusCode).toBe(400);
        done();
      });
  });
});

describe('Test version endpoint', () => {
  test('Version endpoint response has status code 200', (done) => {
    server
      .inject({
        method: 'GET',
        url: '/version',
      })
      .then((response) => {
        const { statusCode } = response;
        expect(statusCode).toBe(200);
        done();
      });
  });

  test('Version endpoint response has body with version properties', (done) => {
    server
      .inject({
        method: 'GET',
        url: '/version',
      })
      .then((response) => {
        const body = response.json();
        expect(body).toHaveProperty('version');
        expect(body).toHaveProperty('versionShort');
        done();
      });
  });
});

describe('Test invalid endpoint', () => {
  test('Invalid endpoint response has status code 404', (done) => {
    server
      .inject({
        method: 'GET',
        url: '/invalid',
      })
      .then((response) => {
        const { statusCode } = response;
        expect(statusCode).toBe(404);
        done();
      });
  });
});
