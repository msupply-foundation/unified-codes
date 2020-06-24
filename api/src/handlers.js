import schemas from "./schemas";

import appData from "../package.json";
import testData from "../data.json";

const STATUS_CODES = {
  OK: 200,
  NOT_FOUND: 404,
}

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
  if (code) {
    const isValidCode = Object.keys(testData).includes(code);
    const statusCode = isValidCode ? STATUS_CODES.OK : STATUS_CODES.NOT_FOUND;
    const body =
      isValidCode ? { code, name: testData[code] } : { error: `No item with code ${code}` };
    reply.code(statusCode).send(body);
  } else {
    const statusCode = STATUS_CODES.OK;
    const body = Object.entries(testData).map(([key, value]) => ({ code: key, name: value }));
    reply.code(statusCode).send(body);
  }
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
