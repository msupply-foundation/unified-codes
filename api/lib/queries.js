'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports['default'] = exports.items = void 0;
var items = {
  get:
    'query vars($code: string) {\n    query (func: has(code)) @filter(eq(code, $code)) {\t\n      code\n      description\n    }\n  }',
  search:
    'query vars($term: string) {\n    query(func: has(code)) @filter(regexp(description, $term) AND eq(type, "unit_of_use")) {\n      code\n      description\n    }\n  }',
  searchExact:
    'query vars($name: string) {\n    query(func: has(code)) @filter(eq(description, $name) AND eq(type, "unit_of_use")) {\n      code\n      description\n    }\n  }',
  all:
    '{\n    query(func: has(code)) @filter(eq(type,"unit_of_use")) {\n      code\n      description\n    }\n  }',
};
exports.items = items;
var _default = {
  items: items,
};
exports['default'] = _default;
