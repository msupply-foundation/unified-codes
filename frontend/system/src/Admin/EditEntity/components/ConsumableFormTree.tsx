import { useTranslation } from '@common/intl';
import { BasicTextInput, Box, Typography } from '@common/ui';
import React, { useState } from 'react';
import { useUuid } from '../../../hooks';
import { PropertiesModal } from './PropertiesModal';
import { useEditModal } from '@common/hooks';
import { ConsumableInput, Entity, Presentation, Property } from '../types';
import { TreeFormBox } from './TreeFormBox';
import { AddFieldButton } from './AddFieldButton';
import { EditPropertiesButton } from './EditPropertiesButton';
import { NameEditField } from './NameEditField';
import { ExistingNameSuggester } from './ExistingItemSuggester';

export const ConsumableFormTree = ({
  draft,
  setDraft,
  initialIds,
}: {
  draft: ConsumableInput;
  setDraft: (input: ConsumableInput) => void;
  initialIds: string[];
}) => {
  const t = useTranslation('system');

  const uuid = useUuid();

  const [propertiesModalState, setPropertiesModalState] = useState<{
    title: string;
    entityToUpdate: Entity;
  }>({
    title: draft.name,
    entityToUpdate: draft,
  });

  const {
    isOpen,
    onClose,
    onOpen,
    entity: propertiesModalData,
  } = useEditModal<Property[]>();

  const onOpenPropertiesModal = (title: string, entityToUpdate: Entity) => {
    setPropertiesModalState({
      title,
      entityToUpdate,
    });

    onOpen(entityToUpdate.properties);
  };

  const isDisabled = (id: string) => initialIds.includes(id);

  // It's a bit icky to reassign the property rather than maintaining immutability
  // but as long as we spread `draft` in the `setDraft`, the state is being updated
  // correctly, and this save us a lot of rebuilding of objects
  const onUpdate = <T extends Entity>(updated: T, list: T[]) => {
    const indexToUpdate = list.findIndex(item => item.id === updated.id);
    if (indexToUpdate >= 0) {
      list[indexToUpdate] = updated;
    } else {
      list.push(updated);
    }
    setDraft({ ...draft });
  };

  const onDelete = <T extends Entity>(toDelete: T, list: T[]) => {
    const indexToDelete = list.findIndex(item => item.id === toDelete.id);
    if (indexToDelete >= 0) {
      list.splice(indexToDelete, 1);
    }
    setDraft({ ...draft });
  };

  return (
    <Box sx={{ marginY: '16px', width: '100%' }}>
      {isOpen && (
        <PropertiesModal
          data={propertiesModalData}
          isOpen={isOpen}
          onClose={onClose}
          title={propertiesModalState.title}
          onSave={(newProperties: Property[]) => {
            propertiesModalState.entityToUpdate.properties = newProperties;
            setDraft({ ...draft });
          }}
        />
      )}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'end',
          flexDirection: 'row-reverse',
        }}
      >
        <Typography
          fontSize="12px"
          fontWeight="700"
          width="50px"
          textAlign="center"
        >
          {t('label.add-properties')}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'start' }}>
        <BasicTextInput
          autoFocus
          disabled={isDisabled(draft.id)}
          value={draft.name}
          onChange={e => setDraft({ ...draft, name: e.target.value })}
          fullWidth
          error={!draft.name}
          helperText={
            !draft.name
              ? t('error.required', { field: t('label.device-name') })
              : undefined
          }
        />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            paddingLeft: '10px',
          }}
        >
          <EditPropertiesButton
            parents={[]}
            entity={draft}
            onOpen={onOpenPropertiesModal}
          />
        </Box>
      </Box>

      {/* No initial ids === new item */}
      {!initialIds.length && <ExistingNameSuggester name={draft.name} />}

      {!!draft.presentations.length && (
        <Typography fontSize="12px">{t('label.presentations')}</Typography>
      )}

      {draft.presentations.map(pres => (
        <TreeFormBox key={pres.id}>
          <Box sx={{ display: 'flex', alignItems: 'end' }}>
            <NameEditField
              label={t('label.presentation')}
              entity={pres}
              siblings={draft.presentations}
              isDisabled={isDisabled}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
            <EditPropertiesButton
              parents={[draft]}
              entity={pres}
              onOpen={onOpenPropertiesModal}
            />
          </Box>

          <ExtraDescriptions
            parent={pres}
            grandparents={[draft]}
            isDisabled={isDisabled}
            onUpdate={onUpdate}
            onDelete={onDelete}
            onOpenPropertiesModal={onOpenPropertiesModal}
          />

          {!!pres.packSizes.length && (
            <Typography fontSize="12px">{t('label.pack-sizes')}</Typography>
          )}

          {pres.packSizes.map(packSize => (
            <TreeFormBox key={packSize.id}>
              <Box sx={{ display: 'flex', alignItems: 'end' }}>
                <NameEditField
                  label={t('label.pack-size')}
                  entity={packSize}
                  siblings={pres.packSizes}
                  isDisabled={isDisabled}
                  onUpdate={onUpdate}
                  onDelete={onDelete}
                />
                <EditPropertiesButton
                  parents={[draft, pres]}
                  entity={packSize}
                  onOpen={onOpenPropertiesModal}
                />
              </Box>
            </TreeFormBox>
          ))}

          <AddFieldButton
            label={t('label.add-pack-size')}
            onClick={() => onUpdate({ id: uuid(), name: '' }, pres.packSizes)}
          />
        </TreeFormBox>
      ))}
      <AddFieldButton
        label={t('label.add-presentation')}
        onClick={() =>
          onUpdate(
            { id: uuid(), name: '', extraDescriptions: [], packSizes: [] },
            draft.presentations
          )
        }
      />

      <ExtraDescriptions
        parent={draft}
        grandparents={[]}
        isDisabled={isDisabled}
        onUpdate={onUpdate}
        onDelete={onDelete}
        onOpenPropertiesModal={onOpenPropertiesModal}
      />

      <Box>
        {!!draft.alternativeNames.length && (
          <Typography fontSize="12px">{t('label.alt-names')}</Typography>
        )}

        {draft.alternativeNames.map(n => (
          <TreeFormBox key={n.id}>
            <Box sx={{ display: 'flex', alignItems: 'end' }}>
              <NameEditField
                entity={n}
                siblings={draft.alternativeNames}
                isDisabled={() => initialIds.includes(n.code || '')}
                label={t('label.alt-name')}
                onUpdate={onUpdate}
                onDelete={onDelete}
              />
            </Box>
          </TreeFormBox>
        ))}

        <AddFieldButton
          label={t('label.add-alternative-name')}
          onClick={() =>
            onUpdate({ id: uuid(), name: '' }, draft.alternativeNames)
          }
        />
      </Box>
    </Box>
  );
};

