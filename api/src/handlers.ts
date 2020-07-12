import { DgraphClient, DgraphClientStub, Txn, Response } from 'dgraph-js-http';
import { FastifyRequest, FastifyReply, RequestHandler } from 'fastify';
import { ServerResponse } from 'http';
import { OK as HTTP_OK, BAD_REQUEST as HTTP_BAD_REQUEST } from 'http-status-codes';

import appData from '../package.json';

import { health as healthSchema } from './schemas';
import { parseRequest, mapRequest, mapResponse } from './mappers';

const healthHandler: RequestHandler = (_: FastifyRequest, reply: FastifyReply<ServerResponse>) => {
  const { response: responseSchema }: { response: { [key: string]: object } } = healthSchema;
  const [{ properties: responseProperties }]: { properties: object }[] = Object.values(
    responseSchema
  ) as { properties: object }[];
  const responseKeys: string[] = Object.keys(responseProperties);
  const responseValues: { [key: string]: string } = responseKeys.reduce(
    (acc, key) => ({ ...acc, [key]: 'OK' }),
    {}
  );
  reply.send(responseValues);
};

const itemsHandler: RequestHandler = (
  request: FastifyRequest,
  reply: FastifyReply<ServerResponse>
) => {
  const { parameters }: { parameters: { valid: string[]; invalid: string[] } } = parseRequest(
    request
  );
  const { invalid: invalidParameters }: { invalid: string[] } = parameters;
  const isValidRequest: boolean = invalidParameters.length > 0;
  if (isValidRequest) {
    const statusCode: number = HTTP_BAD_REQUEST;
    const body: string = `There are invalid query parameters in the request URL: '${String(
      invalidParameters
    )}'`;
    reply.code(statusCode).send(body);
  } else {
    const dgraphClientStub: DgraphClientStub = new DgraphClientStub('http://localhost:8080');
    const dgraphClient: DgraphClient = new DgraphClient(dgraphClientStub);
    const txn: Txn = dgraphClient.newTxn();
    const { query, vars }: { query: string; vars: object } = mapRequest(request);
    txn.queryWithVars(query, vars).then((response: Response) => {
      const jsonResponse = mapResponse(response);
      reply.code(HTTP_OK).send(jsonResponse);
    });
  }
};

const versionHandler: RequestHandler = (_: FastifyRequest, reply: FastifyReply<ServerResponse>) => {
  const { version }: { version: string } = appData;
  const [versionCode]: string[] = version.split('.');
  const versionShort: string = `v${versionCode}`;
  reply.send({ version, versionShort });
};

export { healthHandler as health, itemsHandler as items, versionHandler as version };

export default {
  health: healthHandler,
  items: itemsHandler,
  version: versionHandler,
};
