import React from 'react';
import {
  AppBarContentPortal,
  DropdownMenu,
  DropdownMenuItem,
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
import { useEditModal } from '@common/hooks';
import { CategoryOptionEditModal } from './CategoryOptionEditModal';

// TODO: this type should come from gql codegen types
type CategoryOption = {
  id: string;
  label: string;
  value: string;
};

type CategoryConfigTabProps = {
  data: CategoryOption[];
  name: string;
};

const CategoryConfigTabComponent = ({ data }: CategoryConfigTabProps) => {
  const t = useTranslation('system');
  const { onOpen, onClose, isOpen, entity } = useEditModal<CategoryOption>();

  const { selectedRows } = useTableStore(state => ({
    selectedRows: Object.keys(state.rowState)
      .filter(id => state.rowState[id]?.isSelected)
      .map(selectedId => data?.find(({ id }) => selectedId === id))
      .filter(Boolean),
  }));

  const columns = useColumns<CategoryOption>([
    {
      key: 'value',
      label: 'label.value',
    },
    'selection',
  ]);

  return (
    <>
      {isOpen && (
        <CategoryOptionEditModal
          isOpen={isOpen}
          onClose={onClose}
          config={entity}
        />
      )}
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

      <DataTable columns={columns} data={data} onRowClick={onOpen} />
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
