import React from 'react';
import { useTranslation } from '@common/intl';
import {
  DataTable,
  NothingHere,
  TableProvider,
  createTableStore,
  useColumns,
} from '@common/ui';
import { useQueryParamsState } from '@common/hooks';
import { useNavigate } from 'react-router';
import { RouteBuilder } from '@common/utils';
import { AppRoute } from 'frontend/config/src';

// TODO: types from codegen
type PendingChange = {
  id: string;
  productName: string;
  category: string;
  requestDate: string;
  changeType: 'Addition' | 'New';
  requestedBy: string;
  for: string;
};

// dummy data!
const data = {
  totalLength: 3,
  data: [
    {
      id: '123',
      productName: 'Gloves XL',
      category: 'Consumable',
      requestDate: '21/12/23',
      changeType: 'New',
      requestedBy: 'Person 2',
      for: 'Fiji',
    },
    {
      id: '1234',
      productName: 'Amoxicillin',
      category: 'Drug',
      requestDate: '22/12/23',
      changeType: 'Addition',
      requestedBy: 'Person 1',
      for: 'Fiji',
    },
    {
      id: '12345',
      productName: 'Video Monitor',
      category: 'Consumable',
      requestDate: '22/12/23',
      changeType: 'New',
      requestedBy: 'Person 2',
      for: 'Laos',
    },
  ] as PendingChange[],
};

export const PendingChangesListView = () => {
  const t = useTranslation('system');
  const navigate = useNavigate();

  const { queryParams, updatePaginationQuery, updateSortQuery } =
    useQueryParamsState({
      initialSort: { key: 'requestDate', dir: 'asc' },
    });

  const { sortBy, page, offset, first } = queryParams;

  const columns = useColumns<PendingChange>(
    [
      { key: 'productName', label: 'label.item' },
      { key: 'category', label: 'label.category' },
      { key: 'requestDate', label: 'label.date-requested' },
      { key: 'changeType', label: 'label.change-type' },
      { key: 'requestedBy', label: 'label.requested-by' },
      { key: 'for', label: 'label.request-for' },
    ],
    { sortBy: sortBy, onChangeSortBy: updateSortQuery },
    [sortBy, updateSortQuery]
  );

  // TODO
  // const { data, isError, isLoading } = usePendingChanges({
  //   filter: {
  //     orderBy: {
  //       field: sortBy.key,
  //       descending: sortBy.isDesc,
  //     },
  //   },
  //   first,
  //   offset,
  // });

  const pendingChanges = data?.data ?? [];

  const pagination = {
    page,
    offset,
    first,
    total: data?.totalLength,
  };

  return (
    <TableProvider createStore={createTableStore}>
      <DataTable
        columns={columns}
        data={pendingChanges}
        isError={false}
        isLoading={false}
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
