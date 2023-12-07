import { UrlQueryObject, useUrlQuery } from './useUrlQuery';
import { Column, RecordWithId } from '@uc-frontend/common';
import {
  FilterBy,
  FilterByConditionByType,
  FilterController,
} from '../useQueryParams';

// This hook uses the state of the url query parameters (from useUrlQuery hook)
// to provide query parameters and update methods to tables.

export const DEFAULT_RECORDS_PER_PAGE = 20;

interface UrlQueryParams {
  filterKey?: string;
  initialSort?: { key: string; dir: 'desc' | 'asc' };
  filterCondition?: string;
  additionalFilters?: { key: string; condition?: string; value?: string }[];
  initialFilter?: FilterBy;
  rowsPerPage?: number;
}

// eslint-disable-next-line valid-jsdoc
/** useUrlQueryParams a hook for reading and updating url query parameters such as sort, filter, and pagination.
 *
 * useUrlQueryParams returns a `queryParams` object contains the filter, pagination, and sort parameters as they are encoded in the url.
 * These parameters can then be passed into a graphql query.
 *
 * The parameters are updated using functions and objects returned by the hook.
 *
 * ```
 * const {
 *  updateSortQuery,
 *  updatePaginationQuery,
 *  updateFilterQuery,
 *  filter: FilterController,
 *  queryParams: { sortBy, page, first, offset, filterBy },
 *  } = useUrlQueryParams({ filterKey: 'name' });
 * ```
 *
 * ## Filtering
 * By default useUrlQueryParams expects a single filterKey which will be added to the browsers URL bar, and linked to the `filter` object returned by the hook.
 *
 * If no filterCondition is provided, the filter will be given a `like` condition, which is intended to match the provided string anywhere in assocated field.
 * Because url parameters are strings, this hook tries to convert the url paramter string to the correct type, for example `isCustomer=true` will be converted to a boolean.
 *
 * If you have a single string based filterKey, you can update the filter using the `updateFilterQuery` function.
 * ```
 * updateFilterQuery('name', 'Jo'); // This will be a `like` condition matching names like Joanna, John, etc.
 * ```
 * After this call, the browser's url bar should be updated include the queryParam `name=Jo`.
 *
 * The filter can also be updated using functions provided by the `filter` object returned from the hook
 * .
 * ```
 *  filter.onChangeStringFilterRule('name', 'like', newValue);
 * ```
 *
 * If you need to use multiple filters, you'll need to pass in the additionalFilters prop.
 *
 *  ```
 *  const { queryParams } = useUrlQueryParams({
 *    filterKey: 'name',
 *    initialSort: { key: 'name', dir: 'asc' },
 *    additionalFilters: [
 *      { key: 'isAdmin' },
 *    ],
 * });
 * ```
 *
 * ## Pagination
 * This hook currently provides limited access the the pagination option in the graphql API.
 * Only the `page` parameter is stored in the URL Query and the default Page size `DEFAULT_RECORDS_PER_PAGE` is always used to calculate the offset
 * Updating the page is usually managed using the onChangePage callback provided by the `DataTable` component.
 * ```
 * <DataTable
 *  onChangePage={updatePaginationQuery}
 * />
 * ```
 *
 * ## Sorting
 *
 * The updateSortQuery function returned by this hook is used to update the sort query parameters.
 * This is linked to the `Column` datatype from the `common` package.
 * It is usually managed from within a useColumns hook
 * ```
 *  const columns = useColumns<MyDataType>(
 *    [
 *      { key: 'name', label: 'label.name'},
 *      { key: 'code', label: 'label.code'},
 *      'selection',
 *    ],
 *    {
 *      onChangeSortBy: updateSortQuery,
 *      sortBy,
 *    },
 *    [updateSortQuery, sortBy]
 *  );
 * ```
 *
 * ## Using the query parameters
 *
 * The `queryParams` object returned by this hook can be passed directly to a graphql query.
 * ```
 * const api = useExampleApi();
 * const { queryParams } = useUrlQueryParams({
 *     filterKey: 'name',
 *     initialSort: { key: 'name', dir: 'asc' },
 *    });
 * const result = useQuery(api.keys.paramList(queryParams), () =>
 *    api.get.list(queryParams)
 * );
 * ```
 * */
