import { ApolloServer, Config } from 'apollo-server-fastify';

import Authenticator from './Authenticator';
import AuthorisationService from './AuthorisationService';
import IdentityProvider from './IdentityProvider';
import JWT, { JWTToken } from './JWT';
import User from './User';

type TypeDefs = Config['typeDefs'];
type Resolvers = Config['resolvers'];
type DataSources = Config['dataSources'];
export class ApolloService {
  typeDefs: TypeDefs;
  resolvers: Resolvers;
  dataSources: DataSources;

  authenticator: Authenticator;
  authorisationService: AuthorisationService;

  constructor(typeDefs: TypeDefs, resolvers: Resolvers, dataSources: DataSources, identityProvider: IdentityProvider) {
    this.typeDefs = typeDefs;
    this.resolvers = resolvers;
    this.dataSources = dataSources;

    this.authenticator = new Authenticator(identityProvider);
    this.authorisationService = new AuthorisationService(identityProvider);
  }

  getUser(request) {
    const token: JWTToken = JWT.parseRequest(request);
    const user: User = new User(token);
    return user;
  }

  getServer() {
    return new ApolloServer({
      typeDefs: this.typeDefs,
      resolvers: this.resolvers,
      dataSources: this.dataSources,
      context: async ({ request }) => {
        const user = this.getUser(request);
        return {
          authenticator: this.authenticator,
          authorisationService: this.authorisationService,
          user,
        };
      },
    });
  }
}

export default ApolloService;
