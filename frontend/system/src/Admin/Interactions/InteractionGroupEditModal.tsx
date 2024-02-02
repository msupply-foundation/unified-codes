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
import { InteractionGroupFragment } from './api/operations.generated';
import { useUpsertDrugInteractionGroup } from './api';
import { FnUtils } from '@common/utils';
import { DrugSelector } from './DrugSelector';
import { useEntities } from '../../Entities/api';

type InteractionGroupEditModalProps = {
  isOpen: boolean;
  mode: ModalMode | null;
  interactionGroup: InteractionGroupFragment | null;
  onClose: () => void;
};

export const createDraftInteractionGroup = (
  seed: InteractionGroupFragment | null
) => {
  return {
    id: seed?.id ?? FnUtils.generateUUID(),
    name: seed?.name ?? '',
    description: seed?.description ?? '',
    drugs: seed?.drugs ?? [],
  };
};

export const InteractionGroupEditModal = ({
  isOpen,
  interactionGroup,
  mode,
  onClose,
}: InteractionGroupEditModalProps) => {
  const t = useTranslation('system');

  const [group, setGroup] = useState<InteractionGroupFragment>(
    createDraftInteractionGroup(interactionGroup)
  );
  const onUpdate = (patch: Partial<InteractionGroupFragment>) => {
    setGroup({ ...group, ...patch });
  };
  const { mutateAsync: addDrugInterationGroup, isLoading } =
    useUpsertDrugInteractionGroup();

  const { data, isLoading: drugListLoading } = useEntities({
    filter: {
      categories: ['drug'],
      type: 'drug',
      orderBy: {
        field: 'name',
        descending: false,
      },
    },
    first: 1000,
    offset: 0,
  });

  const [errorMessage, setErrorMessage] = useState('');

  const { Modal } = useDialog({ isOpen, onClose });

  return (
    <Modal
      okButton={
        <LoadingButton
          onClick={() => {
            addDrugInterationGroup({
              input: {
                id: group.id,
                name: group.name,
                description: group.description,
                drugs: group.drugs.map(drug => drug.code),
              },
            })
              .then(() => onClose())
              .catch(err => {
                if (!err || !err.message) {
                  err = { message: t('messages.unknown-error') };
                }
                setErrorMessage(err.message);
              });
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
          ? t('label.add-interaction-group')
          : t('label.edit-interaction-group')
      }
    >
      {isLoading ? (
        <InlineSpinner />
      ) : (
        <Grid flexDirection="column" display="flex" gap={2}>
          <BasicTextInput
            autoFocus
            InputLabelProps={{ shrink: true }}
            label={t('label.name')}
            value={group.name}
            onChange={e => onUpdate({ name: e.target.value })}
          />
          <BasicTextInput
            InputLabelProps={{ shrink: true }}
            label={t('label.description')}
            value={group.description}
            onChange={e => onUpdate({ description: e.target.value })}
          />
          <DrugSelector
            records={data?.data ?? []}
            selectedIds={group.drugs.map(drug => drug.code)}
            setSelection={function (input: { drugIds: string[] }): void {
              onUpdate({
                drugs: input.drugIds.map(code => {
                  const drug = data?.data?.find(d => d.code === code);
                  return {
                    code: drug?.code ?? '',
                    description: drug?.description ?? '',
                  };
                }),
              });
            }}
            isLoading={drugListLoading}
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
          ) : null}{' '}
        </Grid>
      )}
    </Modal>
  );
};
