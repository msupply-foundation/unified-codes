import { useTranslation } from '@common/intl';
import { Box, Typography } from '@common/ui';
import React, { useState } from 'react';
import { useUuid } from '../../../hooks';
import { PropertiesModal } from './PropertiesModal';
import { useEditModal } from '@common/hooks';
import { ConsumableInput, Entity, Property } from '../types';
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
        <NameEditField
          disabled={initialIds.includes(draft.id)}
          value={draft.name}
          label={t('label.device-name')}
          showDeleteButton={false}
          onChange={e => setDraft({ ...draft, name: e.target.value })}
          onDelete={() => {
            setDraft({ ...draft, name: '' });
          }}
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
              disabled={initialIds.includes(pres.id)}
              value={pres.name}
              label={t('label.presentation')}
              onChange={e =>
                onUpdate({ ...pres, name: e.target.value }, draft.presentations)
              }
              onDelete={() => {
                onDelete(pres, draft.presentations);
              }}
            />
            <EditPropertiesButton
              parents={[draft]}
              entity={pres}
              onOpen={onOpenPropertiesModal}
            />
          </Box>

          {!!pres.extraDescriptions.length && (
            <Typography fontSize="12px">
              {t('label.extra-descriptions')}
            </Typography>
          )}

          {pres.extraDescriptions.map(description => (
            <TreeFormBox key={description.id}>
              <Box sx={{ display: 'flex', alignItems: 'end' }}>
                <NameEditField
                  disabled={initialIds.includes(description.id)}
                  value={description.name}
                  label={t('label.extra-description')}
                  onChange={e =>
                    onUpdate(
                      { ...description, name: e.target.value },
                      pres.extraDescriptions
                    )
                  }
                  onDelete={() => {
                    onDelete(description, pres.extraDescriptions);
                  }}
                />
                <EditPropertiesButton
                  parents={[draft, pres]}
                  entity={description}
                  onOpen={onOpenPropertiesModal}
                />
              </Box>
            </TreeFormBox>
          ))}

          <AddFieldButton
            label={t('label.add-extra-description')}
            onClick={() =>
              onUpdate(
                {
                  id: uuid(),
                  name: '',
                },
                pres.extraDescriptions
              )
            }
          />
        </TreeFormBox>
      ))}
      {draft.extraDescriptions.map(description => (
        <TreeFormBox key={description.id}>
          <Box sx={{ display: 'flex', alignItems: 'end' }}>
            <NameEditField
              disabled={initialIds.includes(description.id)}
              value={description.name}
              label={t('label.extra-description')}
              onChange={e =>
                onUpdate(
                  { ...description, name: e.target.value },
                  draft.extraDescriptions
                )
              }
              onDelete={() => {
                onDelete(description, draft.extraDescriptions);
              }}
            />
            <EditPropertiesButton
              parents={[draft]}
              entity={description}
              onOpen={onOpenPropertiesModal}
            />
          </Box>
        </TreeFormBox>
      ))}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <AddFieldButton
          label={t('label.add-presentation')}
          onClick={() =>
            onUpdate(
              { id: uuid(), name: '', extraDescriptions: [] },
              draft.presentations
            )
          }
        />
        <AddFieldButton
          label={t('label.add-extra-description')}
          onClick={() =>
            onUpdate({ id: uuid(), name: '' }, draft.extraDescriptions)
          }
        />
      </Box>
    </Box>
  );
};
