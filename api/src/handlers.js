import { DgraphClient, DgraphClientStub } from 'dgraph-js-http';
import { OK as HTTP_OK, BAD_REQUEST as HTTP_BAD_REQUEST } from 'http-status-codes';

import schemas from './schemas';
import appData from '../package.json';

import { parseRequest, mapRequest, mapResponse } from './mappers';

const healthHandler = (_, reply) => {
  const [response] = Object.values(schemas.health.response);
  const responseKeys = Object.keys(response.properties);
  const responseValues = responseKeys.reduce((acc, key) => ({ ...acc, [key]: 'OK' }), {});
  reply.send(responseValues);
};

const itemsHandler = (request, reply) => {
  const { parameters } = parseRequest(request);
  const { invalid: invalidParameters } = parameters;
  const isValidRequest = invalidParameters.length > 0;
  if (isValidRequest) {
    const statusCode = HTTP_BAD_REQUEST;
    const body = `There are invalid query parameters in the request URL: '${String(
      invalidParameters
    )}'`;
    reply.code(statusCode).send(body);
  } else {
    const dgraphClient = new DgraphClient(
      new DgraphClientStub('http://localhost:8080')
    );
    const txn = dgraphClient.newTxn();
    txn.query(mapRequest(request)).then((response) => {
      const { data } = response;
      reply.code(HTTP_OK).send(mapResponse(data));
    });
  }
};

const versionHandler = (_, reply) => {
  const { version } = appData;
  const [versionCode] = version.split('.');
  const versionShort = `v${versionCode}`;
  reply.send({ version, versionShort });
};

export { healthHandler as health, itemsHandler as items, versionHandler as version };

export default {
  health: healthHandler,
  items: itemsHandler,
  version: versionHandler,
};
