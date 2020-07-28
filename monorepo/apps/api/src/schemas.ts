import S from 'fluent-schema';

import { Schema } from './types';

const healthSchema: Schema = {
  response: {
    200: S.object().prop('mysql', S.string()).prop('api', S.string()),
  },
};

const itemsSchema: Schema = {
  querystring: S.object()
    .prop('code', S.string())
    .prop('name', S.string())
    .prop('exact', S.boolean()),
  response: {
    200: S.object(),
    404: S.object().prop('error', S.string()),
  },
};

const versionSchema: Schema = {
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
