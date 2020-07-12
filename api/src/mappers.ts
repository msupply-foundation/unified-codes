import { items as itemQueries } from './queries';

import { Request, Query, DgraphResponse } from './types';

const PARAMETERS: { [key: string]: string[] } = {
  '/items': ['code', 'name', 'exact'],
};

/**
 * Parse query parameters.
 *
 * @param  {FastifyRequest} request Request object.
 * @return {Object}                 Object containing valid, invalid parameters.
 */
export const parseRequest = (
  request: Request
): { parameters: { valid: string[]; invalid: string[] } } => {
  const { url }: { url?: string } = request.raw;
  const [baseUrl]: string[] = url.split('?') as string[];
  const whitelist: string[] = PARAMETERS[baseUrl];
  const { query }: { query: Query } = request;

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
export const mapRequest = (request: Request): { query: string; vars: object } => {
  const { query }: { query: Query } = request;
  const { code, name, exact }: { code?: string; name?: string; exact?: boolean } = query;
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
export const mapResponse = (response: DgraphResponse): string => {
  const { data }: { data?: { query: [] } } = response ?? {};
  const { query }: { query?: [] } = data ?? {};
  return JSON.stringify(query?.map(({ code, description }) => ({ code, name: description })) ?? []);
};
