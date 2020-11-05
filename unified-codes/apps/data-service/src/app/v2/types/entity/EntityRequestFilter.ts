import { EEntityField, EEntityType } from './Entity';

export interface IEntityRequestFilter {
  code: string;
  description: string;
  orderDesc: boolean;
  orderBy: EEntityField | string;
  type: EEntityType | EEntityType[];
}

export default IEntityRequestFilter;
