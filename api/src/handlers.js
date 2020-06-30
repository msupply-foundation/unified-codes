import schemas from './schemas';

import appData from '../package.json';
import * as HttpStatus from 'http-status-codes';

import { FindInvalidQueryParams, PrepareDgraphItemQuery, DGraphResponseMap } from './queryHelpers';

const dgraph = require('dgraph-js-http');

const ITEMS_PARAM_WHITELIST = ['code', 'exact', 'fields', 'fuzzy', 'inclusive', 'name', 'search'];

const healthHandler = (_, reply) => {
  const [response] = Object.values(schemas.health.response);
  const responseKeys = Object.keys(response.properties);
  const responseValues = responseKeys.reduce((acc, key) => ({ ...acc, [key]: 'OK' }), {});
  reply.send(responseValues);
};

const itemsHandler = (request, reply) => {
  const { query } = request;
  const badQueryParams = FindInvalidQueryParams(query, ITEMS_PARAM_WHITELIST);
  if (badQueryParams.length) {
    const statusCode = HttpStatus.BAD_REQUEST;
    const body = `There are invalid query parameters in the request URL: '${String(
      badQueryParams
    )}'`;
    reply.code(statusCode).send(body);
  } else {
    const clientStub = new dgraph.DgraphClientStub('http://localhost:8080', false);
    const dgraphClient = new dgraph.DgraphClient(clientStub);
    const dGraphQuery = PrepareDgraphItemQuery(query);
    const txn = dgraphClient.newTxn();
    const res = txn.query(dGraphQuery).then((res) => {
      const { data } = res;
      const mappedResponse = DGraphResponseMap(data);

      reply.code(HttpStatus.OK).send(mappedResponse);
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
