import schemas from "./schemas";

import appData from "../package.json";
import testData from "../data.json";

const healthHandler = (_, reply) => {
  const [response] = Object.values(schemas.health.response);
  const responseKeys = Object.keys(response.properties);
  const responseValues = responseKeys.reduce(
    (acc, key) => ({ ...acc, [key]: "OK" }),
    {}
  );
  reply.send(responseValues);
};

const itemsHandler = (request, reply) => {
  const { query } = request;
  const { code } = query;
  const { [code]: name } = testData;
  const statusCode = !!name ? 200 : 404;
  const body =
    statusCode == 200 ? { code, name } : { error: `No item with code ${code}` };
  reply.code(statusCode).send(body);
};

const versionHandler = (_, reply) => {
  const { version } = appData;
  const [versionCode] = version.split(".");
  const versionShort = `v${versionCode}`;
  reply.send({ version, versionShort });
};

export {
  healthHandler as health,
  itemsHandler as items,
  versionHandler as version
};

export default {
  health: healthHandler,
  items: itemsHandler,
  version: versionHandler
};
