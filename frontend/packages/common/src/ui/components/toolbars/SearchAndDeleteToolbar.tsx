import React, { useEffect, useRef } from 'react';
import {
  useNotification,
  DropdownMenu,
  DropdownMenuItem,
  useTranslation,
  DeleteIcon,
  useTableStore,
  FilterController,
  AlertModal,
  useConfirmationModal,
  SearchBar,
  LocalStorage,
  RecordWithId,
  Box,
} from '@uc-frontend/common';

export const SearchAndDeleteToolbar = <T extends RecordWithId>({
  data,
  filter,
  deleteItem,
  invalidateQueries,
  deleteLabel,
  searchFilterKey = 'search',
  ActionButtons = () => <></>,
}: {
  data: T[];
  filter: FilterController;
  deleteItem: (id: string) => Promise<unknown>;
  invalidateQueries: () => Promise<void>;
  searchFilterKey?: string;
  deleteLabel?: string;
  ActionButtons?: () => JSX.Element;
}) => {
  const t = useTranslation(['system']);
  const { success, info } = useNotification();

  const [errorCount, setErrorCount] = React.useState(0);

  const { selectedRows } = useTableStore(state => ({
    selectedRows: Object.keys(state.rowState)
      .filter(id => state.rowState[id]?.isSelected)
      .map(selectedId => data?.find(({ id }) => selectedId === id))
      .filter(Boolean) as T[],
  }));

  const deleteAction = () => {
    if (selectedRows.length) {
      let deleteErrorCount = 0;
      Promise.all(
        selectedRows.map(async item => {
          await deleteItem(item.id).catch(() => {
            deleteErrorCount += 1;
          });
        })
      ).then(() => {
        setErrorCount(deleteErrorCount);
        // Separate check for authorisation error, as this is handled globally i.e. not caught above.
        // Not using useLocalStorage here, as hook result only updates on re-render (after this function finishes running!)
        const authError = LocalStorage.getItem('/auth/error');
        if (deleteErrorCount === 0 && !authError) {
          const deletedMessage = t('messages.deleted-generic', {
            count: selectedRows.length,
          });
          const successSnack = success(deletedMessage);
          successSnack();
        }
        invalidateQueries();
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

  const ref = useRef(deleteAction);

  useEffect(() => {
    ref.current = deleteAction;
  }, [selectedRows]);

  const filterString = (filter.filterBy?.[searchFilterKey] as string) || '';

  return (
    <Box
      sx={{
        justifyContent: 'space-between',
        display: 'flex',
      }}
    >
      <AlertModal
        title={t('error.something-wrong')}
        message={t('messages.error-deleting-generic', {
          count: errorCount,
        })}
        open={errorCount > 0}
        onOk={() => setErrorCount(0)}
      />
      <SearchBar
        placeholder={t('placeholder.search')}
        value={filterString}
        onChange={newValue =>
          filter.onChangeStringRule(searchFilterKey, newValue)
        }
      />
      <Box sx={{ gap: '10px', display: 'flex' }}>
        <ActionButtons />
        <DropdownMenu label={t('label.select')}>
          <DropdownMenuItem
            disabled={!selectedRows.length}
            IconComponent={DeleteIcon}
            onClick={() => showDeleteConfirmation()}
          >
            {deleteLabel ?? t('button.delete-lines')}
          </DropdownMenuItem>
        </DropdownMenu>
      </Box>
    </Box>
  );
};
