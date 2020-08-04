'use strict';

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports['default'] = void 0;

var _fastify = _interopRequireDefault(require('fastify'));

var _schemas = _interopRequireDefault(require('./schemas'));

var _handlers = _interopRequireDefault(require('./handlers'));

var api = (0, _fastify['default'])({
  logger: true,
});
api.get('/health', {
  schema: _schemas['default'].health,
  handler: _handlers['default'].health,
});
api.get('/items', {
  schema: _schemas['default'].items,
  handler: _handlers['default'].items,
});
api.get('/version', {
  schema: _schemas['default'].version,
  handler: _handlers['default'].version,
});
var _default = api;
exports['default'] = _default;
