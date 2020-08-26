import fastifyCors from 'fastify-cors';

import { KeyCloakIdentityProvider, AuthenticationService, AuthorisationService, JWTToken, JWT, FastifyApolloService } from '@unified-codes/data';

import schema from './schema';
import resolvers from './resolvers';
import { DgraphDataSource, RxNavDataSource} from './data';

const start = async () => {
  let fastifyServer;

  try {
    const dataSources = () => ({
      dgraph: new DgraphDataSource(),
      rxnav: new RxNavDataSource(),
    });

    const identityProviderConfig = {
      baseUrl: `${process.env.AUTHENTICATION_SERVICE_URL}:${process.env.AUTHETICATION_SERVICE_PORT}/${process.env.AUTHENTICATION_SERVICE_REALM}/${process.env.AUTHENTICATION_SERVICE_AUTH}`,
      clientId: process.env.AUTHENTICATION_SERVICE_CLIENT_ID,
      clientSecret: process.env.AUTHENTICATION_SERVICE_CLIENT_SECRET,
      grantType: process.env.AUTHENTICATION_SERVICE_GRANT_TYPE,
    };
  
    const identityProvider = new KeyCloakIdentityProvider(identityProviderConfig);
    const authenticator = new AuthenticationService(identityProvider);
    const authoriser = new AuthorisationService(identityProvider);

    const context = (request: any) => {
      try {
        const token: JWTToken = JWT.parseRequest(request);
        return { token, authenticator, authoriser };
      } catch (err) {
        return { authenticator, authoriser };
      }
    };

    const fastifyApolloService: FastifyApolloService = new FastifyApolloService(schema, resolvers, dataSources, context);

    const fastifyServer = fastifyApolloService.getFastifyServer({ logger: true }, [fastifyCors]);

    await fastifyServer.listen(parseInt(process.env.DATA_SERVICE_PORT));

  } catch (err) {
    if (fastifyServer) {
      fastifyServer.log.error(err);
    }
    process.exit(1);
  }
};

start();