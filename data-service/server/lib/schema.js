"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.typeDefs = void 0;

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _apolloServerFastify = require("apollo-server-fastify");

function _templateObject() {
  var data = (0, _taggedTemplateLiteral2["default"])(["\n  type Entity {\n    type: String!\n    code: String\n    description: String!\n    has_property: [Property]\n    has_child: [Entity]\n  }\n\n  type Property {\n    type: String!\n    value: String!\n    has_property: [Property]\n  }\n\n  type Query {\n    \"Request an entity by code\"\n    entity(code: String!): Entity\n    \"Request all entities with optional filter - Default behaviour: return all medicinal_products\"\n    entities(filter: SearchFilter): [Entity]\n  }\n\n  input SearchFilter {\n    \"Search by Level in Product Hierarchy\"\n    type: String\n  }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

var typeDefs = (0, _apolloServerFastify.gql)(_templateObject());
exports.typeDefs = typeDefs;