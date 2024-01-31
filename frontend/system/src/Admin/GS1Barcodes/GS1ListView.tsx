import { useEditModal } from '@common/hooks';
import { useTranslation } from '@common/intl';
import {
  AppBarButtonsPortal,
  AppBarContentPortal,
  createTableStore,
  DataTable,
  DeleteLinesDropdownItem,
  DropdownMenu,
  LoadingButton,
  NothingHere,
  PlusCircleIcon,
  TableProvider,
  Tooltip,
  Typography,
  useColumns,
  useTableStore,
} from '@common/ui';
import React from 'react';
import { useDeleteGS1, useGS1Barcodes } from './api';
import { Gs1Fragment } from './api/operations.generated';
import { GS1EditModal } from './GS1EditModal';
import { getParentDescription } from './helpers';

const GS1ListViewComponent = () => {
  const t = useTranslation('system');

  const { onOpen, onClose, isOpen } = useEditModal<Gs1Fragment>();

  const { mutateAsync: deleteGS1 } = useDeleteGS1();
  const { data, isError, isLoading } = useGS1Barcodes();

  const selectedRows = useTableStore(state =>
    Object.keys(state.rowState)
      .filter(id => state.rowState[id]?.isSelected)
      .map(selectedId => data?.find(({ id }) => selectedId === id))
      .filter(Boolean)
  );

  const columns = useColumns<Gs1Fragment>([
    {
      key: 'entity',
      label: 'label.product',
      Cell: ({ rowData }) => {
        const description = getParentDescription(rowData.entity);
        return (
          <Tooltip title={description}>
            <Typography>
              {description.length > 35
                ? description.substring(0, 35) + '...'
                : description}
            </Typography>
          </Tooltip>
        );
      },
    },
    {
      key: 'entity2', // also on entity, but we need to use different key to avoid error
      label: 'label.pack-size',
      Cell: ({ rowData }) => <>{rowData.entity.name}</>,
    },
    { key: 'manufacturer', label: 'label.manufacturer' },
    { key: 'id', label: 'label.gtin' },
    'selection',
  ]);

  return (
    <>
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

      <AppBarContentPortal marginBottom={'10px'}>
        <DropdownMenu label={t('label.select')}>
          <DeleteLinesDropdownItem
            selectedRows={selectedRows}
            deleteItem={async (item: Gs1Fragment) => {
              await deleteGS1({ gtin: item.gtin });
            }}
          />
        </DropdownMenu>
      </AppBarContentPortal>

      <DataTable
        columns={columns}
        data={data ?? []}
        isLoading={isLoading}
        isError={isError}
        noDataElement={<NothingHere />}
        // pagination={false} // TODO
        // onChangePage={updatePaginationQuery}
      />
    </>
  );
};

export const GS1ListView = () => {
  return (
    <TableProvider createStore={createTableStore}>
      <GS1ListViewComponent />
    </TableProvider>
  );
};
