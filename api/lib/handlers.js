'use strict';

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports['default'] = exports.version = exports.items = exports.health = void 0;

var _defineProperty2 = _interopRequireDefault(require('@babel/runtime/helpers/defineProperty'));

var _slicedToArray2 = _interopRequireDefault(require('@babel/runtime/helpers/slicedToArray'));

var _dgraphJsHttp = require('dgraph-js-http');

var _httpStatusCodes = require('http-status-codes');

var _package = _interopRequireDefault(require('../package.json'));

var _schemas = require('./schemas');

var _mappers = require('./mappers');

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly)
      symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
    keys.push.apply(keys, symbols);
  }
  return keys;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        (0, _defineProperty2['default'])(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }
  return target;
}

var healthHandler = function healthHandler(_, reply) {
  var responseSchema = _schemas.health.response;

  var _ref = Object.values(responseSchema),
    _ref2 = (0, _slicedToArray2['default'])(_ref, 1),
    responseProperties = _ref2[0].properties;

  var responseKeys = Object.keys(responseProperties);
  var responseValues = responseKeys.reduce(function (acc, key) {
    return _objectSpread(
      _objectSpread({}, acc),
      {},
      (0, _defineProperty2['default'])({}, key, 'OK')
    );
  }, {});
  reply.send(responseValues);
};

exports.health = healthHandler;

var itemsHandler = function itemsHandler(request, reply) {
  var _parseRequest = (0, _mappers.parseRequest)(request),
    parameters = _parseRequest.parameters;

  var invalidParameters = parameters.invalid;
  var isValidRequest = invalidParameters.length > 0;

  if (isValidRequest) {
    var statusCode = _httpStatusCodes.BAD_REQUEST;
    var body = "There are invalid query parameters in the request URL: '".concat(
      String(invalidParameters),
      "'"
    );
    reply.code(statusCode).send(body);
  } else {
    var dgraphClientStub = new _dgraphJsHttp.DgraphClientStub('http://localhost:8080');
    var dgraphClient = new _dgraphJsHttp.DgraphClient(dgraphClientStub);
    var txn = dgraphClient.newTxn();

    var _mapRequest = (0, _mappers.mapRequest)(request),
      query = _mapRequest.query,
      vars = _mapRequest.vars;

    txn.queryWithVars(query, vars).then(function (response) {
      var jsonResponse = (0, _mappers.mapResponse)(response);
      reply.code(_httpStatusCodes.OK).send(jsonResponse);
    });
  }
};

exports.items = itemsHandler;

var versionHandler = function versionHandler(_, reply) {
  var version = _package['default'].version;

  var _version$split = version.split('.'),
    _version$split2 = (0, _slicedToArray2['default'])(_version$split, 1),
    versionCode = _version$split2[0];

  var versionShort = 'v'.concat(versionCode);
  reply.send({
    version: version,
    versionShort: versionShort,
  });
};

exports.version = versionHandler;
var _default = {
  health: healthHandler,
  items: itemsHandler,
  version: versionHandler,
};
exports['default'] = _default;
