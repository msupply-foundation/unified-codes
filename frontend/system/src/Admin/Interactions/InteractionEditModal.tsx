import {
  Autocomplete,
  BasicTextInput,
  DialogButton,
  InlineSpinner,
  LoadingButton,
  Select,
  TextArea,
  Typography,
} from '@common/components';
import { ModalMode, useDialog } from '@common/hooks';
import { CheckIcon } from '@common/icons';
import { useTranslation } from '@common/intl';
import { Grid } from '@common/ui';
import React, { useState } from 'react';
import { useUuid } from '../../hooks';
import { useEntities } from '../../Entities/api';
import { useAllDrugInteractionGroups } from './api';
import { DrugOrGroupSelector } from './DrugOrGroupSelector';
import { DrugInteractionSeverityNode } from '@common/types';
import { DrugInteractionFragment } from './api/operations.generated';

type InteractionEditModalProps = {
  isOpen: boolean;
  mode: ModalMode | null;
  interaction: DrugInteractionFragment | null;
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

  const [draft, setDraft] = useState<DrugInteractionFragment>({
    id: interaction?.id ?? uuid(),
    name: interaction?.name ?? '',
    severity:
      interaction?.severity ?? DrugInteractionSeverityNode.NothingExpected,
    description: interaction?.description ?? '',
    action: interaction?.action ?? '',
    reference: interaction?.reference ?? '',
    drug1: interaction?.drug1,
    drug2: interaction?.drug2,
    group1: interaction?.group1,
    group2: interaction?.group2,
  });

  const { data: drugs, isLoading: drugListLoading } = useEntities({
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

  const { data: groups, isLoading: groupListLoading } =
    useAllDrugInteractionGroups();

  const { Modal } = useDialog({ isOpen, onClose });

  // TODO: set from queries
  const isLoading = false;

  const isInvalid = !draft.name || !draft.description || !draft.severity;
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
            value={draft?.name ?? ''}
            onChange={e => setDraft({ ...draft, name: e.currentTarget.value })}
          />

          <DrugOrGroupSelector
            drugs={drugs?.data ?? []}
            groups={groups ?? []}
            initialSelectedId={draft.group1?.id ?? draft.drug1?.code}
            setSelection={function (input: {
              drugId?: string | undefined;
              groupId?: string | undefined;
            }): void {
              // TODO....
              // throw new Error('Function not implemented.');
            }}
            isLoading={drugListLoading || groupListLoading}
          />

          <Grid item>
            <Typography variant="h6">Interacts with</Typography>
          </Grid>

          <DrugOrGroupSelector
            drugs={drugs?.data ?? []}
            groups={groups ?? []}
            initialSelectedId={draft.group2?.id ?? draft.drug2?.code}
            setSelection={function (input: {
              drugId?: string | undefined;
              groupId?: string | undefined;
            }): void {
              // TODO....
              // throw new Error('Function not implemented.');
            }}
            isLoading={drugListLoading || groupListLoading}
          />

          <Select
            label={t('label.severity')}
            required
            value={draft?.severity ?? DrugInteractionSeverityNode.Unknown}
            options={Object.values(DrugInteractionSeverityNode).map(
              severity => ({
                id: severity,
                label: severity,
                value: severity,
              })
            )}
            onChange={e =>
              setDraft({
                ...draft,
                severity: e.target.value as DrugInteractionSeverityNode,
              })
            }
            fullWidth
          />
          <TextArea
            label={t('label.description')}
            value={draft?.description ?? ''}
            onChange={e =>
              setDraft({ ...draft, description: e.currentTarget.value })
            }
            inputProps={{
              sx: {
                backgroundColor: (theme: {
                  palette: { background: { menu: any } };
                }) => theme.palette.background.menu,
                borderRadius: '8px',
              },
            }}
          />

          <TextArea
            label={t('label.action')}
            value={draft?.action ?? ''}
            onChange={e =>
              setDraft({ ...draft, action: e.currentTarget.value })
            }
            inputProps={{
              sx: {
                backgroundColor: (theme: {
                  palette: { background: { menu: any } };
                }) => theme.palette.background.menu,
                borderRadius: '8px',
              },
            }}
          />

          <TextArea
            label={t('label.reference')}
            value={draft?.reference ?? ''}
            onChange={e =>
              setDraft({ ...draft, reference: e.currentTarget.value })
            }
            inputProps={{
              sx: {
                backgroundColor: (theme: {
                  palette: { background: { menu: any } };
                }) => theme.palette.background.menu,
                borderRadius: '8px',
              },
            }}
          />
        </Grid>
      )}
    </Modal>
  );
};
