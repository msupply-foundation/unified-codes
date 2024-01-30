import {
  BasicTextInput,
  DialogButton,
  InlineSpinner,
  LoadingButton,
} from '@common/components';
import { useDialog } from '@common/hooks';
import { CheckIcon } from '@common/icons';
import { useTranslation } from '@common/intl';
import { AddGs1Input } from '@common/types';
import { Grid } from '@common/ui';
import { Alert, AlertTitle } from '@mui/material';
import React, { useState } from 'react';
import { useAddGS1 } from './api';

type GS1EditModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const GS1EditModal = ({ isOpen, onClose }: GS1EditModalProps) => {
  const t = useTranslation('system');

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [draft, setDraft] = useState<AddGs1Input>({
    entityCode: '',
    gtin: '',
    manufacturer: '',
  });

  const { Modal } = useDialog({ isOpen, onClose });

  const { mutateAsync: addGs1, isLoading } = useAddGS1();

  const onSubmit = async () => {
    try {
      await addGs1({
        input: {
          ...draft,
        },
      });
      onClose();
    } catch (err) {
      if (err instanceof Error) setErrorMessage(err.message);
      else setErrorMessage(t('messages.unknown-error'));
    }
  };

  const isInvalid = !draft.gtin || !draft.manufacturer || !draft.entityCode;
  const modalWidth = Math.min(window.innerWidth - 200, 800);

  return (
    <Modal
      width={modalWidth}
      okButton={
        <LoadingButton
          disabled={isInvalid}
          onClick={onSubmit}
          isLoading={isLoading}
          startIcon={<CheckIcon />}
          variant="contained"
        >
          {t('button.ok')}
        </LoadingButton>
      }
      cancelButton={<DialogButton variant="cancel" onClick={onClose} />}
      title={t('label.add-barcode')}
    >
      {isLoading ? (
        <InlineSpinner />
      ) : (
        <Grid flexDirection="column" display="flex" gap={2}>
          <BasicTextInput
            autoFocus
            required
            InputLabelProps={{ shrink: true }}
            label={t('label.gtin')}
            value={draft.gtin}
            onChange={e => setDraft({ ...draft, gtin: e.target.value })}
          />
          <BasicTextInput
            required
            InputLabelProps={{ shrink: true }}
            label={t('label.manufacturer')}
            value={draft.manufacturer}
            onChange={e => setDraft({ ...draft, manufacturer: e.target.value })}
          />
          <BasicTextInput
            InputLabelProps={{ shrink: true }}
            label={t('label.pack-size-code')}
            value={draft.entityCode}
            onChange={e => setDraft({ ...draft, entityCode: e.target.value })}
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
