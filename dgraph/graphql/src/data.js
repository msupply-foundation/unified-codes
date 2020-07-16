import { RESTDataSource } from 'apollo-datasource-rest';

export class DgraphDataSource extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'http://localhost:8080';
    this.headers = { 'Content-Type': 'application/graphql+-' };
    this.paths = { query: 'query' };
  };
  
  willSendRequest(request) {
    Object.entries(this.headers).forEach(([key, value]) => request.headers.set(key, value));
  }
  
  async postQuery(query) {
    return this.post(this.paths.query, query);
  }
}
