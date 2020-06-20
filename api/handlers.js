const schemas = require("./schemas");
const package = require("./package.json");

const itemData = require("./data/items.json");

const health = (_, reply) => {
  const [response] = Object.values(schemas.health.response);
  const responseKeys = Object.keys(response.properties);
  const responseValues = responseKeys.reduce(
    (acc, key) => ({ ...acc, [key]: "OK" }),
    {}
  );
  reply.send(responseValues);
};

const items = (request, reply) => {
  const { query } = request;
  const { code } = query;
  const { [code]: name } = itemData;
  const statusCode = !!name ? 200 : 404;
  const body =
    statusCode == 200 ? { code, name } : { error: `No item with code ${code}` };
  reply.code(statusCode).send(body);
};

const version = (_, reply) => {
  const { version: versionName } = package;
  const [versionCode] = package.version.split(".");
  const versionShort = `v${versionCode}`;
  reply.send({ version: versionName, versionShort });
};

module.exports = { health, items, version };
