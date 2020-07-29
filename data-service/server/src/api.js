import { ApolloServer } from 'apollo-server-fastify';
import fastify from 'fastify';
import fastifyCors from 'fastify-cors';
import { typeDefs } from './schema';
import { DgraphDataSource, RxNavDataSource } from './data';
import { resolvers } from './resolvers';
import jwt from 'jsonwebtoken';
// import fetch from 'node-fetch';

const AUTH_BASE_URL = 'http://127.0.0.1:9990/auth/realms/unified-codes';
const PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAklymafhy/J8Rat1A5bta042a5fRFygFsA/E0PHvT0Agxg83DbCztdMa4sr1HFznxah1e+XGwt2Iz3VI7sXrMwdcGxJHyDt+6BDk/KAu2Cy1wwtHvx3Y7U8+xHs47ht5w5Co9Mos9QCcWc0ACFW2divK9nHklVI9dTINd/KAYk35t8luXbUesLyqJRmexlS1wvn6WoUeb5nnge5LCNNtZNe56Ay4Ihw8uH1H71BdvBM0r0lI4ciczcyrJDchd5bsIWZH0b8WNWjWUQgc/Fhd4kbizlM6os7JkuZ7V3DgA0Lzy8j2W1ugQS0R3y1lHEuivzztwEHu4UXBTN0pYR7hWVQIDAQAB
-----END PUBLIC KEY-----`;

const getUser = (token) => {
  try {
    if (!token) {
      return;
    }
    //const publicKey = await fetchPublicKey();
    const decodedToken = jwt.verify(token, PUBLIC_KEY, { algorithms: ['RS256'] });

    // saving this for later
    // const hasAdminRole = decodedToken.hasRealmRole(ADMIN_ROLE);
    const { realm_access, name, given_name, family_name } = decodedToken;
    const roles = realm_access ? realm_access.roles || [] : [];
    const user = { name, given_name, family_name, roles };

    return user;
  } catch (err) {
    console.warn(`Error: ${err.name} - ${err.message}`);
    // For example:
    //  err.name: "TokenExpiredError"
    //  err.message: "jwt expired"
    return null;
  }
};

const getToken = (headers) => {
  const tokenWithBearer = headers.authorization || '';
  const token = tokenWithBearer.split(' ')[1];

  return token;
};

// const fetchPublicKey = async () => {
//   const response = await fetch(AUTH_BASE_URL);
//   const authConfig = await response.json();

//   return `-----BEGIN PUBLIC KEY-----
// ${authConfig.public_key}
// -----END PUBLIC KEY-----`;
// };

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
