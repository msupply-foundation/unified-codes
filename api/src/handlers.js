import schemas from "./schemas";

import appData from "../package.json";
import testData from "../data.json";

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
  const { [code]: name } = testData;
  const statusCode = !!name ? 200 : 404;
  const body =
    statusCode == 200 ? { code, name } : { error: `No item with code ${code}` };
  reply.code(statusCode).send(body);
};

const version = (_, reply) => {
  const { version: versionName } = appData;
  const [versionCode] = versionName.split(".");
  const versionShort = `v${versionCode}`;
  reply.send({ version: versionName, versionShort });
};

module.exports = { health, items, version };
