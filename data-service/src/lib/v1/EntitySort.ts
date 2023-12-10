import { EEntityField } from './Entity';

export enum EEntitySortOrder {
  Asc = 'orderasc',
  Desc = 'orderdesc',
}

export interface IEntitySort {
  field: EEntityField;
  descending: boolean;
}

export default IEntitySort;
