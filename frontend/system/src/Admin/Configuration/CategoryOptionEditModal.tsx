import {
  BasicTextInput,
  DialogButton,
  InlineSpinner,
  LoadingButton,
} from '@common/components';
import { useDialog } from '@common/hooks';
import { CheckIcon } from '@common/icons';
import { useTranslation } from '@common/intl';
import { Grid } from '@common/ui';
import React, { useState } from 'react';
import { useUuid } from '../../hooks';

// TODO: this type should come from gql codegen types
type CategoryOption = {
  id: string;
  label: string;
  value: string;
};
type ConfigurationEditModalProps = {
  isOpen: boolean;
  onClose: () => void;
  config: CategoryOption | null;
};

export const CategoryOptionEditModal = ({
  isOpen,
  config,
  onClose,
}: ConfigurationEditModalProps) => {
  const t = useTranslation('system');
  const uuid = useUuid();

  const [value, setValue] = useState(config?.value ?? '');

  const { Modal } = useDialog({ isOpen, onClose });

  // TODO: set from queries
  const isLoading = false;

  return (
    <Modal
      okButton={
        <LoadingButton
          onClick={() => {
            // TODO: save and handle errors
            console.log('value to be saved:', {
              id: config?.id ?? uuid(),
              label: value,
              value,
            });
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
      }
      cancelButton={<DialogButton variant="cancel" onClick={onClose} />}
      title={t('label.edit-option')}
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
