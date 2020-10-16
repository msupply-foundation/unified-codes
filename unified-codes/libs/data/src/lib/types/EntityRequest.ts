import IEntitySearch from './EntitySearch';

export interface IEntityRequest {
  filter: IEntitySearch;
  first: number;
  offset: number;
}

export default IEntityRequest;
