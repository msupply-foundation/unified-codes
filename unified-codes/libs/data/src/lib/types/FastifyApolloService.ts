
import fastify from 'fastify';
import { ApolloServer, Config } from 'apollo-server-fastify';

type TypeDefs = Config['typeDefs'];
type Resolvers = Config['resolvers'];
type DataSources = Config['dataSources'];
type Context = Config['context'];

export class FastifyApolloService {
  typeDefs: TypeDefs;
  resolvers: Resolvers;
  dataSources: DataSources;
  context: Context;

  constructor(
    typeDefs: TypeDefs,
    resolvers: Resolvers,
    dataSources: DataSources,
    context: Context,
  ) {
    this.typeDefs = typeDefs;
    this.resolvers = resolvers;
    this.dataSources = dataSources;
    this.context = context;
  }

  getApolloPlugin() { 
    return new ApolloServer({
      typeDefs: this.typeDefs,
      resolvers: this.resolvers,
      dataSources: this.dataSources,
      context: this.context,
    }).createHandler();
  }

  getFastifyServer(config, plugins?) {
    const fastifyServer = fastify(config);
    const apolloPlugin = this.getApolloPlugin();    
    [apolloPlugin, ...plugins].forEach((plugin) => {
      fastifyServer.register(plugin);
    });
    return fastifyServer;
  }
}

export default FastifyApolloService;