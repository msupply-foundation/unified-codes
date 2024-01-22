import { useTranslation } from '@common/intl';
import { Box, Typography } from '@common/ui';
import React, { useState } from 'react';
import { useUuid } from '../../../hooks';
import { PropertiesModal } from './PropertiesModal';
import { useEditModal } from '@common/hooks';
import {
  ActiveIngredients,
  Entity,
  Property,
  VaccineInput,
  VaccineNameDetails,
} from '../types';
import { TreeFormBox } from './TreeFormBox';
import { CategoryDropdown } from './CategoryDropdown';
import { AddFieldButton } from './AddFieldButton';
import { EditPropertiesButton } from './EditPropertiesButton';
import { NameEditField } from './NameEditField';
import { useConfigurationItems } from '../../Configuration/api';
import { ConfigurationItemTypeInput } from '@common/types';
import { ConfigurationItemsQuery } from '../../Configuration/api/operations.generated';

type ConfigItems = {
  routes?: ConfigurationItemsQuery['configurationItems']['data'];
  isLoadingRoutes: boolean;
  forms?: ConfigurationItemsQuery['configurationItems']['data'];
  isLoadingForms: boolean;
  immediatePackagings?: ConfigurationItemsQuery['configurationItems']['data'];
  isLoadingImmediatePackagings: boolean;
};

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

  const config: ConfigItems = {
    routes,
    isLoadingRoutes,
    forms,
    isLoadingForms,
    immediatePackagings,
    isLoadingImmediatePackagings,
  };

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

  const isDisabled = (id: string) => initialIds.includes(id);

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

      {!!draft.details.length && (
        <Typography fontSize="12px">
          {t('label.vaccine-name-details')}
        </Typography>
      )}

      {draft.details.map(details => {
        return (
          <TreeFormBox key={details.id}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'end',
              }}
            >
              <NameEditField
                disabled={isDisabled(details.id)}
                value={details.name}
                label={t('label.vaccine-name-details')}
                onChange={e =>
                  onUpdate({ ...details, name: e.target.value }, draft.details)
                }
                onDelete={() => onDelete(details, draft.details)}
              />
              <EditPropertiesButton
                parents={[draft]}
                entity={details}
                onOpen={onOpenPropertiesModal}
              />
            </Box>

            {!!details.activeIngredients.length && (
              <Typography fontSize="12px">
                {t('label.active-ingredients')}
              </Typography>
            )}
            {details.activeIngredients.map(activeIngredient => (
              <ActiveIngredientsFormBox
                key={activeIngredient.id}
                activeIngredient={activeIngredient}
                configItems={config}
                immediateParent={details}
                parentList={[draft, details]}
                isDisabled={isDisabled}
                onDelete={onDelete}
                onOpenPropertiesModal={onOpenPropertiesModal}
                onUpdate={onUpdate}
              />
            ))}

            <AddFieldButton
              label={t('label.add-component')}
              onClick={() =>
                onUpdate(
                  { id: uuid(), name: '', brands: [] },
                  details.activeIngredients
                )
              }
            />
          </TreeFormBox>
        );
      })}

      {!!draft.activeIngredients.length && (
        <Typography fontSize="12px">{t('label.active-ingredients')}</Typography>
      )}

      {draft.activeIngredients.map(activeIngredient => (
        <ActiveIngredientsFormBox
          key={activeIngredient.id}
          activeIngredient={activeIngredient}
          configItems={config}
          immediateParent={draft}
          parentList={[draft]}
          isDisabled={isDisabled}
          onDelete={onDelete}
          onOpenPropertiesModal={onOpenPropertiesModal}
          onUpdate={onUpdate}
        />
      ))}

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <AddFieldButton
          label={t('label.add-vaccine-name-details')}
          onClick={() =>
            onUpdate(
              {
                id: uuid(),
                name: '',
                activeIngredients: [],
              },
              draft.details
            )
          }
        />

        <AddFieldButton
          label={t('label.add-component')}
          onClick={() =>
            onUpdate(
              { id: uuid(), name: '', brands: [] },
              draft.activeIngredients
            )
          }
        />
      </Box>
    </Box>
  );
};

