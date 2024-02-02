import { useAuthContext } from '@common/authentication';
import { useEditModal } from '@common/hooks';
import { useTranslation } from '@common/intl';
import { PermissionNode } from '@common/types';
import {
  AppBarButtonsPortal,
  AppBarContentPortal,
  ColumnDescription,
  createTableStore,
  DataTable,
  DeleteLinesDropdownItem,
  DropdownMenu,
  LoadingButton,
  NothingHere,
  PlusCircleIcon,
  TableProps,
  TableProvider,
  Tooltip,
  Typography,
  useColumns,
  useTableStore,
} from '@common/ui';
import React from 'react';
import { useDeleteBarcode } from './api';
import { BarcodeFragment } from './api/operations.generated';
import { BarcodeEditModal } from './BarcodeEditModal';
import { getParentDescription } from './helpers';

interface BarcodeListProps {
  barcodes: Omit<BarcodeFragment, '__typename'>[];
  isError: boolean;
  isLoading: boolean;
  entityCodes?: string[];
  pagination?: TableProps<BarcodeFragment>['pagination'];
  updatePaginationQuery?: (page: number) => void;
}

const BarcodeListComponent = ({
  barcodes,
  isError,
  isLoading,
  entityCodes,
  pagination,
  updatePaginationQuery,
}: BarcodeListProps) => {
  const t = useTranslation('system');
  const { hasPermission } = useAuthContext();
  const isAdmin = hasPermission(PermissionNode.ServerAdmin);

  const { onOpen, onClose, isOpen } = useEditModal<BarcodeFragment>();

  const { mutateAsync: deleteGS1 } = useDeleteBarcode();

  const selectedRows = useTableStore(state =>
    Object.keys(state.rowState)
      .filter(id => state.rowState[id]?.isSelected)
      .map(selectedId => barcodes.find(({ id }) => selectedId === id))
      .filter(Boolean)
  );

  const columnDefs: ColumnDescription<BarcodeFragment>[] = [
    {
      key: 'entity',
      label: 'label.product',
      Cell: ({ rowData }) => {
        const description = getParentDescription(rowData.entity);
        return (
          <Tooltip title={description}>
            <Typography>
              {description.length > 50
                ? description.substring(0, 50) + '...'
                : description}
            </Typography>
          </Tooltip>
        );
      },
    },
    {
      key: 'entity2', // also on entity, but we need to use different key to avoid error
      label: 'label.pack-size',
      Cell: ({ rowData }) => (
        <>
          {rowData.entity.name} ({rowData.entity.code})
        </>
      ),
    },
    { key: 'manufacturer', label: 'label.manufacturer' },
    { key: 'id', label: 'label.gtin' },
  ];

  const columns = useColumns<BarcodeFragment>(
    isAdmin ? [...columnDefs, 'selection'] : columnDefs
  );

  return (
    <>
      {isAdmin && (
        <>
          {isOpen && (
            <BarcodeEditModal
              isOpen={isOpen}
              onClose={onClose}
              entityCodes={entityCodes}
            />
          )}

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
                deleteItem={async (item: BarcodeFragment) => {
                  await deleteGS1({ gtin: item.gtin });
                }}
              />
            </DropdownMenu>
          </AppBarContentPortal>
        </>
      )}

      <DataTable
        columns={columns}
        data={barcodes}
        isLoading={isLoading}
        isError={isError}
        noDataElement={<NothingHere body={t('error.no-barcodes')} />}
        pagination={pagination}
        onChangePage={updatePaginationQuery}
      />
    </>
  );
};

export const BarcodeList = (props: BarcodeListProps) => {
  return (
    <TableProvider createStore={createTableStore}>
      <BarcodeListComponent {...props} />
    </TableProvider>
  );
};
