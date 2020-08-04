'use strict';

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports['default'] = exports.version = exports.items = exports.health = void 0;

var _fluentSchema = _interopRequireDefault(require('fluent-schema'));

var healthSchema = {
  response: {
    200: _fluentSchema['default']
      .object()
      .prop('mysql', _fluentSchema['default'].string())
      .prop('api', _fluentSchema['default'].string()),
  },
};
exports.health = healthSchema;
var itemsSchema = {
  querystring: _fluentSchema['default']
    .object()
    .prop('code', _fluentSchema['default'].string())
    .prop('name', _fluentSchema['default'].string())
    .prop('exact', _fluentSchema['default']['boolean']()),
  response: {
    200: _fluentSchema['default'].object(),
    404: _fluentSchema['default'].object().prop('error', _fluentSchema['default'].string()),
  },
};
exports.items = itemsSchema;
var versionSchema = {
  response: {
    200: _fluentSchema['default']
      .object()
      .prop('version', _fluentSchema['default'].string())
      .prop('versionShort', _fluentSchema['default'].string()),
  },
};
exports.version = versionSchema;
var _default = {
  health: healthSchema,
  items: itemsSchema,
  version: versionSchema,
};
exports['default'] = _default;
