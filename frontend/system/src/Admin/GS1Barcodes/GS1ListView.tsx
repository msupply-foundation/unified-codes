import { useEditModal } from '@common/hooks';
import { useTranslation } from '@common/intl';
import {
  AppBarButtonsPortal,
  createTableStore,
  DataTable,
  LoadingButton,
  NothingHere,
  PlusCircleIcon,
  TableProvider,
  useColumns,
} from '@common/ui';
import React from 'react';
import { useGS1Barcodes } from './api';
import { Gs1Fragment } from './api/operations.generated';
import { GS1EditModal } from './GS1EditModal';

export const GS1ListView = () => {
  const t = useTranslation('system');

  const { onOpen, onClose, isOpen } = useEditModal<Gs1Fragment>();

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
      {isOpen && <GS1EditModal isOpen={isOpen} onClose={onClose} />}
      <AppBarButtonsPortal>
        <LoadingButton
          onClick={() => onOpen()}
          isLoading={false}
          startIcon={<PlusCircleIcon />}
        >
          {t('label.add-barcode')}
        </LoadingButton>
      </AppBarButtonsPortal>

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
