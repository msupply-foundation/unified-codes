"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.queries = void 0;
var queries = {
  entity: function entity(code) {
    return "{\n        query(func: eq(code, ".concat(code, ")) @recurse(loop: false)  {\n          code\n          description\n          type\n          value\n          has_child\n          has_property\n        }\n      }");
  },
  entities: function entities(type) {
    return "{\n      query(func: eq(type, ".concat(type, ")) @filter(has(description)) @recurse(loop: false)  {\n        code\n        description\n        type\n        value\n        has_child\n        has_property\n      }\n    }");
  }
};
exports.queries = queries;
var _default = {
  queries: queries
};
exports["default"] = _default;