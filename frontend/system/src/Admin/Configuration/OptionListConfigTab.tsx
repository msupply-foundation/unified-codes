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
import { useEditModal, useNotification } from '@common/hooks';
import { OptionEditModal } from './OptionEditModal';
import { ConfigurationItemTypeInput } from '@common/types';
import { useConfigurationItems } from './api';
import { ConfigurationItemFragment } from './api/operations.generated';
import { useDeleteConfigurationItem } from './api/hooks/useDeleteConfigurationItem';
import { LocalStorage } from 'frontend/common/src';

type OptionListConfigTabProps = {
  type: ConfigurationItemTypeInput;
  category: string;
};

type DeleteError = {
  name: string;
  message: string;
};

const OptionListConfigTabComponent = ({
  type,
  category,
}: OptionListConfigTabProps) => {
  const t = useTranslation('system');
  const { success, info, error } = useNotification();
  const { mutateAsync: deleteItem } = useDeleteConfigurationItem();
  const { onOpen, onClose, isOpen, entity, mode } =
    useEditModal<ConfigurationItemFragment>();

  const { data } = useConfigurationItems({
    type: type,
  });

  const [deleteErrors, setDeleteErrors] = React.useState<DeleteError[]>([]);
  const selectedRows = useTableStore(state =>
    Object.keys(state.rowState)
      .filter(id => state.rowState[id]?.isSelected)
      .map(selectedId => data?.find(({ id }) => selectedId === id))
      .filter(Boolean)
  );

  const columns = useColumns<ConfigurationItemFragment>([
    {
      key: 'name',
      label: '', // only one column, so no real need for a label
    },
    'selection',
  ]);

  const deleteAction = () => {
    const numberSelected = selectedRows.length;
    if (selectedRows && numberSelected > 0) {
      const errors: DeleteError[] = [];
      Promise.all(
        selectedRows.map(async row => {
          if (!row) return;
          await deleteItem(row?.id).catch(err => {
            errors.push({
              name: row.name,
              message: err.message,
            });
          });
        })
      ).then(() => {
        setDeleteErrors(errors);
        // Separate check for authorisation error, as this is
        // handled globally i.e. not caught above.
        // Not using useLocalStorage here, as hook result only updates
        // on re-render (after this function finishes running!)
        const authError = LocalStorage.getItem('/auth/error');
        if (errors.length === 0 && !authError) {
          const deletedMessage = t('messages.deleted-generic', {
            count: numberSelected,
          });
          const successSnack = success(deletedMessage);
          successSnack();
        } else {
          const errorSnack = error(errors[0]?.message ?? 'Unknown/Auth Error');
          errorSnack();
        }
      });
    } else {
      const selectRowsSnack = info(t('messages.select-rows-to-delete'));
      selectRowsSnack();
    }
  };

  const showDeleteConfirmation = useConfirmationModal({
    onConfirm: deleteAction,
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

      <DataTable columns={columns} data={data} />
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
