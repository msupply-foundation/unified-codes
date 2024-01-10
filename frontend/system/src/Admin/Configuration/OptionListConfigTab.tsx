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
import {
  ConfigurationItemNode,
  ConfigurationItemTypeInput,
} from '@common/types';
import { useConfigurationItems } from './api';
import { ConfigurationItemFragment } from './api/operations.generated';

type OptionListConfigTabProps = {
  type: ConfigurationItemTypeInput;
  category: string;
};

const OptionListConfigTabComponent = ({
  type,
  category,
}: OptionListConfigTabProps) => {
  const t = useTranslation('system');
  const { onOpen, onClose, isOpen, entity, mode } =
    useEditModal<ConfigurationItemFragment>();

  const { data, isError, isLoading } = useConfigurationItems({
    type: type,
  });

  const selectedRows = useTableStore(state =>
    Object.keys(state.rowState)
      .filter(id => state.rowState[id]?.isSelected)
      .map(selectedId => data?.find(({ id }) => selectedId === id))
      .filter(Boolean)
  );

  const columns = useColumns<ConfigurationItemFragment>([
    {
      key: 'name',
      label: 'label.value',
    },
    'selection',
  ]);

  const deleteAction = (rows: (ConfigurationItemFragment | undefined)[]) => {
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
          type={type}
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
