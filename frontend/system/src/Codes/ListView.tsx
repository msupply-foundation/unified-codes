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

export const ListView = () => {
  const t = useTranslation('system');
  const { filter, queryParams, updatePaginationQuery, updateSortQuery } =
    useQueryParamsState();

  const columns = useColumns(
    [
      { key: 'code', label: 'label.code' },
      { key: 'description', label: 'label.description' },
      { key: 'type', label: 'label.type' },
    ],
    { sortBy: queryParams.sortBy, onChangeSortBy: updateSortQuery },
    [queryParams.sortBy, updateSortQuery]
  );

  // const { data, isError, isLoading } = useRecipients(queryParams);
  // const recipients = data?.nodes ?? [];

  const codes: {
    code: string;
    description: string;
    type: string;
    id: string;
  }[] = [
    { code: 'helo', description: 'helo', type: 'helo', id: 'helo' },
    { code: 'helo', description: 'shelo', type: 'shelo', id: 'shelo' },
  ];

  const pagination = {
    page: queryParams.page,
    offset: queryParams.offset,
    first: queryParams.first,
  };

  return (
    <>
      <TableProvider createStore={createTableStore}>
        <AppBarContentPortal sx={{ paddingBottom: '16px', flex: 1 }}>
          <SearchToolbar filter={filter} />
        </AppBarContentPortal>

        <DataTable
          columns={columns}
          data={codes}
          isError={false}
          isLoading={false}
          // noDataElement={<NothingHere body={t('error.no-recipients')} />}
          noDataElement={<NothingHere body={'nada'} />}
          // pagination={{ ...pagination, total: data?.totalCount }}
          pagination={{ ...pagination, total: 10 }}
          onChangePage={updatePaginationQuery}
        />
      </TableProvider>
    </>
  );
};
