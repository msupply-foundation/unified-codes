import { items as itemQueries } from './queries';
import { FastifyRequest, DefaultQuery } from 'fastify';
import { IncomingMessage } from 'http';
import { Response } from 'dgraph-js-http';

type GraphResponse = Response & { data: { query: [] }};

const PARAMETERS: { [key: string]: string[] } = {
  '/items': ['code', 'name', 'exact'],
};

const parseBool = (val?: string): boolean => val?.toLowerCase() == 'true';

/**
 * Parse query parameters.
 *
 * @param  {FastifyRequest} request Request object.
 * @return {Object}                 Object containing valid, invalid parameters.
 */
export const parseRequest = (
  request: FastifyRequest
): { parameters: { valid: string[]; invalid: string[] } } => {
  const { url }: { url: string } = request.raw as IncomingMessage & { url: string };
  const [baseUrl]: string[] = url.split('?') as string[];
  const whitelist: string[] = PARAMETERS[baseUrl];
  const { query }: { query: DefaultQuery } = request;

  return {
    parameters: {
      valid: Object.keys(query).filter((param) => whitelist.includes(param)),
      invalid: Object.keys(query).filter((param) => !whitelist.includes(param)),
    },
  };
};

/**
 * Map API request to GraphQL+- payload. Query parameters are assumed valid.
 *
 * @param  {FastifyRequest} request REST api request.
 * @return {Object}                 Object containing GraphQL+- request payload and variables.
 */
export const mapRequest = (request: FastifyRequest): { query: string; vars: object } => {
  const { query }: { query: DefaultQuery } = request;
  const { code, name }: { code: string; name: string } = query as { code: string; name: string };
  const exact: boolean = parseBool(query.exact);
  if (code) return { query: itemQueries.get, vars: { $code: code } };
  else if (name) {
    if (exact) return { query: itemQueries.searchExact, vars: { $name: name } };
    else return { query: itemQueries.search, vars: { $term: `/^${name}.*$/i` } };
  } else return { query: itemQueries.all, vars: {} };
};

/**
 *
 * Map Dgraph response to valid v1 API JSON payload.
 *
 * @param  {Object} response GraphQL+- response received from Dgraph server.
 * @return {String}          Stringified JSON object complying to v1 schema.
 *
 * Example response format:
 *
 * [
 *   {
 *     code: 3692b4bf,
 *     name: Amoxicillin (trihydrate) 500mg solid oral dosage form"
 *   },
 *   {
 *     code: 367734bf,
 *     name: Amoxicillin & clavulanic acid 125mg &31.25mg /5mL oral liquid"
 *   }
 * ]
 */
export const mapResponse = (response: Response): string => {
  const { data }: { data?: { query: [] }} = (response as GraphResponse) ?? {};
  const { query }: { query?: [] } = data ?? {};
  return JSON.stringify(query?.map(({ code, description }) => ({ code, name: description })) ?? []);
};
