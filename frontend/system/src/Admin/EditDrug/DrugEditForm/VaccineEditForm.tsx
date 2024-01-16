import { useTranslation } from '@common/intl';
import {
  Box,
  Typography,
  SaveIcon,
  ButtonWithIcon,
  LoadingButton,
} from '@common/ui';
import React, { useState } from 'react';
import { useUuid } from '../../../hooks';
import { PropertiesModal } from './PropertiesModal';
import { useEditModal, useNotification } from '@common/hooks';
import { Entity, EntityDetails, Property, VaccineInput } from '../types';
import { TreeFormBox } from './TreeFormBox';
import { CategoryDropdown } from './CategoryDropdown';
import { AddFieldButton } from './AddFieldButton';
import { EditPropertiesButton } from './EditPropertiesButton';
import {
  buildEntityFromVaccineInput,
  buildVaccineInputFromEntity,
  getAllEntityCodes,
  isValidVaccineInput,
} from '../helpers';
import {
  ChangeTypeNode,
  RouteBuilder,
  useNavigate,
  ConfigurationItemTypeInput,
} from 'frontend/common/src';
import { AppRoute } from 'frontend/config/src';
import { NameEditField } from './NameEditField';
import { useRequestChange } from '../../api';
import { EntityCategory } from 'frontend/system/src/constants';
import { useConfigurationItems } from '../../Configuration/api';

