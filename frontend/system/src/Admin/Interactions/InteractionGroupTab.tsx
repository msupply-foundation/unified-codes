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
import { InteractionGroupEditModal } from './InteractionGroupEditModal';
import { useAllDrugInteractionGroups } from './api';
import { InteractionGroupFragment } from './api/operations.generated';
import { useDeleteInteractionGroup } from './api/hooks/useDeleteInteractionGroup';
import { LocalStorage, Typography } from 'frontend/common/src';
import { Tooltip } from '@uc-frontend/common';

type DeleteError = {
  name: string;
  message: string;
};

const InteractionGroupTabComponent = () => {
  const t = useTranslation('system');
  const { success, info, error } = useNotification();
  const { mutateAsync: deleteItem } = useDeleteInteractionGroup();
  const { onOpen, onClose, isOpen, entity, mode } =
    useEditModal<InteractionGroupFragment>();

  const { data, isLoading } = useAllDrugInteractionGroups();

  const [deleteErrors, setDeleteErrors] = React.useState<DeleteError[]>([]);
  const selectedRows = useTableStore(state =>
    Object.keys(state.rowState)
      .filter(id => state.rowState[id]?.isSelected)
      .map(selectedId => data?.find(({ id }) => selectedId === id))
      .filter(Boolean)
  );

  const columns = useColumns<InteractionGroupFragment>([
    {
      key: 'name',
      label: 'label.name',
    },
    {
      key: 'description',
      label: 'label.description',
    },
    {
      key: 'drugs',
      label: 'label.drugs',
      sortable: false,
      Cell: ({ rowData }) => {
        const drugs_csv = rowData.drugs
          .map(drug => drug.description)
          .join(', ');

        return (
          <>
            <Tooltip
              title={
                <ul>
                  {rowData.drugs.map(drug => (
                    <li>{drug.description}</li>
                  ))}
                </ul>
              }
            >
              <Typography>
                {drugs_csv.length > 30
                  ? drugs_csv.substring(0, 30) + '...'
                  : drugs_csv}
              </Typography>
            </Tooltip>
          </>
        );
      },
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
        <InteractionGroupEditModal
          isOpen={isOpen}
          onClose={onClose}
          interactionGroup={entity}
          mode={mode}
        />
      )}
      <AppBarButtonsPortal>
        <LoadingButton
          onClick={() => onOpen()}
          isLoading={false}
          startIcon={<PlusCircleIcon />}
        >
          {t('label.add-interaction-group')}
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

      <DataTable
        columns={columns}
        data={data}
        isLoading={isLoading}
        onRowClick={onOpen}
      />
    </>
  );
};

export const InteractionGroupTab = () => {
  return (
    <TableProvider createStore={createTableStore}>
      <InteractionGroupTabComponent />
    </TableProvider>
  );
};
