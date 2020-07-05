import nock from 'nock';

import { apiResponses, graphResponses, data } from './fixtures';

import api from '../src/api';
import queries from '../src/queries';

describe("Test health endpoint", () => {
    test("Health endpoint response has status code 200", done => {
        api.inject({
            method: 'GET',
            url: '/health'
        }).then(response => {
            const { statusCode } = response;
            expect(statusCode).toBe(200);
            done();
        });
    });
});

describe("Test items endpoint", () => {
    test("Items endpoint with no params has status code 200", done => {
        nock("http://localhost:8080")
          .post('/query')
          .query(queryObject => !!queryObject.timeout)
          .reply(200, graphResponses.items.all);
        api.inject({
            method: 'GET',
            url: '/items'
        }).then(response => {
            const { statusCode } = response;
            expect(statusCode).toBe(200);
            done();
        });
    });

    test("Items endpoint with invalid params has status code 400", done => {
        api.inject({
            method: 'GET',
            url: '/items',
            query: ({ badQuery: 'invalidData' })
        }).then(response => {
            const { statusCode } = response;
            expect(statusCode).toBe(400);
            done();
        });
    });

});

describe("Test version endpoint", () => {
    test("Version endpoint response has status code 200", done => {
        api.inject({
            method: 'GET',
            url: '/version'
        }).then(response => {
            const { statusCode } = response;
            expect(statusCode).toBe(200);
            done();
        });
    });

    test("Version endpoint response has body with version properties", done => {
        api.inject({
            method: 'GET',
            url: '/version'
        }).then(response => {
            const body = response.json();
            expect(body).toHaveProperty('version');
            expect(body).toHaveProperty('versionShort');
            done();
        });
    });
});

describe("Test invalid endpoint", () => {
    test("Invalid endpoint response has status code 404", done => {
        api.inject({
            method: 'GET',
            url: '/invalid'
        }).then(response => {
            const { statusCode } = response;
            expect(statusCode).toBe(404);
            done();
        });
    });
});