export const useUrlQueryParams = ({
  filterKey,
  initialSort,
  filterCondition = 'like',
  additionalFilters = [],
  initialFilter,
  rowsPerPage = DEFAULT_RECORDS_PER_PAGE,
}: UrlQueryParams = {}) => {
  // do not coerce the filter parameter if the user enters a numeric value
  // if this is parsed as numeric, the query param changes filter=0300 to filter=300
  // which then does not match against codes, as the filter is usually a 'startsWith'
  const { urlQuery, updateQuery } = useUrlQuery({
    skipParse: ['filter', 'name', 'username', 'itemName'],
  });

  const updateSortQuery = <T extends RecordWithId>(column: Column<T>) => {
    const currentSort = urlQuery['sort'] ?? initialSort?.key ?? '';
    const sort = column.key as string;
    if (sort !== currentSort) {
      updateQuery({ sort, dir: '', page: '' });
    } else {
      const dir = column.sortBy?.direction === 'desc' ? '' : 'desc';
      updateQuery({ dir });
    }
  };

  const updatePaginationQuery = (page: number) => {
    // Page is zero-indexed in useQueryParams store, so increase it by one
    updateQuery({ page: page === 0 ? '' : page + 1 });
  };

  const updateFilterQuery = (key: string, value: string | string[] | null) => {
    updateQuery({ [key]: value });
  };

  const getFilterBy = (initialFilterBy?: FilterBy) => {
    const filterBy: FilterBy = initialFilterBy ?? {};

    if (filterKey && urlQuery[filterKey]) {
      filterBy[filterKey] = { [filterCondition]: urlQuery[filterKey] ?? '' };
    }

    additionalFilters.forEach(filter => {
      if (urlQuery[filter.key]) {
        let filterValue = urlQuery[filter.key];
        switch (filterValue) {
          case 'true':
            filterValue = true;
            break;
          case 'false':
            filterValue = false;
            break;
        }
        if (filter.condition === 'between') {
          const filterItems = urlQuery[filter.key].split(',');
          filterBy[filter.key] = {
            afterOrEqualTo: new Date(filterItems[0]),
            beforeOrEqualTo: new Date(filterItems[1]),
          };
        } else if (filter.condition) {
          filterBy[filter.key] = {
            [filter.condition]: filterValue,
          };
        } else {
          filterBy[filter.key] = filterValue;
        }
      }
      // urlQuery doesn't include field called 'id' so have to check
      // explicitly
      if (filter.key === 'id' && filter.condition) {
        filterBy[filter.key] = {
          [filter.condition]: filter?.value ?? '',
        };
      }
    });

    return filterBy;
  };

  const filter: FilterController = {
    onChangeStringRule: (key: string, value: string) =>
      updateFilterQuery(key, value),
    onChangeStringFilterRule: (key: string, _, value: string | string[]) =>
      updateFilterQuery(key, value),
    onChangeStringArrayFilterRule: (key: string, _, value: string[]) =>
      updateFilterQuery(key + '[]', value),
    onChangeBooleanFilterRule: (key: string, _, value: boolean) =>
      updateQuery({ [key]: value }),
    onChangeDateFilterRule: (
      key: string,
      _condition: FilterByConditionByType['date'],
      value: Date | Date[]
    ) => {
      if (Array.isArray(value)) {
        const startDate =
          typeof value[0] == 'string' ? value[0] : value[0]?.toISOString();
        const endDate =
          typeof value[1] == 'string' ? value[1] : value[1]?.toISOString();

        updateQuery({
          [key]: [startDate, endDate],
        });
      } else {
        const d = typeof value == 'string' ? value : value?.toISOString();
        updateQuery({ [key]: d });
      }
    },
    onClearFilterRule: key => updateFilterQuery(key, ''),
    onClearFilterListRule: keys => {
      const keysToClear = {} as UrlQueryObject;
      keys.forEach(key => (keysToClear[key] = null));
      updateQuery(keysToClear);
    },
    filterBy: getFilterBy(initialFilter),
  };
  const queryParams = {
    page: urlQuery.page ? urlQuery.page - 1 : 0,
    offset: urlQuery.page ? (urlQuery.page - 1) * rowsPerPage : 0,
    first: rowsPerPage,
    sortBy: {
      key: urlQuery.sort ?? initialSort?.key ?? '',
      direction: urlQuery.dir ?? initialSort?.dir ?? 'asc',
      isDesc: (urlQuery.dir ?? initialSort?.dir) === 'desc',
    },
    filterBy: filter.filterBy,
  };

  return {
    queryParams,
    urlQuery,
    updateSortQuery,
    updatePaginationQuery,
    updateFilterQuery,
    filter,
  };
};
