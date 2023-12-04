import { useState } from 'react';

import {
  Column,
  DEFAULT_RECORDS_PER_PAGE,
  RecordWithId,
} from '@uc-frontend/common';

import { FilterBy, FilterController } from '../useQueryParams';

interface QueryStateParams {
  initialSort?: { key: string; dir: 'desc' | 'asc' };
  initialFilter?: FilterBy;
  rowsPerPage?: number;
}

interface QueryState {
  page: number;
  sort: string;
  dir: 'asc' | 'desc';
  filterBy: FilterBy;
}

export const useQueryParamsState = ({
  initialSort,
  initialFilter = {},
  rowsPerPage = DEFAULT_RECORDS_PER_PAGE,
}: QueryStateParams = {}) => {
  const [queryState, setQueryState] = useState<QueryState>({
    page: 0,
    sort: initialSort?.key ?? '',
    dir: initialSort?.dir ?? 'asc',
    filterBy: initialFilter,
  });

  const updateSortQuery = <T extends RecordWithId>(column: Column<T>) => {
    if (column.key !== queryState.sort) {
      setQueryState(state => ({
        ...state,
        sort: column.key.toString(),
        dir: 'asc',
        page: 0,
      }));
    } else {
      const dir = column.sortBy?.direction === 'asc' ? 'desc' : 'asc';
      setQueryState(state => ({ ...state, dir }));
    }
  };

  const updatePaginationQuery = (page: number) => {
    setQueryState(state => ({ ...state, page }));
  };

  const updateFilterQuery = (newFilter: FilterBy) => {
    setQueryState(state => ({
      ...state,
      filterBy: { ...state.filterBy, ...newFilter },
    }));
  };

  const filter: FilterController = {
    onChangeStringRule: (key, value) => {
      if (value === '') {
        filter.onClearFilterRule(key);
      } else {
        updateFilterQuery({ [key]: value });
      }
    },
    onChangeStringFilterRule: (key, condition, value) => {
      if (value === '') {
        filter.onClearFilterRule(key);
      } else {
        updateFilterQuery({ [key]: { [condition]: value } });
      }
    },
    onChangeStringArrayFilterRule: (key, condition, value) => {
      if (!value.length) {
        filter.onClearFilterRule(key);
      } else {
        updateFilterQuery({ [key]: { [condition]: value } });
      }
    },
    onChangeBooleanFilterRule: (key, condition, value) => {
      updateFilterQuery({ [key]: { [condition]: value } });
    },
    onChangeDateFilterRule: (key, condition, value) => {
      if (Array.isArray(value)) {
        const betweenDates = {
          afterOrEqualTo: value[0],
          beforeOrEqualTo: value[1],
        };
        updateFilterQuery({ [key]: betweenDates });
      } else {
        updateFilterQuery({ [key]: { [condition]: value } });
      }
    },
    onClearFilterRule: key => {
      setQueryState(state => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [key]: _filterToClear, ...remainingFilters } = state.filterBy;
        return { ...state, filterBy: remainingFilters };
      });
    },
    onClearFilterListRule: keys => {
      setQueryState(state => {
        const filters = { ...state.filterBy };
        keys.forEach(key => delete filters[key]);
        return { ...state, filterBy: filters };
      });
    },
    filterBy: queryState.filterBy,
  };
  const queryParams = {
    page: queryState.page,
    offset: queryState.page * rowsPerPage,
    first: rowsPerPage,
    sortBy: {
      key: queryState.sort,
      direction: queryState.dir,
      isDesc: queryState.dir === 'desc',
    },
    filterBy: filter.filterBy,
  };

  return {
    queryParams,
    queryState,
    updateSortQuery,
    updatePaginationQuery,
    updateFilterQuery,
    filter,
  };
};
