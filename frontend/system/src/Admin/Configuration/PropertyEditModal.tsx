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

// TODO: this type should come from gql codegen types
type Property = {
  id: string;
  type: string;
  value: string;
  url: string;
};

type PropertyEditModalProps = {
  isOpen: boolean;
  mode: ModalMode | null;
  property: Property | null;
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

  const [draft, setDraft] = useState<Property>(
    property ?? {
      id: uuid(),
      type: '',
      value: '',
      url: '',
    }
  );

  console.log(uuid());

  const { Modal } = useDialog({ isOpen, onClose });

  // TODO: set from queries
  const isLoading = false;

  const isInvalid = !draft.type || !draft.value;
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
            value={draft.value}
            onChange={e => setDraft({ ...draft, value: e.target.value })}
          />
          <BasicTextInput
            InputLabelProps={{ shrink: true }}
            label={t('label.website')}
            value={draft.url}
            onChange={e => setDraft({ ...draft, url: e.target.value })}
            helperText={t('helper-text.website-placeholder')}
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
