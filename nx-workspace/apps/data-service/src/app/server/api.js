import { ApolloServer } from 'apollo-server-fastify';
import fastify from 'fastify';
import fastifyCors from 'fastify-cors';
import { typeDefs } from './schema';
import { DgraphDataSource, RxNavDataSource } from './data';
import { resolvers } from './resolvers';
import { User } from './classes/user';
import fetch from 'node-fetch';

const AUTH_URL = 'http://127.0.0.1:9990/auth/realms/unified-codes';

const getToken = (headers) => {
  const tokenWithBearer = headers?.authorization || '';
  const token = tokenWithBearer.split(' ')[1];

  return token;
};

const getPublicKey = async () => {
  const response = await fetch(AUTH_URL);
  const openIdDetails = await response.json();
  const publicKey = `-----BEGIN PUBLIC KEY-----
${openIdDetails?.public_key}
-----END PUBLIC KEY-----`;

  return publicKey;
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
  context: async ({ request }) => {
    const token = getToken(request?.headers || {});
    const publicKey = await getPublicKey();
    const user = new User(token, publicKey);

    return { user };
  },
});

const apolloPlugin = server.createHandler();
const corsPlugin = fastifyCors;

const graphApi = fastify({ logger: true });
graphApi.register(apolloPlugin);
graphApi.register(corsPlugin);

export default graphApi;
