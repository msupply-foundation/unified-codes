import nock from 'nock';

import { apiResponses, graphResponses, data } from './fixtures';

import api from '../src/api';
import queries from '../src/queries';

const sortItems = (items) => {
  return items.concat().sort((itemA, itemB) => {
    if (itemA.code < itemB.code) return 1;
    else if (itemA.code === itemB.code) return 0;
    else return -1;
  });
};

describe('Test health endpoint', () => {
  test('Health endpoint response has status code 200', (done) => {
    api
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
    nock('http://localhost:8080')
      .post('/query')
      .query((queryObject) => !!queryObject.timeout)
      .reply(200, graphResponses.items.all);
    api
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
    nock('http://localhost:8080')
      .post('/query')
      .query((queryObject) => !!queryObject.timeout)
      .reply(200, graphResponses.items.all);
    api
      .inject({
        method: 'GET',
        url: '/items',
      })
      .then((response) => {
        const body = JSON.parse(response.body);
        expect(sortItems(body)).toMatchObject(sortItems(apiResponses.items.all));
        done();
      });
  });

  test('Items endpoint with valid code returns matching item', (done) => {
    const { items } = data;
    const [item] = items;
    const { code } = item;

    nock('http://localhost:8080')
      .post('/query')
      .query((queryObject) => !!queryObject.timeout)
      .reply(200, (_, requestBody) => {
        const { query, variables } = requestBody;
        const validQuery = query === queries.items.get;
        const validVariables = variables.$code === code;
        if (validQuery && validVariables) {
          return graphResponses.items[code];
        }
      });

    api
      .inject({
        method: 'GET',
        url: `/items?code=${code}`,
      })
      .then((response) => {
        const { body } = response;
        expect(body).toBe(JSON.stringify(apiResponses.items[code]));
        done();
      });
  });

  test('Items endpoint with exact name search returns matching item', (done) => {
    const { items } = data;
    const [item] = items;
    const { code, name } = item;

    nock('http://localhost:8080')
      .post('/query')
      .query((queryObject) => !!queryObject.timeout)
      .reply(200, (_, requestBody) => {
        const { query, variables } = requestBody;
        const validQuery = query === queries.items.searchExact;
        const validVariables = variables.$name === name;
        if (validQuery && validVariables) {
          return graphResponses.items[code];
        }
      });

    api
      .inject({
        method: 'GET',
        url: `/items?name=${name}&exact=true`,
      })
      .then((response) => {
        const body = JSON.parse(response.body);
        expect(body).toMatchObject(apiResponses.items[code]);
        done();
      });
  });

  test('Items endpoint with non-exact name search returns matching items', (done) => {
    const { items } = data;
    const [item] = items;
    const { code, name } = item;

    const searchName = name.substring(0, 3);
    const searchCodes = items
      .filter((item) => item.name.startsWith(searchName))
      .map((item) => item.code);

    const apiResponse = Object.entries(apiResponses.items).reduce((acc, [key, value]) => {
      if (searchCodes.includes(key)) {
        return acc.concat(value);
      }
      return acc;
    }, []);

    const graphResponse = Object.entries(graphResponses.items).reduce((acc, [key, value]) => {
      if (key != code && searchCodes.includes(key)) acc.data.query.concat(value.data.query);
      return acc;
    }, graphResponses.items[code]);

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

    api
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

  test('Items endpoint with invalid params has status code 400', (done) => {
    api
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
    api
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
    api
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
    api
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
