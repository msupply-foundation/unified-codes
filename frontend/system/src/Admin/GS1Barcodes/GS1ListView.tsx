import {
  createTableStore,
  DataTable,
  NothingHere,
  TableProvider,
  useColumns,
} from '@common/ui';
import React from 'react';
import { useGS1Barcodes } from './api';
import { Gs1Fragment } from './api/operations.generated';

export const GS1ListView = () => {
  const columns = useColumns<Gs1Fragment>(
    [
      {
        key: 'entity',
        label: 'label.product',
        Cell: ({ rowData }) => <>{rowData.entity?.description}</>,
      },
      {
        key: 'also entity', // TODO does this have implications...
        label: 'label.pack-size',
        Cell: ({ rowData }) => <>{rowData.entity?.name}</>,
      },
      { key: 'manufacturer', label: 'label.manufacturer' },
      { key: 'id', label: 'label.gtin' },
    ],
    {},
    []
  );

  const { data, isError, isLoading } = useGS1Barcodes();

  return (
    <TableProvider createStore={createTableStore}>
      <DataTable
        columns={columns}
        data={data ?? []}
        isLoading={isLoading}
        isError={isError}
        noDataElement={<NothingHere />}
        // pagination={false} // TODO
        // onChangePage={updatePaginationQuery}
      />
    </TableProvider>
  );
};
