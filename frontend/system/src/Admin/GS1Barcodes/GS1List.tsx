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
  TableProps,
  TableProvider,
  Tooltip,
  Typography,
  useColumns,
  useTableStore,
} from '@common/ui';
import React from 'react';
import { useDeleteGS1 } from './api';
import { Gs1Fragment } from './api/operations.generated';
import { GS1EditModal } from './GS1EditModal';
import { getParentDescription } from './helpers';

interface GS1ListProps {
  gs1Barcodes: Omit<Gs1Fragment, '__typename'>[];
  isError: boolean;
  isLoading: boolean;
  entityCodes?: string[];
  pagination?: TableProps<Gs1Fragment>['pagination'];
  updatePaginationQuery?: (page: number) => void;
}

const GS1ListComponent = ({
  gs1Barcodes,
  isError,
  isLoading,
  entityCodes,
  pagination,
  updatePaginationQuery,
}: GS1ListProps) => {
  const t = useTranslation('system');

  const { onOpen, onClose, isOpen } = useEditModal<Gs1Fragment>();

  const { mutateAsync: deleteGS1 } = useDeleteGS1();

  const selectedRows = useTableStore(state =>
    Object.keys(state.rowState)
      .filter(id => state.rowState[id]?.isSelected)
      .map(selectedId => gs1Barcodes.find(({ id }) => selectedId === id))
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
    'selection',
  ]);

  return (
    <>
      {isOpen && (
        <GS1EditModal
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
            deleteItem={async (item: Gs1Fragment) => {
              await deleteGS1({ gtin: item.gtin });
            }}
          />
        </DropdownMenu>
      </AppBarContentPortal>

      <DataTable
        columns={columns}
        data={gs1Barcodes}
        isLoading={isLoading}
        isError={isError}
        noDataElement={<NothingHere />}
        pagination={pagination}
        onChangePage={updatePaginationQuery}
      />
    </>
  );
};

export const GS1List = (props: GS1ListProps) => {
  return (
    <TableProvider createStore={createTableStore}>
      <GS1ListComponent {...props} />
    </TableProvider>
  );
};
