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
import { OptionEditModal } from './OptionEditModal';

// TODO: this type should come from gql codegen types
type ListOption = {
  id: string;
  label: string;
  value: string;
};

type OptionListConfigTabProps = {
  data: ListOption[];
  category: string;
};

const OptionListConfigTabComponent = ({
  data,
  category,
}: OptionListConfigTabProps) => {
  const t = useTranslation('system');
  const { onOpen, onClose, isOpen, entity, mode } = useEditModal<ListOption>();

  const selectedRows = useTableStore(state =>
    Object.keys(state.rowState)
      .filter(id => state.rowState[id]?.isSelected)
      .map(selectedId => data?.find(({ id }) => selectedId === id))
      .filter(Boolean)
  );

  const columns = useColumns<ListOption>([
    {
      key: 'value',
      label: 'label.value',
    },
    'selection',
  ]);

  const deleteAction = (rows: (ListOption | undefined)[]) => {
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
        <OptionEditModal
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

export const OptionListConfigTab = (props: OptionListConfigTabProps) => {
  return (
    <TableProvider createStore={createTableStore}>
      <OptionListConfigTabComponent {...props} />
    </TableProvider>
  );
};