const ExtraDescriptions = ({
  parent,
  grandparents,
  isDisabled,
  onUpdate,
  onDelete,
  onOpenPropertiesModal,
}: {
  parent: Presentation | ConsumableInput;
  grandparents: Entity[];
  isDisabled: (id: string) => boolean;
  onUpdate: <T extends Entity>(updated: T, list: T[]) => void;
  onDelete: <T extends Entity>(toDelete: T, list: T[]) => void;
  onOpenPropertiesModal: (title: string, entityToUpdate: Entity) => void;
}) => {
  const uuid = useUuid();
  const t = useTranslation('system');

  return (
    <Box>
      {!!parent.extraDescriptions.length && (
        <Typography fontSize="12px">{t('label.extra-descriptions')}</Typography>
      )}

      {parent.extraDescriptions.map(description => (
        <TreeFormBox key={description.id}>
          <Box sx={{ display: 'flex', alignItems: 'end' }}>
            <NameEditField
              label={t('label.extra-description')}
              entity={description}
              siblings={parent.extraDescriptions}
              isDisabled={isDisabled}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
            <EditPropertiesButton
              parents={[...grandparents, parent]}
              entity={description}
              onOpen={onOpenPropertiesModal}
            />
          </Box>

          {!!description.packSizes.length && (
            <Typography fontSize="12px">{t('label.pack-sizes')}</Typography>
          )}

          {description.packSizes.map(packSize => (
            <TreeFormBox key={packSize.id}>
              <Box sx={{ display: 'flex', alignItems: 'end' }}>
                <NameEditField
                  label={t('label.pack-size')}
                  entity={packSize}
                  siblings={description.packSizes}
                  isDisabled={isDisabled}
                  onUpdate={onUpdate}
                  onDelete={onDelete}
                />
                <EditPropertiesButton
                  parents={[...grandparents, parent, description]}
                  entity={packSize}
                  onOpen={onOpenPropertiesModal}
                />
              </Box>
            </TreeFormBox>
          ))}

          <AddFieldButton
            label={t('label.add-pack-size')}
            onClick={() =>
              onUpdate({ id: uuid(), name: '' }, description.packSizes)
            }
          />
        </TreeFormBox>
      ))}

      <AddFieldButton
        label={t('label.add-extra-description')}
        onClick={() =>
          onUpdate(
            {
              id: uuid(),
              name: '',
              packSizes: [],
            },
            parent.extraDescriptions
          )
        }
      />
    </Box>
  );
};
