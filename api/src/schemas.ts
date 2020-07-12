import S from 'fluent-schema';
import { RouteSchema, JSONSchema } from 'fastify';

type EndpointSchema = RouteSchema & {
  response: {
    [code: number]: JSONSchema;
    [code: string]: JSONSchema;
  };
};

const healthSchema: EndpointSchema = {
  response: {
    200: S.object().prop('mysql', S.string()).prop('api', S.string()),
  },
};

const itemsSchema: EndpointSchema = {
  querystring: S.object()
    .prop('code', S.string())
    .prop('name', S.string())
    .prop('exact', S.boolean()),
  response: {
    200: S.object(),
    404: S.object().prop('error', S.string()),
  },
};

const versionSchema: EndpointSchema = {
  response: {
    200: S.object().prop('version', S.string()).prop('versionShort', S.string()),
  },
};

export { healthSchema as health, itemsSchema as items, versionSchema as version };

export default {
  health: healthSchema,
  items: itemsSchema,
  version: versionSchema,
};