export const VaccineEditForm = ({
  initialEntity,
}: {
  initialEntity?: EntityDetails;
}) => {
  const t = useTranslation('system');
  const navigate = useNavigate();

  const [isSaving, setIsSaving] = useState(false);
  const [requestChange, invalidateQueries] = useRequestChange();
  const { success, error } = useNotification();

  const [initialIds] = useState(getAllEntityCodes(initialEntity));

  const uuid = useUuid();

  const [draft, setDraft] = useState<VaccineInput>(
    initialEntity
      ? buildVaccineInputFromEntity(initialEntity)
      : {
          id: uuid(),
          name: '',
          components: [],
        }
  );

  // Get the route, form, and immediate packaging options

  const { data: routes, isLoading: isLoadingRoutes } = useConfigurationItems({
    type: ConfigurationItemTypeInput.Route,
  });

  const { data: forms, isLoading: isLoadingForms } = useConfigurationItems({
    type: ConfigurationItemTypeInput.Form,
  });

  const { data: immediatePackagings, isLoading: isLoadingImmediatePackagings } =
    useConfigurationItems({
      type: ConfigurationItemTypeInput.ImmediatePackaging,
    });

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
    setIsSaving(true);

    // Convert the draft to a UpsertEntityInput type (stored within the change request until approved)
    const entity = buildEntityFromVaccineInput(draft);

    requestChange({
      input: {
        requestId: uuid(),
        category: EntityCategory.Vaccine,
        changeType: initialEntity ? ChangeTypeNode.Change : ChangeTypeNode.New,
        name: draft.name,
        requestedFor: 'Country - coming soon', // TODO: capture this - double check this is useful info?
        body: JSON.stringify(entity),
        // NOTE: storing the full entity, which will be upserted on approval. If two change requests are
        // made, there will be a conflict, and the second would overwrite the first. However it doesn't seem
        // super likely for multiple change requests to be made against an entity at any given time... could
        // store only the changed/new nodes and build a diff against the exisitng entity, but that would be
        // more work for now
      },
    })
      .then(() => {
        invalidateQueries();
        setIsSaving(false);

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
            components: [],
          });
        } else {
          // existing entity - back to details page
          navigate(
            RouteBuilder.create(AppRoute.Browse)
              .addPart(initialEntity.code)
              .addPart('?changeRequested=true')
              .build()
          );
        }
      })
      .catch(e => {
        setIsSaving(false);
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
          label={t('label.vaccine-name')}
          showDeleteButton={false}
          onChange={e => setDraft({ ...draft, name: e.target.value })}
          onDelete={() => setDraft({ ...draft, name: '' })}
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

      {!!draft.components.length && (
        <Typography fontSize="12px">{t('label.components')}</Typography>
      )}

      {draft.components.map(component => (
        <TreeFormBox key={component.id}>
          <Box sx={{ display: 'flex', alignItems: 'end' }}>
            <NameEditField
              disabled={initialIds.includes(component.id)}
              value={component.name}
              label={t('label.component')}
              onChange={e =>
                onUpdate(
                  { ...component, name: e.target.value },
                  draft.components
                )
              }
              onDelete={() => onDelete(component, draft.components)}
            />
            <EditPropertiesButton
              parents={[draft]}
              entity={component}
              onOpen={onOpenPropertiesModal}
            />
          </Box>

          {!!component.brands.length && (
            <Typography fontSize="12px">{t('label.brands')}</Typography>
          )}

          {component.brands.map(brand => (
            <TreeFormBox key={brand.id}>
              <Box sx={{ display: 'flex', alignItems: 'end' }}>
                <NameEditField
                  disabled={initialIds.includes(brand.id)}
                  value={brand.name}
                  label={t('label.brand')}
                  onChange={e =>
                    onUpdate(
                      { ...brand, name: e.target.value },
                      component.brands
                    )
                  }
                  onDelete={() => onDelete(brand, component.brands)}
                />
                <EditPropertiesButton
                  parents={[draft, component]}
                  entity={brand}
                  onOpen={onOpenPropertiesModal}
                />
              </Box>

              {!!brand.routes.length && (
                <Typography fontSize="12px">{t('label.routes')}</Typography>
              )}

              {brand.routes.map(route => (
                <TreeFormBox key={route.id}>
                  <Box sx={{ display: 'flex', alignItems: 'end' }}>
                    <CategoryDropdown
                      disabled={initialIds.includes(route.id)}
                      value={route.name}
                      options={
                        routes?.map(r => ({ label: r.name, value: r.name })) ??
                        []
                      }
                      onChange={name =>
                        onUpdate({ ...route, name }, brand.routes)
                      }
                      getOptionDisabled={o =>
                        !!brand.routes.find(r => r.name === o.value)
                      }
                      onDelete={() => onDelete(route, brand.routes)}
                    />
                    <EditPropertiesButton
                      parents={[draft, component, brand]}
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
                          options={
                            forms?.map(r => ({
                              label: r.name,
                              value: r.name,
                            })) ?? []
                          }
                          onChange={name =>
                            onUpdate({ ...form, name }, route.forms)
                          }
                          getOptionDisabled={o =>
                            !!route.forms.find(f => f.name === o.value)
                          }
                          onDelete={() => onDelete(form, route.forms)}
                        />
                        <EditPropertiesButton
                          parents={[draft, component, brand, route]}
                          entity={form}
                          onOpen={onOpenPropertiesModal}
                        />
                      </Box>
                      {!!form.strengths.length && (
                        <Typography fontSize="12px">
                          {t('label.strengths')}
                        </Typography>
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
                              onDelete={() =>
                                onDelete(strength, form.strengths)
                              }
                            />
                            <EditPropertiesButton
                              parents={[draft, component, brand, route, form]}
                              entity={strength}
                              onOpen={onOpenPropertiesModal}
                            />
                          </Box>

                          {!!strength.units.length && (
                            <Typography fontSize="12px">
                              {t('label.units')}
                            </Typography>
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
                                  onDelete={() =>
                                    onDelete(unit, strength.units)
                                  }
                                />
                                <EditPropertiesButton
                                  parents={[
                                    draft,
                                    component,
                                    brand,
                                    route,
                                    form,
                                    strength,
                                  ]}
                                  entity={unit}
                                  onOpen={onOpenPropertiesModal}
                                />
                              </Box>

                              {!!unit.immediatePackagings.length && (
                                <Typography fontSize="12px">
                                  {t('label.immediate-packaging')}
                                </Typography>
                              )}

                              {unit.immediatePackagings.map(immPack => (
                                <TreeFormBox key={immPack.id}>
                                  <Box
                                    sx={{ display: 'flex', alignItems: 'end' }}
                                  >
                                    <CategoryDropdown
                                      disabled={initialIds.includes(immPack.id)}
                                      value={immPack.name}
                                      options={
                                        immediatePackagings?.map(o => ({
                                          label: o.name,
                                          value: o.name,
                                        })) ?? []
                                      }
                                      onChange={name =>
                                        onUpdate(
                                          { ...immPack, name },
                                          unit.immediatePackagings
                                        )
                                      }
                                      getOptionDisabled={o =>
                                        !!unit.immediatePackagings.find(
                                          i => i.name === o.value
                                        )
                                      }
                                      onDelete={() =>
                                        onDelete(
                                          immPack,
                                          unit.immediatePackagings
                                        )
                                      }
                                    />
                                    <EditPropertiesButton
                                      parents={[
                                        draft,
                                        component,
                                        brand,
                                        route,
                                        form,
                                        strength,
                                        unit,
                                      ]}
                                      entity={immPack}
                                      onOpen={onOpenPropertiesModal}
                                    />
                                  </Box>
                                </TreeFormBox>
                              ))}
                              <AddFieldButton
                                label={t('label.add-immediate-packaging')}
                                onClick={() =>
                                  onUpdate(
                                    {
                                      id: uuid(),
                                      name: '',
                                    },
                                    unit.immediatePackagings
                                  )
                                }
                                isLoading={isLoadingImmediatePackagings}
                              />
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
                          onUpdate(
                            { id: uuid(), name: '', units: [] },
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
                        { id: uuid(), name: '', strengths: [] },
                        route.forms
                      )
                    }
                    isLoading={isLoadingForms}
                  />
                </TreeFormBox>
              ))}

              <AddFieldButton
                label={t('label.add-route')}
                onClick={() =>
                  onUpdate({ id: uuid(), name: '', forms: [] }, brand.routes)
                }
                isLoading={isLoadingRoutes}
              />
            </TreeFormBox>
          ))}

          <AddFieldButton
            label={t('label.add-brand')}
            onClick={() =>
              onUpdate({ id: uuid(), name: '', routes: [] }, component.brands)
            }
          />
        </TreeFormBox>
      ))}

      <AddFieldButton
        label={t('label.add-component')}
        onClick={() =>
          onUpdate({ id: uuid(), name: '', brands: [] }, draft.components)
        }
      />

      <Box
        sx={{ display: 'flex', justifyContent: 'end', paddingBottom: '16px' }}
      >
        <LoadingButton
          isLoading={isSaving}
          startIcon={<SaveIcon />}
          disabled={!isValidVaccineInput(draft)}
          onClick={onSubmit}
          variant="contained"
        >
          {t('button.save')}
        </LoadingButton>
      </Box>
    </Box>
  );
};
