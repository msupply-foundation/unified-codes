import { RESTDataSource } from 'apollo-datasource-rest';

export class DgraphDataSource extends RESTDataSource {
  headers: { [key: string]: string };
  paths: { [key: string]: string };

  constructor() {
    super();
    this.baseURL = `${process.env.NX_DGRAPH_SERVICE_URL}:${process.env.NX_DGRAPH_SERVICE_PORT}`;
    this.headers = { 'Content-Type': 'application/graphql+-' };
    this.paths = { query: 'query' };
  }

  willSendRequest(request) {
    Object.entries(this.headers).forEach(([key, value]) => request.headers.set(key, value));
  }

  async postQuery(query) {
    return this.post(this.paths.query, query);
  }
}

export class RxNavDataSource extends RESTDataSource {
  paths: { [key: string]: string };

  constructor() {
    super();
    this.baseURL = `${process.env.NX_RXNAV_SERVICE_URL}:${process.env.NX_RXNAV_SERVICE_PORT}/${process.env.NX_RXNAV_SERVICE_REST}`;
    this.paths = { interactions: '/interaction/interaction.json' };
  }

  async getInteractions(rxCui) {
    return this.get(this.paths.interactions, { rxcui: rxCui });
  }
}
