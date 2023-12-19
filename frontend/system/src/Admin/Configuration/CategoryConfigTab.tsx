import React, { useState } from 'react';
import {
  AppBarContentPortal,
  BasicTextInput,
  DropdownMenu,
  DropdownMenuItem,
  Typography,
} from '@common/components';
import { useTranslation } from '@common/intl';
import {
  createTableStore,
  DataTable,
  DeleteIcon,
  TableProvider,
  useColumns,
  useTableStore,
} from '@common/ui';

type CategoryConfig = {
  id: string;
  label: string;
  value: string;
};

type CategoryConfigTabProps = {
  data: CategoryConfig[];
  name: string;
};

const CategoryConfigTabComponent = ({ data }: CategoryConfigTabProps) => {
  const t = useTranslation('system');
  const [rowToEdit, setRowToEdit] = useState<CategoryConfig | null>(null);

  const { selectedRows } = useTableStore(state => ({
    selectedRows: Object.keys(state.rowState)
      .filter(id => state.rowState[id]?.isSelected)
      .map(selectedId => data?.find(({ id }) => selectedId === id))
      .filter(Boolean),
  }));

  const columns = useColumns<CategoryConfig>(
    [
      {
        key: 'value',
        label: 'label.value',
        Cell: ({ rowData }) =>
          rowData.id === rowToEdit?.id ? (
            <BasicTextInput
              fullWidth
              autoFocus
              value={rowToEdit.value}
              onChange={e =>
                // todo not this way lol
                setRowToEdit({
                  ...rowToEdit,
                  label: e.target.value,
                  value: e.target.value,
                })
              }
            />
          ) : (
            <Typography>{rowData.value}</Typography>
          ),
      },
      'selection',
    ],
    undefined,
    [rowToEdit]
  );

  return (
    <>
      <AppBarContentPortal>
        <DropdownMenu label={t('label.select')}>
          <DropdownMenuItem
            disabled={!selectedRows.length}
            IconComponent={DeleteIcon}
            onClick={() => {
              // todo: delete - probably with confirmation modal?
            }}
          >
            {t('button.delete-lines')}
          </DropdownMenuItem>
        </DropdownMenu>
      </AppBarContentPortal>

      <DataTable
        columns={columns}
        data={data}
        onRowClick={row => setRowToEdit(row)}
      />
    </>
  );
};

export const CategoryConfigTab = (props: CategoryConfigTabProps) => {
  return (
    <TableProvider createStore={createTableStore}>
      <CategoryConfigTabComponent {...props} />
    </TableProvider>
  );
};
