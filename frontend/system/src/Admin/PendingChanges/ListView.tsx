import React, { useEffect } from 'react';
import { useTranslation } from '@common/intl';
import {
  DataTable,
  NothingHere,
  TableProvider,
  createTableStore,
  useColumns,
} from '@common/ui';
import { useBreadcrumbs, useQueryParamsState } from '@common/hooks';
import { useNavigate } from 'react-router';
import { PendingChangeSummaryFragment, usePendingChanges } from '../api';
import { RouteBuilder } from '@common/utils';
import { AppRoute } from 'frontend/config/src';

export const PendingChangesListView = () => {
  const t = useTranslation('system');
  const navigate = useNavigate();
  const { setSuffix } = useBreadcrumbs();

  const { queryParams, updatePaginationQuery, updateSortQuery } =
    useQueryParamsState({
      initialSort: { key: 'dateRequested', dir: 'asc' },
    });

  const { sortBy, page, offset, first } = queryParams;

  const columns = useColumns<PendingChangeSummaryFragment>(
    [
      { key: 'name', label: 'label.item' },
      { key: 'category', label: 'label.category' },
      {
        key: 'dateRequested',
        label: 'label.date-requested',
        Cell: ({ rowData }) => (
          <>{new Date(rowData.dateRequested).toLocaleDateString()}</>
        ),
      },
      { key: 'changeType', label: 'label.change-type', sortable: false },
      { key: 'requestedBy', label: 'label.requested-by', sortable: false },
      { key: 'requestedFor', label: 'label.request-for', sortable: false },
    ],
    { sortBy: sortBy, onChangeSortBy: updateSortQuery },
    [sortBy, updateSortQuery]
  );

  const { data, isError, isLoading } = usePendingChanges(queryParams);

  useEffect(() => {
    if (data?.totalCount) {
      setSuffix(`${t('pending-changes', { ns: 'host' })} (${data.totalCount})`);
    }
  }, [data?.totalCount]);

  const pendingChanges = data?.nodes ?? [];

  const pagination = {
    page,
    offset,
    first,
    total: data?.totalCount,
  };

  return (
    <TableProvider createStore={createTableStore}>
      <DataTable
        columns={columns}
        data={pendingChanges}
        isError={isError}
        isLoading={isLoading}
        noDataElement={<NothingHere body={t('error.no-data')} />}
        pagination={pagination}
        onChangePage={updatePaginationQuery}
        onRowClick={change =>
          navigate(
            RouteBuilder.create(AppRoute.Admin)
              .addPart(AppRoute.PendingChanges)
              .addPart(change.id)
              .build()
          )
        }
      />
    </TableProvider>
  );
};
