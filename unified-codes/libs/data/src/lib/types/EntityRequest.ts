import { EEntityField, EEntityType } from './Entity';

export interface IEntitySort {
  field: EEntityField;
  descending: boolean;
}

export interface IEntityFilter {
  code: string;
  description: string;
  orderBy: IEntitySort;
  type: EEntityType;
}

export interface IEntityRequest {
  filter: IEntityFilter;
  first: number;
  offset: number;
}

export default IEntityRequest;
