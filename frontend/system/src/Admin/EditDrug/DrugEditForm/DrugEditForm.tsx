import { useTranslation } from '@common/intl';
import { Box, Typography, SaveIcon, ButtonWithIcon } from '@common/ui';
import React, { useState } from 'react';
import { config } from '../../../config';
import { useUuid } from '../../../hooks';
import { PropertiesModal } from './PropertiesModal';
import { useEditModal, useNotification } from '@common/hooks';
import { DrugInput, Entity, EntityDetails, Property } from '../types';
import { TreeFormBox } from './TreeFormBox';
import { CategoryDropdown } from './CategoryDropdown';
import { AddFieldButton } from './AddFieldButton';
import { EditPropertiesButton } from './EditPropertiesButton';
import {
  buildDrugInputFromEntity,
  buildEntityFromDrugInput,
  getAllEntityCodes,
  isValidDrugInput,
} from '../helpers';
import { ChangeTypeNode, RouteBuilder, useNavigate } from 'frontend/common/src';
import { AppRoute } from 'frontend/config/src';
import { NameEditField } from './NameEditField';
import { useRequestChange } from '../../api';
import { EntityCategory } from 'frontend/system/src/constants';

export const DrugEditForm = ({
  initialEntity,
}: {
  initialEntity?: EntityDetails;
}) => {
  const t = useTranslation('system');
  const navigate = useNavigate();

  const [requestChange, invalidateQueries] = useRequestChange();
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

  const [propertiesModalState, setPropertiesModalState] = useState<{
    disabled: boolean;
    title: string;
    entityToUpdate: Entity;
  }>({
    disabled: true,
    title: draft.name,
    entityToUpdate: draft,
  });

  const {
    isOpen,
    onClose,
    onOpen,
    entity: propertiesModalData,
  } = useEditModal<Property[]>();

  const onOpenPropertiesModal = (
    disabled: boolean,
    title: string,
    entityToUpdate: Entity
  ) => {
    setPropertiesModalState({
      disabled,
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
      },
    })
      .then(() => {
        invalidateQueries();
        if (!initialEntity) {
          // new entity - clear the form and show success snack
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
          label={t('label.drug-name')}
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
              onDelete={() => {
                onDelete(route, draft.routes);
              }}
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
                  onDelete={() => {
                    onDelete(form, route.forms);
                  }}
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
                    <NameEditField
                      disabled={initialIds.includes(strength.id)}
                      value={strength.name}
                      label={t('label.strength')}
                      onChange={e =>
                        onUpdate(
                          { ...strength, name: e.target.value },
                          form.strengths
                        )
                      }
                      onDelete={() => {
                        onDelete(strength, form.strengths);
                      }}
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
                        <NameEditField
                          disabled={initialIds.includes(unit.id)}
                          value={unit.name}
                          label={t('label.unit')}
                          onChange={e =>
                            onUpdate(
                              { ...unit, name: e.target.value },
                              strength.units
                            )
                          }
                          onDelete={() => {
                            onDelete(unit, strength.units);
                          }}
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
                          id: uuid(),
                          name: '',
                          immediatePackagings: [],
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
                  onUpdate({ id: uuid(), name: '', units: [] }, form.strengths)
                }
              />
            </TreeFormBox>
          ))}

          <AddFieldButton
            label={t('label.add-form')}
            onClick={() =>
              onUpdate({ id: uuid(), name: '', strengths: [] }, route.forms)
            }
          />
        </TreeFormBox>
      ))}

      <AddFieldButton
        label={t('label.add-route')}
        onClick={() =>
          onUpdate({ id: uuid(), name: '', forms: [] }, draft.routes)
        }
      />

      <Box
        sx={{ display: 'flex', justifyContent: 'end', paddingBottom: '16px' }}
      >
        <ButtonWithIcon
          disabled={!isValidDrugInput(draft)}
          Icon={<SaveIcon />}
          label={t('button.save')}
          onClick={onSubmit}
          variant="contained"
        />
      </Box>
    </Box>
  );
};
