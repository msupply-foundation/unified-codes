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

export class RxNavDataSource extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'https://rxnav.nlm.nih.gov/REST';
    this.paths = { interactions: 'interaction/interaction.json' }
  }
  
  async getInteractions(rxCui) {
    return this.get(this.paths.interactions, { rxcui: rxCui });
  }
}