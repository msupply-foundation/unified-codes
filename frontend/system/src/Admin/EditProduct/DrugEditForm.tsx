import { useTranslation } from '@common/intl';
import {
  BasicTextInput,
  Box,
  Typography,
  SaveIcon,
  ButtonWithIcon,
} from '@common/ui';
import React, { useState } from 'react';
import { config } from '../../config';
import { useUuid } from '../../hooks';
import { PropertiesModal } from './components/PropertiesModal';
import { useEditModal } from '@common/hooks';
import { DrugInput, Entity, EntityDetails, Property } from './types';
import { TreeFormBox } from './components/TreeFormBox';
import { CategoryDropdown } from './components/CategoryDropdown';
import { AddFieldButton } from './components/AddFieldButton';
import { EditPropertiesButton } from './components/EditPropertiesButton';
import { buildDrugInputFromEntity, getAllEntityCodes } from './helpers';

export const DrugEditForm = ({
  initialEntity,
}: {
  initialEntity?: EntityDetails;
}) => {
  const t = useTranslation('system');
  const [initialIds] = useState(getAllEntityCodes(initialEntity));

  // throwaway ids as a dgraph uid will be assigned when the entity is stored
  const makeThrowawayId = useUuid();

  const [draft, setDraft] = useState<DrugInput>(
    initialEntity
      ? buildDrugInputFromEntity(initialEntity)
      : {
          id: makeThrowawayId(),
          name: '',
          routes: [],
        }
  );

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

  const onSubmit = () => {
    console.log(draft);
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

      <Box sx={{ display: 'flex', alignItems: 'end' }}>
        <BasicTextInput
          autoFocus
          disabled={initialIds.includes(draft.id)}
          value={draft.name}
          onChange={e => setDraft({ ...draft, name: e.target.value })}
          label={t('label.drug-name')}
          InputLabelProps={{ shrink: true }}
          fullWidth
        />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
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
          <EditPropertiesButton
            parents={[]}
            entity={draft}
            onOpen={onOpenPropertiesModal}
          />
        </Box>
      </Box>

      {!!draft.routes.length && (
        <Typography fontSize="12px">{t('label.routes')}</Typography>
      )}

      {draft.routes.map(route => (
        <TreeFormBox key={route.id}>
          <Box sx={{ display: 'flex', alignItems: 'end' }}>
            <CategoryDropdown
              disabled={initialIds.includes(route.id)}
              value={route.name}
              options={config.routes}
              onChange={name => onUpdate({ ...route, name }, draft.routes)}
              getOptionDisabled={o =>
                !!draft.routes.find(r => r.name === o.value)
              }
            />
            <EditPropertiesButton
              parents={[draft]}
              entity={route}
              onOpen={onOpenPropertiesModal}
            />
          </Box>

          {!!route.forms.length && (
            <Typography fontSize="12px">{t('label.forms')}</Typography>
          )}

          {route.forms.map(form => (
            <TreeFormBox key={form.id}>
              <Box sx={{ display: 'flex', alignItems: 'end' }}>
                <CategoryDropdown
                  disabled={initialIds.includes(form.id)}
                  value={form.name}
                  options={config.forms}
                  onChange={name => onUpdate({ ...form, name }, route.forms)}
                  getOptionDisabled={o =>
                    !!route.forms.find(f => f.name === o.value)
                  }
                />
                <EditPropertiesButton
                  parents={[draft, route]}
                  entity={form}
                  onOpen={onOpenPropertiesModal}
                />
              </Box>
              {!!form.strengths.length && (
                <Typography fontSize="12px">{t('label.strengths')}</Typography>
              )}

              {form.strengths.map(strength => (
                <TreeFormBox key={strength.id}>
                  <Box sx={{ display: 'flex', alignItems: 'end' }}>
                    <BasicTextInput
                      autoFocus
                      disabled={initialIds.includes(strength.id)}
                      value={strength.name}
                      onChange={e =>
                        onUpdate(
                          { ...strength, name: e.target.value },
                          form.strengths
                        )
                      }
                      fullWidth
                    />
                    <EditPropertiesButton
                      parents={[draft, route, form]}
                      entity={strength}
                      onOpen={onOpenPropertiesModal}
                    />
                  </Box>

                  {!!strength.units.length && (
                    <Typography fontSize="12px">{t('label.units')}</Typography>
                  )}

                  {strength.units.map(unit => (
                    <TreeFormBox key={unit.id}>
                      <Box sx={{ display: 'flex', alignItems: 'end' }}>
                        <BasicTextInput
                          autoFocus
                          disabled={initialIds.includes(unit.id)}
                          value={unit.name}
                          onChange={e =>
                            onUpdate(
                              { ...unit, name: e.target.value },
                              strength.units
                            )
                          }
                          fullWidth
                        />
                        <EditPropertiesButton
                          parents={[draft, route, form, strength]}
                          entity={unit}
                          onOpen={onOpenPropertiesModal}
                        />
                      </Box>
                    </TreeFormBox>
                  ))}

                  <AddFieldButton
                    label={t('label.add-unit')}
                    onClick={() =>
                      onUpdate(
                        {
                          id: makeThrowawayId(),
                          name: '',
                        },
                        strength.units
                      )
                    }
                  />
                </TreeFormBox>
              ))}

              <AddFieldButton
                label={t('label.add-strength')}
                onClick={() =>
                  onUpdate(
                    { id: makeThrowawayId(), name: '', units: [] },
                    form.strengths
                  )
                }
              />
            </TreeFormBox>
          ))}

          <AddFieldButton
            label={t('label.add-form')}
            onClick={() =>
              onUpdate(
                { id: makeThrowawayId(), name: '', strengths: [] },
                route.forms
              )
            }
          />
        </TreeFormBox>
      ))}

      <AddFieldButton
        label={t('label.add-route')}
        onClick={() =>
          onUpdate({ id: makeThrowawayId(), name: '', forms: [] }, draft.routes)
        }
      />

      <Box sx={{ display: 'flex', justifyContent: 'end' }}>
        <ButtonWithIcon
          Icon={<SaveIcon />}
          label={t('button.save')}
          onClick={onSubmit}
          variant="contained"
        />
      </Box>
    </Box>
  );
};
