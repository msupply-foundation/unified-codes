import { RESTDataSource } from 'apollo-datasource-rest';

export class dgraph extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'http://localhost:8080';
  }

  willSendRequest(request) {
    request.headers.set('Content-Type', 'application/graphql+-');
  }

  async postQuery(dgraphQuery) {
    const path = 'query';

    return this.post(path, dgraphQuery);
  }
}
