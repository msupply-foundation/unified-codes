import { EEntityType } from './Entity';

import IEntitySort from './EntitySort';

export interface IEntitySearch {
  code: string;
  description: string;
  orderBy: IEntitySort;
  type: EEntityType | EEntityType[];
}

export default IEntitySearch;
