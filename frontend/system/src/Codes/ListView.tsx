import React from 'react';
import { useTranslation } from '@common/intl';
import {
  AppBarContentPortal,
  DataTable,
  NothingHere,
  TableProvider,
  createTableStore,
  useColumns,
  SearchToolbar,
} from '@common/ui';
import { useQueryParamsState } from '@common/hooks';
import { useEntities } from '../api';

export const ListView = () => {
  const t = useTranslation();
  const { filter, queryParams, updatePaginationQuery, updateSortQuery } =
    useQueryParamsState({
      initialSort: { key: 'description', dir: 'asc' },
    });

  const { sortBy, page, offset, first } = queryParams;

  const columns = useColumns(
    [
      { key: 'code', label: 'label.code', width: 200, sortable: false },
      { key: 'description', label: 'label.description', width: 1000 },
      { key: 'type', label: 'label.type', sortable: false },
    ],
    { sortBy: sortBy, onChangeSortBy: updateSortQuery },
    [sortBy, updateSortQuery]
  );

  const searchFilter = filter.filterBy?.['search'];
  const search = typeof searchFilter === 'string' ? searchFilter : '';

  const { data, isError, isLoading } = useEntities({
    filter: {
      categories: ['drug'],
      description: search,
      orderBy: {
        field: sortBy.key,
        descending: sortBy.isDesc,
      },
    },
    first,
    offset,
  });

  const entities = data?.data ?? [];

  const pagination = {
    page,
    offset,
    first,
    total: data?.totalLength,
  };

  return (
    <>
      <TableProvider createStore={createTableStore}>
        <AppBarContentPortal sx={{ paddingBottom: '16px', flex: 1 }}>
          <SearchToolbar filter={filter} />
        </AppBarContentPortal>

        <DataTable
          columns={columns}
          data={entities}
          isError={isError}
          isLoading={isLoading}
          noDataElement={<NothingHere body={t('error.no-data')} />}
          pagination={pagination}
          onChangePage={updatePaginationQuery}
        />
      </TableProvider>
    </>
  );
};
