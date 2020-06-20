
const schemas = require('./schemas');
const package = require('./package.json');

const health = (_, reply) => {
    const [response] = Object.values(schemas.health.response);
    const responseKeys = Object.keys(response.properties);
    const responseValues = responseKeys.reduce((acc, key) => ({ ...acc, [key]: 'OK' }), {});
    reply.send(responseValues);
}

const items = (request, reply) => {
    const { query } = request;
    const { code } = query;
    reply.send({ code });
}

const version = (_, reply) => {
    const { version: versionName } = package;
    const [versionCode] = package.version.split('.');
    const versionShort = `v${versionCode}`;
    reply.send({ version: versionName, versionShort });
}

module.exports = { health, items, version };