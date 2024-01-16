import { useTranslation } from '@common/intl';
import { Box, SaveIcon, LoadingButton } from '@common/ui';
import React, { useMemo, useState } from 'react';
import { useUuid } from '../../hooks';
import { ConsumableInput, EntityDetails } from './types';
import {
  buildConsumableInputFromEntity,
  buildEntityFromConsumableInput,
  getAllEntityCodes,
  isValidConsumableInput,
} from './helpers';
import { ConsumableFormTree } from './components/ConsumableFormTree';
import {
  ChangeTypeNode,
  RouteBuilder,
  useNavigate,
  useNotification,
} from 'frontend/common/src';
import { useRequestChange } from '../api';
import { EntityCategory } from '../../constants';
import { AppRoute } from 'frontend/config/src';

export const ConsumableEditForm = ({
  initialEntity,
}: {
  initialEntity?: EntityDetails;
}) => {
  const t = useTranslation('system');
  const navigate = useNavigate();

  const { mutateAsync: requestChange, isLoading } = useRequestChange();
  const { success, error } = useNotification();

  const initialIds = useMemo(
    () => getAllEntityCodes(initialEntity),
    [initialEntity]
  );

  const uuid = useUuid();

  const [draft, setDraft] = useState<ConsumableInput>(
    initialEntity
      ? buildConsumableInputFromEntity(initialEntity)
      : {
          id: uuid(),
          name: '',
          presentations: [],
          extraDescriptions: [],
        }
  );

  const onSubmit = () => {
    // Convert the draft to a UpsertEntityInput type (stored within the change request until approved)
    const entity = buildEntityFromConsumableInput(draft);

    requestChange({
      input: {
        requestId: uuid(),
        category: EntityCategory.Consumable,
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
            presentations: [],
            extraDescriptions: [],
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
    !isValidConsumableInput(draft) ||
    // if editing existing entity, disable save if no change has been made
    (initialEntity &&
      JSON.stringify(draft) ===
        JSON.stringify(buildConsumableInputFromEntity(initialEntity)));

  return (
    <Box sx={{ width: '100%' }}>
      <ConsumableFormTree
        draft={draft}
        setDraft={setDraft}
        initialIds={initialIds}
      />
      <Box sx={{ display: 'flex', justifyContent: 'end' }}>
        <LoadingButton
          isLoading={isLoading}
          disabled={saveButtonDisabled}
          startIcon={<SaveIcon />}
          onClick={onSubmit}
          variant="contained"
        >
          {t('button.submit')}
        </LoadingButton>
      </Box>
    </Box>
  );
};
