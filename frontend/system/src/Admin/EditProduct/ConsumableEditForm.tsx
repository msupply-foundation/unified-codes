import { useTranslation } from '@common/intl';
import {
  BasicTextInput,
  Box,
  Typography,
  SaveIcon,
  ButtonWithIcon,
} from '@common/ui';
import React, { useState } from 'react';
import { useUuid } from '../../hooks';
import { PropertiesModal } from './components/PropertiesModal';
import { useEditModal } from '@common/hooks';
import { ConsumableInput, Entity, EntityDetails, Property } from './types';
import { TreeFormBox } from './components/TreeFormBox';
import { AddFieldButton } from './components/AddFieldButton';
import { EditPropertiesButton } from './components/EditPropertiesButton';
import { getAllEntityCodes } from './helpers';
import { config } from '../../config';
import { CategoryDropdown } from './components/CategoryDropdown';

export const ConsumableEditForm = ({
  initialEntity,
}: {
  initialEntity?: EntityDetails;
}) => {
  const t = useTranslation('system');
  const [initialIds] = useState(getAllEntityCodes(initialEntity));

  // throwaway ids as a dgraph uid will be assigned when the entity is stored
  const makeThrowawayId = useUuid();

  const [draft, setDraft] = useState<ConsumableInput>(
    // TODO: support generating consumable input from existing entity - probably after
    // the data has been mapped into this structure though?
    // initialEntity
    //   ? buildConsumableInputFromEntity(initialEntity)
    //   :
    {
      id: makeThrowawayId(),
      name: '',
      basicCategories: [],
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
          label={t('label.device-name')}
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

      {!!draft.basicCategories.length && (
        <Typography fontSize="12px">{t('label.basic-categories')}</Typography>
      )}

      {draft.basicCategories.map(bCat => (
        <TreeFormBox key={bCat.id}>
          <Box sx={{ display: 'flex', alignItems: 'end' }}>
            <CategoryDropdown
              disabled={initialIds.includes(bCat.id)}
              value={bCat.name}
              options={config.basicCategories}
              onChange={name =>
                onUpdate({ ...bCat, name }, draft.basicCategories)
              }
              getOptionDisabled={o =>
                !!draft.basicCategories.find(b => b.name === o.value)
              }
            />
            <EditPropertiesButton
              parents={[draft]}
              entity={bCat}
              onOpen={onOpenPropertiesModal}
            />
          </Box>

          {!!bCat.intermediateCategories.length && (
            <Typography fontSize="12px">
              {t('label.intermediate-categories')}
            </Typography>
          )}

          {bCat.intermediateCategories.map(iCat => (
            <TreeFormBox key={iCat.id}>
              <Box sx={{ display: 'flex', alignItems: 'end' }}>
                <CategoryDropdown
                  disabled={initialIds.includes(iCat.id)}
                  value={iCat.name}
                  options={config.intermediateCategories}
                  onChange={name =>
                    onUpdate({ ...iCat, name }, bCat.intermediateCategories)
                  }
                  getOptionDisabled={o =>
                    !!bCat.intermediateCategories.find(i => i.name === o.value)
                  }
                />
                <EditPropertiesButton
                  parents={[draft, bCat]}
                  entity={iCat}
                  onOpen={onOpenPropertiesModal}
                />
              </Box>
              {!!iCat.specificCategories.length && (
                <Typography fontSize="12px">
                  {t('label.specific-categories')}
                </Typography>
              )}

              {iCat.specificCategories.map(sCat => (
                <TreeFormBox key={sCat.id}>
                  <Box sx={{ display: 'flex', alignItems: 'end' }}>
                    <CategoryDropdown
                      disabled={initialIds.includes(sCat.id)}
                      value={sCat.name}
                      options={config.specificCategories}
                      onChange={name =>
                        onUpdate({ ...sCat, name }, iCat.specificCategories)
                      }
                      getOptionDisabled={o =>
                        !!iCat.specificCategories.find(s => s.name === o.value)
                      }
                    />
                    <EditPropertiesButton
                      parents={[draft, bCat, iCat]}
                      entity={sCat}
                      onOpen={onOpenPropertiesModal}
                    />
                  </Box>

                  {!!sCat.deviceDetails.length && (
                    <Typography fontSize="12px">
                      {t('label.device-details')}
                    </Typography>
                  )}

                  {sCat.deviceDetails.map(details => (
                    <TreeFormBox key={details.id}>
                      <Box sx={{ display: 'flex', alignItems: 'end' }}>
                        <BasicTextInput
                          autoFocus
                          fullWidth
                          disabled={initialIds.includes(details.id)}
                          value={details.name}
                          onChange={e =>
                            onUpdate(
                              { ...details, name: e.target.value },
                              sCat.deviceDetails
                            )
                          }
                        />
                        <EditPropertiesButton
                          parents={[draft, bCat, iCat, sCat]}
                          entity={details}
                          onOpen={onOpenPropertiesModal}
                        />
                      </Box>

                      {!!details.units.length && (
                        <Typography fontSize="12px">
                          {t('label.units')}
                        </Typography>
                      )}

                      {details.units.map(unit => (
                        <TreeFormBox key={unit.id}>
                          <Box sx={{ display: 'flex', alignItems: 'end' }}>
                            <BasicTextInput
                              autoFocus
                              fullWidth
                              disabled={initialIds.includes(unit.id)}
                              value={unit.name}
                              onChange={e =>
                                onUpdate(
                                  { ...unit, name: e.target.value },
                                  details.units
                                )
                              }
                            />
                            <EditPropertiesButton
                              parents={[draft, bCat, iCat, sCat, details]}
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
                            { id: makeThrowawayId(), name: '' },
                            details.units
                          )
                        }
                      />
                    </TreeFormBox>
                  ))}

                  <AddFieldButton
                    label={t('label.add-device-details')}
                    onClick={() =>
                      onUpdate(
                        { id: makeThrowawayId(), name: '', units: [] },
                        sCat.deviceDetails
                      )
                    }
                  />
                </TreeFormBox>
              ))}

              <AddFieldButton
                label={t('label.add-specific-category')}
                onClick={() =>
                  onUpdate(
                    { id: makeThrowawayId(), name: '', deviceDetails: [] },
                    iCat.specificCategories
                  )
                }
              />
            </TreeFormBox>
          ))}

          <AddFieldButton
            label={t('label.add-intermediate-category')}
            onClick={() =>
              onUpdate(
                { id: makeThrowawayId(), name: '', specificCategories: [] },
                bCat.intermediateCategories
              )
            }
          />
        </TreeFormBox>
      ))}

      <AddFieldButton
        label={t('label.add-basic-category')}
        onClick={() =>
          onUpdate(
            { id: makeThrowawayId(), name: '', intermediateCategories: [] },
            draft.basicCategories
          )
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
