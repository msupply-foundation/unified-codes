import api from "../src/api";

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
    test("Items endpoint response has status code 200", done => {
        api.inject({
            method: 'GET',
            url: '/items'
        }).then(response => {
            const { statusCode } = response;
            expect(statusCode).toBe(200);
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