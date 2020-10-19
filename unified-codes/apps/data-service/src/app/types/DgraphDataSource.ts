import { RESTDataSource } from 'apollo-datasource-rest';

export class DgraphDataSource extends RESTDataSource {
  static headers: { [key: string]: string } = { 
    'Content-Type': 'application/graphql+-'
  };

  static paths: { [key: string]: string } = {
    query: 'query'
  };


  constructor() {
    super();
    this.baseURL = `${process.env.NX_DGRAPH_SERVICE_URL}:${process.env.NX_DGRAPH_SERVICE_PORT}`;
  }

  willSendRequest(request) {
    Object.entries(DgraphDataSource.headers).forEach(([key, value]) => request.headers.set(key, value));
  }

  async postQuery(query) {
    return this.post(DgraphDataSource.paths.query, query);
  }
}
