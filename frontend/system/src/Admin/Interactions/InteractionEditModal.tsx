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
import React, { useState } from 'react';
import { useUuid } from '../../hooks';

type InteractionEditModalProps = {
  isOpen: boolean;
  mode: ModalMode | null;
  interaction: String | null; // TODO: this should be an InteractionFragment
  onClose: () => void;
};

export const InteractionEditModal = ({
  isOpen,
  interaction,
  mode,
  onClose,
}: InteractionEditModalProps) => {
  const t = useTranslation('system');
  const uuid = useUuid();

  const [draft, setDraft] = useState<String>(interaction ?? 'Coming Soon');

  const { Modal } = useDialog({ isOpen, onClose });

  // TODO: set from queries
  const isLoading = false;

  const isInvalid = true; //!draft.name || !draft.description; TODO
  const modalWidth = Math.min(window.innerWidth - 200, 800);

  return (
    <Modal
      width={modalWidth}
      okButton={
        <LoadingButton
          disabled={isInvalid}
          onClick={() => {
            // TODO: save and handle errors
            console.log('value to be saved:', draft);
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
      title={
        mode === ModalMode.Create
          ? t('label.add-interaction')
          : t('label.edit-interaction')
      }
    >
      {isLoading ? (
        <InlineSpinner />
      ) : (
        <Grid flexDirection="column" display="flex" gap={2}>
          <BasicTextInput
            required
            InputLabelProps={{ shrink: true }}
            label={t('label.title')}
            value={draft}
            onChange={e => setDraft(draft)} //TODO
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
