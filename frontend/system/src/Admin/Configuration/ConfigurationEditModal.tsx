import {
  BasicTextInput,
  DialogButton,
  InlineSpinner,
  LoadingButton,
  Typography,
} from '@common/components';
import { useDialog } from '@common/hooks';
import { CheckIcon, DeleteIcon } from '@common/icons';
import { useTranslation } from '@common/intl';
import { DataTable, Grid, useColumns, useTableStore } from '@common/ui';
import React, { useState } from 'react';

type CategoryConfig = {
  id: string;
  label: string;
  value: string;
};

type ConfigurationEditModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  data: CategoryConfig[];
};

export const ConfigurationEditModal = ({
  isOpen,
  title,
  data,
  onClose,
}: ConfigurationEditModalProps) => {
  const t = useTranslation('system');
  const { Modal } = useDialog({ isOpen, onClose });
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

  // TODO: set from queries
  const isLoading = false;

  return (
    <Modal
      okButton={
        <>
          <LoadingButton
            disabled={!selectedRows.length}
            onClick={() => {
              // TODO: Delete selected lines here!
              console.log('lines to delete', selectedRows);
            }}
            isLoading={false}
            startIcon={<DeleteIcon />}
            variant="outlined"
            sx={{ marginLeft: '8px' }}
          >
            {t('button.delete-lines')}
          </LoadingButton>

          <LoadingButton
            onClick={() => {
              // TODO: save and handle errors
              // if (!err || !err.message) {
              //   err = { message: t('messages.unknown-error') };
              // }
              // setErrorMessage(err.message);
              onClose();
            }}
            isLoading={isLoading}
            startIcon={<CheckIcon />}
            variant="contained"
          >
            {t('button.ok')}
          </LoadingButton>
        </>
      }
      cancelButton={<DialogButton variant="cancel" onClick={onClose} />}
      title={`${t('label.edit-configuration')} - ${title}`}
    >
      {isLoading ? (
        <InlineSpinner />
      ) : (
        <Grid flexDirection="column" display="flex" gap={2}>
          <DataTable
            columns={columns}
            data={data}
            onRowClick={row => setRowToEdit(row)}
          />
          {/* {errorMessage ? (
            <Grid item>
              <Alert
                severity="error"
                onClose={() => {
                  setErrorMessage('');
                }}
              >
                <AlertTitle>{t('error')}</AlertTitle>
                {errorMessage}
              </Alert>
            </Grid>
          ) : null} */}
        </Grid>
      )}
    </Modal>
  );
};
