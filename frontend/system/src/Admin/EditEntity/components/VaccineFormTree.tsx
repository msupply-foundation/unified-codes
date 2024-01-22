import { useTranslation } from '@common/intl';
import { Box, Typography } from '@common/ui';
import React, { useState } from 'react';
import { useUuid } from '../../../hooks';
import { PropertiesModal } from './PropertiesModal';
import { useEditModal } from '@common/hooks';
import { Entity, Property, VaccineInput } from '../types';
import { TreeFormBox } from './TreeFormBox';
import { CategoryDropdown } from './CategoryDropdown';
import { AddFieldButton } from './AddFieldButton';
import { EditPropertiesButton } from './EditPropertiesButton';
import { NameEditField } from './NameEditField';
import { useConfigurationItems } from '../../Configuration/api';
import { ConfigurationItemTypeInput } from '@common/types';

export const VaccineFormTree = ({
  draft,
  setDraft,
  initialIds,
}: {
  draft: VaccineInput;
  setDraft: (input: VaccineInput) => void;
  initialIds: string[];
}) => {
  const t = useTranslation('system');

  const uuid = useUuid();

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

      {!!draft.activeIngredients.length && (
        <Typography fontSize="12px">{t('label.active-ingredients')}</Typography>
      )}

      {draft.activeIngredients.map(activeIngredient => (
        <TreeFormBox key={activeIngredient.id}>
          <Box sx={{ display: 'flex', alignItems: 'end' }}>
            <NameEditField
              disabled={initialIds.includes(activeIngredient.id)}
              value={activeIngredient.name}
              label={t('label.active-ingredients')}
              onChange={e =>
                onUpdate(
                  { ...activeIngredient, name: e.target.value },
                  draft.activeIngredients
                )
              }
              onDelete={() =>
                onDelete(activeIngredient, draft.activeIngredients)
              }
            />
            <EditPropertiesButton
              parents={[draft]}
              entity={activeIngredient}
              onOpen={onOpenPropertiesModal}
            />
          </Box>

          {!!activeIngredient.brands.length && (
            <Typography fontSize="12px">{t('label.brands')}</Typography>
          )}

          {activeIngredient.brands.map(brand => (
            <TreeFormBox key={brand.id}>
              <Box sx={{ display: 'flex', alignItems: 'end' }}>
                <NameEditField
                  disabled={initialIds.includes(brand.id)}
                  value={brand.name}
                  label={t('label.brand')}
                  onChange={e =>
                    onUpdate(
                      { ...brand, name: e.target.value },
                      activeIngredient.brands
                    )
                  }
                  onDelete={() => onDelete(brand, activeIngredient.brands)}
                />
                <EditPropertiesButton
                  parents={[draft, activeIngredient]}
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
                      parents={[draft, activeIngredient, brand]}
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
                          parents={[draft, activeIngredient, brand, route]}
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
                              parents={[
                                draft,
                                activeIngredient,
                                brand,
                                route,
                                form,
                              ]}
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
                                    activeIngredient,
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
                                        activeIngredient,
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
              onUpdate(
                { id: uuid(), name: '', routes: [] },
                activeIngredient.brands
              )
            }
          />
        </TreeFormBox>
      ))}

      <AddFieldButton
        label={t('label.add-active-ingredients')}
        onClick={() =>
          onUpdate(
            { id: uuid(), name: '', brands: [] },
            draft.activeIngredients
          )
        }
      />
    </Box>
  );
};
