"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.resolvers = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var queries = {
  entity: function entity(code) {
    return "{\n        query(func: eq(code, ".concat(code, "), first: 1) @recurse(loop: false)  {\n          code\n          description\n          type\n          value\n          has_child\n          has_property\n        }\n      }");
  },
  entities: function entities(type) {
    return "{\n      query(func: eq(type, ".concat(type, ")) @filter(has(description)) @recurse(loop: false)  {\n        code\n        description\n        type\n        value\n        has_child\n        has_property\n      }\n    }");
  }
};
var resolvers = {
  Query: {
    entity: function () {
      var _entity = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(_source, _args, _ref) {
        var dataSources, code, query, response, _response$data$query, entity;

        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                dataSources = _ref.dataSources;
                code = _args.code;
                query = queries.entity(code);
                _context.next = 5;
                return dataSources.dgraph.postQuery(query);

              case 5:
                response = _context.sent;
                _response$data$query = (0, _slicedToArray2["default"])(response.data.query, 1), entity = _response$data$query[0];
                return _context.abrupt("return", entity);

              case 8:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      function entity(_x, _x2, _x3) {
        return _entity.apply(this, arguments);
      }

      return entity;
    }(),
    entities: function () {
      var _entities = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(_source, _args, _ref2) {
        var _args$filter;

        var dataSources, _ref3, _ref3$type, type, query, response;

        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                dataSources = _ref2.dataSources;
                _ref3 = (_args$filter = _args === null || _args === void 0 ? void 0 : _args.filter) !== null && _args$filter !== void 0 ? _args$filter : {}, _ref3$type = _ref3.type, type = _ref3$type === void 0 ? 'medicinal_product' : _ref3$type;
                query = queries.entities(type);
                _context2.next = 5;
                return dataSources.dgraph.postQuery(query);

              case 5:
                response = _context2.sent;
                return _context2.abrupt("return", response.data.query);

              case 7:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      function entities(_x4, _x5, _x6) {
        return _entities.apply(this, arguments);
      }

      return entities;
    }()
  }
};
exports.resolvers = resolvers;
var _default = resolvers;
exports["default"] = _default;