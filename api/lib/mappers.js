'use strict';

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.mapResponse = exports.mapRequest = exports.parseRequest = void 0;

var _slicedToArray2 = _interopRequireDefault(require('@babel/runtime/helpers/slicedToArray'));

var _queries = require('./queries');

var PARAMETERS = {
  '/items': ['code', 'name', 'exact'],
};
/**
 * Parse query parameters.
 *
 * @param  {FastifyRequest} request Request object.
 * @return {Object}                 Object containing valid, invalid parameters.
 */

var parseRequest = function parseRequest(request) {
  var url = request.raw.url;

  var _ref = url.split('?'),
    _ref2 = (0, _slicedToArray2['default'])(_ref, 1),
    baseUrl = _ref2[0];

  var whitelist = PARAMETERS[baseUrl];
  var query = request.query;
  return {
    parameters: {
      valid: Object.keys(query).filter(function (param) {
        return whitelist.includes(param);
      }),
      invalid: Object.keys(query).filter(function (param) {
        return !whitelist.includes(param);
      }),
    },
  };
};
/**
 * Map API request to GraphQL+- payload. Query parameters are assumed valid.
 *
 * @param  {FastifyRequest} request REST api request.
 * @return {Object}                 Object containing GraphQL+- request payload and variables.
 */

exports.parseRequest = parseRequest;

var mapRequest = function mapRequest(request) {
  var query = request.query;
  var code = query.code,
    name = query.name,
    exact = query.exact;
  if (code)
    return {
      query: _queries.items.get,
      vars: {
        $code: code,
      },
    };
  else if (name) {
    if (exact)
      return {
        query: _queries.items.searchExact,
        vars: {
          $name: name,
        },
      };
    else
      return {
        query: _queries.items.search,
        vars: {
          $term: '/^'.concat(name, '.*$/i'),
        },
      };
  } else
    return {
      query: _queries.items.all,
      vars: {},
    };
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

exports.mapRequest = mapRequest;

var mapResponse = function mapResponse(response) {
  var _query$map;

  var _ref3 = response !== null && response !== void 0 ? response : {},
    data = _ref3.data;

  var _ref4 = data !== null && data !== void 0 ? data : {},
    query = _ref4.query;

  return JSON.stringify(
    (_query$map =
      query === null || query === void 0
        ? void 0
        : query.map(function (_ref5) {
            var code = _ref5.code,
              description = _ref5.description;
            return {
              code: code,
              name: description,
            };
          })) !== null && _query$map !== void 0
      ? _query$map
      : []
  );
};

exports.mapResponse = mapResponse;
