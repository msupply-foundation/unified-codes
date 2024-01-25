import { useTranslation } from '@common/intl';
import { BasicTextInput, Box, Typography } from '@common/ui';
import React, { useState } from 'react';
import { useUuid } from '../../../hooks';
import { PropertiesModal } from './PropertiesModal';
import { useEditModal } from '@common/hooks';
import { DrugInput, Entity, Property } from '../types';
import { TreeFormBox } from './TreeFormBox';
import { CategoryDropdown } from './CategoryDropdown';
import { AddFieldButton } from './AddFieldButton';
import { EditPropertiesButton } from './EditPropertiesButton';
import { NameEditField } from './NameEditField';
import { useConfigurationItems } from '../../Configuration/api';
import { ConfigurationItemTypeInput } from '@common/types';
import { ExistingNameSuggester } from './ExistingItemSuggester';

export const DrugFormTree = ({
  draft,
  setDraft,
  initialIds,
}: {
  draft: DrugInput;
  setDraft: (input: DrugInput) => void;
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
              ? t('error.required', { field: t('label.drug-name') })
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

      {!!draft.routes.length && (
        <Typography fontSize="12px">{t('label.routes')}</Typography>
      )}

      {draft.routes.map(route => (
        <TreeFormBox key={route.id}>
          <Box sx={{ display: 'flex', alignItems: 'end' }}>
            <CategoryDropdown
              disabled={initialIds.includes(route.id)}
              options={
                routes?.map(r => ({ label: r.name, value: r.name })) ?? []
              }
              entity={route}
              siblings={draft.routes}
              onUpdate={onUpdate}
              onDelete={onDelete}
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
                  options={
                    forms?.map(r => ({ label: r.name, value: r.name })) ?? []
                  }
                  entity={form}
                  siblings={route.forms}
                  onUpdate={onUpdate}
                  onDelete={onDelete}
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
                      label={t('label.strength')}
                      entity={strength}
                      siblings={form.strengths}
                      isDisabled={isDisabled}
                      onUpdate={onUpdate}
                      onDelete={onDelete}
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
                          label={t('label.unit')}
                          entity={unit}
                          siblings={strength.units}
                          isDisabled={isDisabled}
                          onUpdate={onUpdate}
                          onDelete={onDelete}
                        />
                        <EditPropertiesButton
                          parents={[draft, route, form, strength]}
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
                                options={
                                  immediatePackagings?.map(o => ({
                                    label: o.name,
                                    value: o.name,
                                  })) ?? []
                                }
                                entity={immPack}
                                siblings={unit.immediatePackagings}
                                onUpdate={onUpdate}
                                onDelete={onDelete}
                              />
                              <EditPropertiesButton
                                parents={[draft, route, form, strength, unit]}
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
                              packSizes: [],
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
            isLoading={isLoadingForms}
          />
        </TreeFormBox>
      ))}

      <AddFieldButton
        label={t('label.add-route')}
        onClick={() =>
          onUpdate({ id: uuid(), name: '', forms: [] }, draft.routes)
        }
        isLoading={isLoadingRoutes}
      />
    </Box>
  );
};
