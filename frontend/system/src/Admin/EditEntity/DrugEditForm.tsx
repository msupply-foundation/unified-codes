import { useTranslation } from '@common/intl';
import { Box, SaveIcon, LoadingButton } from '@common/ui';
import React, { useState } from 'react';
import { useUuid } from '../../hooks';
import { DrugInput, EntityDetails } from './types';
import { useNotification } from '@common/hooks';
import {
  buildDrugInputFromEntity,
  buildEntityFromDrugInput,
  getAllEntityCodes,
  isValidDrugInput,
} from './helpers';
import { ChangeTypeNode, RouteBuilder, useNavigate } from 'frontend/common/src';
import { AppRoute } from 'frontend/config/src';
import { useRequestChange } from '../api';
import { EntityCategory } from 'frontend/system/src/constants';
import { DrugFormTree } from './components/DrugFormTree';

export const DrugEditForm = ({
  initialEntity,
}: {
  initialEntity?: EntityDetails;
}) => {
  const t = useTranslation('system');
  const navigate = useNavigate();

  const { mutateAsync: requestChange, isLoading } = useRequestChange();
  const { success, error } = useNotification();

  const [initialIds] = useState(getAllEntityCodes(initialEntity));

  const uuid = useUuid();

  const [draft, setDraft] = useState<DrugInput>(
    initialEntity
      ? buildDrugInputFromEntity(initialEntity)
      : {
          id: uuid(),
          name: '',
          routes: [],
        }
  );

  const onSubmit = () => {
    // Convert the draft to a UpsertEntityInput type (stored within the change request until approved)
    const entity = buildEntityFromDrugInput(draft);

    requestChange({
      input: {
        requestId: uuid(),
        category: EntityCategory.Drug,
        changeType: initialEntity ? ChangeTypeNode.Change : ChangeTypeNode.New,
        name: draft.name,
        requestedFor: 'Country - coming soon', // TODO: capture this
        body: JSON.stringify(entity),
        // NOTE: storing the full entity, which will be upserted on approval. If two change requests are
        // made, there will be a conflict, and the second would overwrite the first. However it doesn't seem
        // super likely for multiple change requests to be made against an entity at any given time... could
        // store only the changed/new nodes and build a diff against the exisitng entity, but that would be
        // more work for now
      },
    })
      .then(() => {
        if (!initialEntity) {
          // new entity - clear the form
          success(
            t('message.entity-created', {
              name: entity.name,
            })
          )();
          setDraft({
            id: uuid(),
            name: '',
            routes: [],
          });
        } else {
          // existing entity - back to details page
          success(
            t('message.entity-updated', {
              name: entity.name,
            })
          )();
          navigate(
            RouteBuilder.create(AppRoute.Browse)
              .addPart(initialEntity.code)
              .build()
          );
        }
      })
      .catch(e => {
        console.error(e);
        error(t('message.entity-error'))();
      });
  };

  const saveButtonDisabled =
    !isValidDrugInput(draft) ||
    // if editing existing entity, disable save if no change has been made
    (initialEntity &&
      JSON.stringify(draft) ===
        JSON.stringify(buildDrugInputFromEntity(initialEntity)));

  return (
    <Box sx={{ width: '100%' }}>
      <DrugFormTree draft={draft} setDraft={setDraft} initialIds={initialIds} />
      <Box
        sx={{ display: 'flex', justifyContent: 'end', paddingBottom: '16px' }}
      >
        <LoadingButton
          isLoading={isLoading}
          startIcon={<SaveIcon />}
          disabled={saveButtonDisabled}
          onClick={onSubmit}
          variant="contained"
        >
          {t('button.submit')}
        </LoadingButton>
      </Box>
    </Box>
  );
};
