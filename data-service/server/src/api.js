import { ApolloServer } from 'apollo-server-fastify';
import fastify from 'fastify';
import fastifyCors from 'fastify-cors';
import { typeDefs } from './schema';
import { DgraphDataSource, RxNavDataSource } from './data';
import { resolvers } from './resolvers';
import Token from 'keycloak-auth-utils/lib/token';

const CLIENT_ID = 'unified-codes-data';
// const ADMIN_ROLE = 'ADMIN';

const getUser = (token) => {
  try {
    if (!token) {
      return;
    }

    const decodedToken = new Token(token, CLIENT_ID);
    if (decodedToken.isExpired()) {
      return;
    }
    // saving this for later
    // const hasAdminRole = decodedToken.hasRealmRole(ADMIN_ROLE);
    return decodedToken.content;
  } catch (err) {
    return null;
  }
};

const getToken = (headers) => {
  const tokenWithBearer = headers.authorization || '';
  const token = tokenWithBearer.split(' ')[1];

  return token;
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => {
    return {
      dgraph: new DgraphDataSource(),
      rxNav: new RxNavDataSource(),
    };
  },
  context: ({ req }) => {
    const token = getToken(req.headers);
    const user = getUser(token);

    return { user };
  },
});

const apolloPlugin = server.createHandler();
const corsPlugin = fastifyCors;

const graphApi = fastify({ logger: true });
graphApi.register(apolloPlugin);
graphApi.register(corsPlugin);

export default graphApi;
