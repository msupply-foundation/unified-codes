import React from 'react';
import {
  AppBarButtonsPortal,
  AppBarContentPortal,
  DropdownMenu,
  DropdownMenuItem,
  LoadingButton,
  useConfirmationModal,
} from '@common/components';
import { useTranslation } from '@common/intl';
import {
  createTableStore,
  DataTable,
  DeleteIcon,
  PlusCircleIcon,
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
  category: string;
};

const CategoryConfigTabComponent = ({
  data,
  category,
}: CategoryConfigTabProps) => {
  const t = useTranslation('system');
  const { onOpen, onClose, isOpen, entity, mode } =
    useEditModal<CategoryOption>();

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

  const deleteAction = (rows: (CategoryOption | undefined)[]) => {
    // TODO: implement delete
    console.log('Rows to delete: ', rows);
  };

  const showDeleteConfirmation = useConfirmationModal({
    onConfirm: () => deleteAction(selectedRows),
    message: t('messages.confirm-delete-generic', {
      count: selectedRows.length,
    }),
    title: t('heading.are-you-sure'),
  });

  return (
    <>
      {isOpen && (
        <CategoryOptionEditModal
          isOpen={isOpen}
          onClose={onClose}
          config={entity}
          mode={mode}
          category={category}
        />
      )}
      <AppBarButtonsPortal>
        <LoadingButton
          onClick={() => onOpen()}
          isLoading={false}
          startIcon={<PlusCircleIcon />}
        >
          {t('label.add-option', { option: category })}
        </LoadingButton>
      </AppBarButtonsPortal>
      <AppBarContentPortal>
        <DropdownMenu label={t('label.select')}>
          <DropdownMenuItem
            disabled={!selectedRows.length}
            IconComponent={DeleteIcon}
            onClick={() => showDeleteConfirmation()}
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
