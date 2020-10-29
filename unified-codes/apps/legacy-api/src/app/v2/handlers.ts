import { DgraphClient, DgraphClientStub, Txn } from 'dgraph-js-http';
import StatusCode from 'http-status-codes';

import { ItemsQueryParams, HealthSuccessParams } from './schemas';

import { DgraphResponse, Handler, Request, Reply } from '../types';
import { itemQueries } from '../queries';

const healthHandler: Handler = (_: Request, reply: Reply) => {
  reply.send({
    [HealthSuccessParams.MySql]: 'OK',
    [HealthSuccessParams.Api]: 'OK'
  });
};

const itemsHandler: Handler = (request: Request, reply: Reply) => {
  const { query } = request;

  const code = query[ItemsQueryParams.Code];
  const name = query[ItemsQueryParams.Name];
  const exact = query[ItemsQueryParams.Exact];

  const isValid: boolean = code || name;

  if (isValid) {
    const queryItems = (query, vars) => {
      const dgraphUrl: string = process.env.NX_DGRAPH_ENDPOINT;
      const dgraphClientStub: DgraphClientStub = new DgraphClientStub(dgraphUrl);
      const dgraphClient: DgraphClient = new DgraphClient(dgraphClientStub);
      const txn: Txn = dgraphClient.newTxn();

      txn.queryWithVars(query, vars).then((response: DgraphResponse) => {
        const { data } = response ?? {};
        const { query } = data ?? {};
        const jsonResponse = JSON.stringify(query?.map(({ code, description }) => ({ code, name: description })) ?? []);
        reply.code(StatusCode.OK).send(jsonResponse);
      });
    }

    // Query for single entity.
    if (code) {
      const query = itemQueries.get;
      const vars = { $code: code };
      queryItems(query, vars);
    }

    // Query from multiple entities.
    else if (name) {
      const query = exact ? itemQueries.searchExact : itemQueries.search;
      const vars = exact ? { $name: name } : { $term: `/^${name}.*$/i` };
      queryItems(query, vars);
    }

    else {
      const query = itemQueries.all;
      const vars = {};
      queryItems(query, vars);
    };

  } else {
    const statusCode = StatusCode.BAD_REQUEST;
    const response = {
      error: `Error: request must contain parameters: ${ItemsQueryParams.Code} or ${ItemsQueryParams.Name}.`
    };
    reply.code(statusCode).send(response);
  }
};

const versionHandler: Handler = (_: Request, reply: Reply) => {
  const versionShort = 'v2';
  const version = 'v2.0.0';
  reply.send({ versionShort, version });
};

export { healthHandler as health, itemsHandler as items, versionHandler as version };

export default {
  health: healthHandler,
  items: itemsHandler,
  version: versionHandler,
};
