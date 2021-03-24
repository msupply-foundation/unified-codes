import IEntityRequestFilter from './EntityRequestFilter';

export interface IEntityRequest {
  filter: IEntityRequestFilter;
  first: number;
  offset: number;
}

export default IEntityRequest;
