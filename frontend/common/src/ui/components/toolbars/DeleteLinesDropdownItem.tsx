import React from 'react';
import { useNotification } from '@common/hooks';
import { useTranslation } from '@common/intl';
import { DeleteIcon, DropdownMenuItem } from '@common/ui';
import {
  LocalStorage,
  RecordWithId,
  useConfirmationModal,
} from 'frontend/common/src';

export const DeleteLinesDropdownItem = <T extends RecordWithId>({
  selectedRows,
  deleteItem,
}: {
  selectedRows: (T | undefined)[];
  deleteItem: (item: T) => Promise<void>;
}) => {
  const t = useTranslation();
  const { success, info, error } = useNotification();

  const deleteAction = () => {
    if (selectedRows.length) {
      let errMessage = '';
      Promise.all(
        selectedRows.map(async row => {
          if (!row) return;
          await deleteItem(row).catch(err => {
            if (!errMessage) errMessage = err.message;
          });
        })
      ).then(() => {
        // Separate check for authorisation error, as this is handled globally i.e. not caught above
        // Not using useLocalStorage here, as hook result only updates on re-render (after this function finishes running!)
        const authError = LocalStorage.getItem('/auth/error');
        if (!errMessage && !authError) {
          const deletedMessage = t('messages.deleted-generic', {
            count: selectedRows.length,
          });
          success(deletedMessage)();
        } else {
          error(errMessage ?? 'Unknown/Auth Error')();
        }
      });
    } else {
      info(t('messages.select-rows-to-delete'))();
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
    <DropdownMenuItem
      disabled={!selectedRows.length}
      IconComponent={DeleteIcon}
      onClick={() => showDeleteConfirmation()}
    >
      {t('button.delete-lines')}
    </DropdownMenuItem>
  );
};
