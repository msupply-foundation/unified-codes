"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _apolloServerFastify = require("apollo-server-fastify");

var _fastify = _interopRequireDefault(require("fastify"));

var _schema = require("./schema");

var _data = require("./data");

var _resolvers = require("./resolvers");

var server = new _apolloServerFastify.ApolloServer({
  typeDefs: _schema.typeDefs,
  resolvers: _resolvers.resolvers,
  dataSources: function dataSources() {
    return {
      dgraph: new _data.DgraphDataSource(),
      rxNav: new _data.RxNavDataSource()
    };
  }
});
var graphApi = (0, _fastify["default"])({
  logger: true
});
graphApi.register(server.createHandler());
var _default = graphApi;
exports["default"] = _default;