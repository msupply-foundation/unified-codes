import { ApolloServer } from 'apollo-server-fastify';
import fastify from 'fastify';
import fastifyCors from 'fastify-cors';
import { typeDefs } from './schema';
import { DgraphDataSource, RxNavDataSource } from './data';
import { resolvers } from './resolvers';
import { User } from './classes/user';
// import fetch from 'node-fetch';

const getToken = (headers) => {
  const tokenWithBearer = headers.authorization || '';
  const token = tokenWithBearer.split(' ')[1];

  return token;
};

const getUser = (request) => {
  const token = getToken(request.headers);
  const user = new User(token);

  return user;
};

// const fetchPublicKey = async () => {
//   const response = await fetch(AUTH_BASE_URL);
//   const authConfig = await response.json();

//   return `-----BEGIN PUBLIC KEY-----
// ${authConfig.public_key}
// -----END PUBLIC KEY-----`;
// };

//const publicKey = await fetchPublicKey();

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
    const user = getUser(req);

    return { user };
  },
});

const apolloPlugin = server.createHandler();
const corsPlugin = fastifyCors;

const graphApi = fastify({ logger: true });
graphApi.register(apolloPlugin);
graphApi.register(corsPlugin);

export default graphApi;