const ActiveIngredientsFormBox = ({
  activeIngredient,
  configItems,
  immediateParent,
  parentList,
  isDisabled,
  onDelete,
  onUpdate,
  onOpenPropertiesModal,
}: {
  activeIngredient: ActiveIngredients;
  configItems: ConfigItems;
  immediateParent: VaccineInput | VaccineNameDetails;
  parentList: Entity[];
  isDisabled: (id: string) => boolean;
  onUpdate: <T extends Entity>(updated: T, list: T[]) => void;
  onDelete: <T extends Entity>(updated: T, list: T[]) => void;
  onOpenPropertiesModal: (modalTitle: string, entityToUpdate: Entity) => void;
}) => {
  const t = useTranslation('system');
  const uuid = useUuid();

  const {
    routes,
    isLoadingRoutes,
    forms,
    isLoadingForms,
    immediatePackagings,
    isLoadingImmediatePackagings,
  } = configItems;

  return (
    <TreeFormBox>
      <Box sx={{ display: 'flex', alignItems: 'end' }}>
        <NameEditField
          disabled={isDisabled(activeIngredient.id)}
          value={activeIngredient.name}
          label={t('label.active-ingredients')}
          onChange={e =>
            onUpdate(
              { ...activeIngredient, name: e.target.value },
              immediateParent.activeIngredients
            )
          }
          onDelete={() =>
            onDelete(activeIngredient, immediateParent.activeIngredients)
          }
        />
        <EditPropertiesButton
          parents={parentList}
          entity={activeIngredient}
          onOpen={onOpenPropertiesModal}
        />
      </Box>

      {!!activeIngredient.brands.length && (
        <Typography fontSize="12px">{t('label.brands')}</Typography>
      )}

      {activeIngredient.brands.map(brand => {
        const brandParentList = [...parentList, activeIngredient];
        return (
          <TreeFormBox key={brand.id}>
            <Box sx={{ display: 'flex', alignItems: 'end' }}>
              <NameEditField
                disabled={isDisabled(brand.id)}
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
                parents={brandParentList}
                entity={brand}
                onOpen={onOpenPropertiesModal}
              />
            </Box>

            {!!brand.routes.length && (
              <Typography fontSize="12px">{t('label.routes')}</Typography>
            )}

            {brand.routes.map(route => {
              const routeParentList = [...brandParentList, brand];
              return (
                <TreeFormBox key={route.id}>
                  <Box sx={{ display: 'flex', alignItems: 'end' }}>
                    <CategoryDropdown
                      disabled={isDisabled(route.id)}
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
                      parents={routeParentList}
                      entity={route}
                      onOpen={onOpenPropertiesModal}
                    />
                  </Box>

                  {!!route.forms.length && (
                    <Typography fontSize="12px">{t('label.forms')}</Typography>
                  )}

                  {route.forms.map(form => {
                    const formParentList = [...routeParentList, route];
                    return (
                      <TreeFormBox key={form.id}>
                        <Box sx={{ display: 'flex', alignItems: 'end' }}>
                          <CategoryDropdown
                            disabled={isDisabled(form.id)}
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
                            parents={formParentList}
                            entity={form}
                            onOpen={onOpenPropertiesModal}
                          />
                        </Box>
                        {!!form.strengths.length && (
                          <Typography fontSize="12px">
                            {t('label.strengths')}
                          </Typography>
                        )}

                        {form.strengths.map(strength => {
                          const strengthParentList = [...formParentList, form];
                          return (
                            <TreeFormBox key={strength.id}>
                              <Box sx={{ display: 'flex', alignItems: 'end' }}>
                                <NameEditField
                                  disabled={isDisabled(strength.id)}
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
                                  parents={strengthParentList}
                                  entity={strength}
                                  onOpen={onOpenPropertiesModal}
                                />
                              </Box>

                              {!!strength.units.length && (
                                <Typography fontSize="12px">
                                  {t('label.units')}
                                </Typography>
                              )}

                              {strength.units.map(unit => {
                                const unitParentList = [
                                  ...strengthParentList,
                                  strength,
                                ];
                                return (
                                  <TreeFormBox key={unit.id}>
                                    <Box
                                      sx={{
                                        display: 'flex',
                                        alignItems: 'end',
                                      }}
                                    >
                                      <NameEditField
                                        disabled={isDisabled(unit.id)}
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
                                        parents={unitParentList}
                                        entity={unit}
                                        onOpen={onOpenPropertiesModal}
                                      />
                                    </Box>

                                    {!!unit.immediatePackagings.length && (
                                      <Typography fontSize="12px">
                                        {t('label.immediate-packaging')}
                                      </Typography>
                                    )}

                                    {unit.immediatePackagings.map(immPack => {
                                      const immPackParentList = [
                                        ...unitParentList,
                                        unit,
                                      ];
                                      return (
                                        <TreeFormBox key={immPack.id}>
                                          <Box
                                            sx={{
                                              display: 'flex',
                                              alignItems: 'end',
                                            }}
                                          >
                                            <CategoryDropdown
                                              disabled={isDisabled(immPack.id)}
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
                                              parents={immPackParentList}
                                              entity={immPack}
                                              onOpen={onOpenPropertiesModal}
                                            />
                                          </Box>
                                        </TreeFormBox>
                                      );
                                    })}
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
                                );
                              })}

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
                          );
                        })}

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
                    );
                  })}

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
              );
            })}

            <AddFieldButton
              label={t('label.add-route')}
              onClick={() =>
                onUpdate({ id: uuid(), name: '', forms: [] }, brand.routes)
              }
              isLoading={isLoadingRoutes}
            />
          </TreeFormBox>
        );
      })}

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
  );
};
