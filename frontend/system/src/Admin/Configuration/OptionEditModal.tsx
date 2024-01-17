import {
  BasicTextInput,
  DialogButton,
  InlineSpinner,
  LoadingButton,
} from '@common/components';
import { ModalMode, useDialog } from '@common/hooks';
import { CheckIcon } from '@common/icons';
import { useTranslation } from '@common/intl';
import { Grid } from '@common/ui';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import React, { useState } from 'react';
import { ConfigurationItemFragment } from './api/operations.generated';
import { useAddConfigItem } from './api';
import { ConfigurationItemTypeInput } from '@common/types';

type OptionEditModalProps = {
  isOpen: boolean;
  mode: ModalMode | null;
  config: ConfigurationItemFragment | null;
  category: string;
  type: ConfigurationItemTypeInput;
  onClose: () => void;
};

export const OptionEditModal = ({
  isOpen,
  config,
  mode,
  category,
  type,
  onClose,
}: OptionEditModalProps) => {
  const t = useTranslation('system');

  const [value, setValue] = useState(config?.name ?? '');
  const [addConfigItem, invalidateQueries] = useAddConfigItem();

  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { Modal } = useDialog({ isOpen, onClose });

  return (
    <Modal
      okButton={
        <LoadingButton
          onClick={() => {
            setIsLoading(true);
            addConfigItem({
              input: {
                name: value,
                type: type,
              },
            })
              .catch(err => {
                setIsLoading(false);
                if (!err || !err.message) {
                  err = { message: t('messages.unknown-error') };
                }
                setErrorMessage(err.message);
              })
              .then(() => {
                invalidateQueries();
                setIsLoading(false);
                onClose();
              });
            setIsLoading(false);
          }}
          isLoading={isLoading}
          startIcon={<CheckIcon />}
          variant="contained"
        >
          {t('button.ok')}
        </LoadingButton>
      }
      cancelButton={<DialogButton variant="cancel" onClick={onClose} />}
      title={
        mode === ModalMode.Create
          ? t('label.add-option', { option: category })
          : t('label.edit-option', { option: category })
      }
    >
      {isLoading ? (
        <InlineSpinner />
      ) : (
        <Grid flexDirection="column" display="flex" gap={2}>
          <BasicTextInput
            autoFocus
            InputLabelProps={{ shrink: true }}
            label={t('label.value')}
            value={value}
            onChange={e => setValue(e.target.value)}
          />
          {errorMessage ? (
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
          ) : null}
        </Grid>
      )}
    </Modal>
  );
};
