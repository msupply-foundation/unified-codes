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
import { Alert, AlertTitle } from '@mui/material';
import React, { useState } from 'react';
import { useUuid } from '../../hooks';
import { useUpsertPropertyConfigItem } from './api';
import { PropertyConfigurationItemFragment } from './api/operations.generated';

type PropertyEditModalProps = {
  isOpen: boolean;
  mode: ModalMode | null;
  property: PropertyConfigurationItemFragment | null;
  onClose: () => void;
};

export const PropertyOptionEditModal = ({
  isOpen,
  property,
  mode,
  onClose,
}: PropertyEditModalProps) => {
  const t = useTranslation('system');
  const uuid = useUuid();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [draft, setDraft] = useState<PropertyConfigurationItemFragment>(
    property ?? {
      id: uuid(),
      type: '',
      label: '',
      url: '',
    }
  );

  const { Modal } = useDialog({ isOpen, onClose });

  const { mutateAsync: upsertItem, isLoading } = useUpsertPropertyConfigItem();

  const onSubmit = async () => {
    try {
      await upsertItem({
        input: {
          type: draft.type,
          label: draft.label,
          url: draft.url,
        },
      });
      onClose();
    } catch (err) {
      if (err instanceof Error) setErrorMessage(err.message);
      else setErrorMessage(t('messages.unknown-error'));
    }
  };

  const isInvalid = !draft.type || !draft.label;
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
      title={
        mode === ModalMode.Create
          ? t('label.add-property')
          : t('label.edit-property')
      }
    >
      {isLoading ? (
        <InlineSpinner />
      ) : (
        <Grid flexDirection="column" display="flex" gap={2}>
          <BasicTextInput
            autoFocus
            required
            InputLabelProps={{ shrink: true }}
            label={t('label.type')}
            value={draft.type}
            onChange={e => setDraft({ ...draft, type: e.target.value })}
            disabled={mode !== ModalMode.Create}
            helperText={
              mode === ModalMode.Create && t('helper-text.you-cant-change-this')
            }
          />
          <BasicTextInput
            required
            InputLabelProps={{ shrink: true }}
            label={t('label.title')}
            value={draft.label}
            onChange={e => setDraft({ ...draft, label: e.target.value })}
          />
          <BasicTextInput
            InputLabelProps={{ shrink: true }}
            label={t('label.website')}
            value={draft.url}
            onChange={e => setDraft({ ...draft, url: e.target.value })}
            helperText={t('helper-text.website-placeholder')}
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
