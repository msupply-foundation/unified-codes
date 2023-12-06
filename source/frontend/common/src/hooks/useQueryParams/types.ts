import { RecordWithId } from '@common/types';
import { Column } from '../../ui/layout/tables';

export interface FilterByConditionByType {
  string: 'equalTo' | 'like' | 'notEqualTo';
  stringArray: 'equalAny';
  date: 'beforeOrEqualTo' | 'afterOrEqualTo' | 'equalTo' | 'between';
  boolean: 'equalTo';
}

export type FilterRule = {
  [P in
    | FilterByConditionByType['boolean']
    | FilterByConditionByType['string']
    | FilterByConditionByType['stringArray']
    | FilterByConditionByType['date']]?: unknown;
};

export type FilterBy = Record<string, FilterRule | string | null>;

export interface FilterController {
  filterBy: FilterBy | null;

  onChangeStringRule: (key: string, value: string) => void;

  onChangeDateFilterRule: (
    key: string,
    condition: FilterByConditionByType['date'],
    value: Date | Date[]
  ) => void;

  onChangeStringFilterRule: (
    key: string,
    condition: FilterByConditionByType['string'],
    value: string
  ) => void;

  onChangeStringArrayFilterRule: (
    key: string,
    condition: FilterByConditionByType['stringArray'],
    value: string[]
  ) => void;

  onChangeBooleanFilterRule: (
    key: string,
    condition: FilterByConditionByType['boolean'],
    value: boolean
  ) => void;

  onClearFilterRule: (key: string) => void;
  onClearFilterListRule: (keys: string[]) => void;
}

export interface Pagination {
  page: number;
  offset: number;
  first: number;
}

export interface PaginationController extends Pagination {
  onChangePage: (newPage: number) => void;
  onChangeFirst: (newFirst: number) => void;
  nextPage: () => void;
}
export interface SortRule<T> {
  key: keyof T | string;
  isDesc?: boolean;
}

export interface SortBy<T> extends SortRule<T> {
  direction: 'asc' | 'desc';
  getSortValue?: (row: T) => string | number;
}
export interface SortController<T extends RecordWithId> {
  sortBy: SortBy<T>;
  onChangeSortBy: (newSortRule: Column<T>) => SortBy<T>;
}
