import { useTranslation } from '@common/intl';
import {
  BasicTextInput,
  Box,
  FlatButton,
  PlusCircleIcon,
  Select,
  Typography,
  Option,
  MenuItem,
  SaveIcon,
  ButtonWithIcon,
  IconButton,
  AngleCircleRightIcon,
} from '@common/ui';
import React, { useState } from 'react';
import { categories } from './categories';
import { useUuid } from '../hooks';
import { PropertiesModal, Property } from './PropertiesModal';
import { useEditModal } from '@common/hooks';

interface Entity {
  id: string;
  name: string;
  properties?: Property[];
}
interface ImmediatePackaging extends Entity {}
interface Unit extends Entity {
  immediatePackagings: ImmediatePackaging[];
}
interface Strength extends Entity {
  units: Unit[];
}
interface Form extends Entity {
  strengths: Strength[];
}
interface Route extends Entity {
  forms: Form[];
}
interface DrugInput extends Entity {
  routes: Route[];
}

export const DrugEditForm = () => {
  const t = useTranslation('system');
  const makeThrowawayId = useUuid();
  const [draft, setDraft] = useState<DrugInput>({
    id: makeThrowawayId(),
    name: '',
    routes: [],
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

  const onOpenPropertiesModal = (...entities: [Entity, ...Entity[]]) => {
    const title = entities.map(e => e.name).join(' - ');
    const entityToUpdate = entities[entities.length - 1]!;

    setPropertiesModalState({
      title,
      entityToUpdate,
    });

    onOpen(entityToUpdate.properties);
  };

  const onSubmit = () => {
    console.log(draft);
  };

  const onUpdateRoot = (patch: Partial<DrugInput>) => {
    setDraft({ ...draft, ...patch });
  };

  // Bit hacky but it works...
  const onUpdate = <T extends Entity>(updated: T, list: T[]) => {
    const indexToUpdate = list.findIndex(item => item.id === updated.id);
    if (indexToUpdate >= 0) {
      list[indexToUpdate] = updated;
    } else {
      list.push(updated);
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

      <Box sx={{ display: 'flex', alignItems: 'end' }}>
        <BasicTextInput
          autoFocus
          value={draft.name}
          onChange={e => onUpdateRoot({ name: e.target.value })}
          label={t('label.drug-name')}
          InputLabelProps={{ shrink: true }}
          fullWidth
        />
        <AddPropertiesButton
          hasProperties={!!draft.properties?.length}
          onClick={() => onOpenPropertiesModal(draft)}
        />
      </Box>

      {!!draft.routes.length && (
        <Typography fontSize="12px">{t('label.routes')}</Typography>
      )}

      {draft.routes.map(route => (
        <TreeFormBox key={route.id}>
          <Box sx={{ display: 'flex', alignItems: 'end' }}>
            <CategoryDropdown
              value={route.name}
              options={categories.routes}
              onChange={name => onUpdate({ ...route, name }, draft.routes)}
              getOptionDisabled={o =>
                !!draft.routes.find(r => r.name === o.value)
              }
            />
            <AddPropertiesButton
              hasProperties={!!route.properties?.length}
              onClick={() => onOpenPropertiesModal(draft, route)}
            />
          </Box>

          {!!route.forms.length && (
            <Typography fontSize="12px">{t('label.forms')}</Typography>
          )}

          {route.forms.map(form => (
            <TreeFormBox key={form.id}>
              <Box sx={{ display: 'flex', alignItems: 'end' }}>
                <CategoryDropdown
                  value={form.name}
                  options={categories.forms}
                  onChange={name => onUpdate({ ...form, name }, route.forms)}
                  getOptionDisabled={o =>
                    !!route.forms.find(f => f.name === o.value)
                  }
                />
                <AddPropertiesButton
                  hasProperties={!!form.properties?.length}
                  onClick={() => onOpenPropertiesModal(draft, route, form)}
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
                      value={strength.name}
                      onChange={e =>
                        onUpdate(
                          { ...strength, name: e.target.value },
                          form.strengths
                        )
                      }
                      fullWidth
                    />
                    <AddPropertiesButton
                      hasProperties={!!strength.properties?.length}
                      onClick={() =>
                        onOpenPropertiesModal(draft, route, form, strength)
                      }
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
                          value={unit.name}
                          onChange={e =>
                            onUpdate(
                              { ...unit, name: e.target.value },
                              strength.units
                            )
                          }
                          fullWidth
                        />
                        <AddPropertiesButton
                          hasProperties={!!unit.properties?.length}
                          onClick={() =>
                            onOpenPropertiesModal(
                              draft,
                              route,
                              form,
                              strength,
                              unit
                            )
                          }
                        />
                      </Box>

                      {!!unit.immediatePackagings.length && (
                        <Typography fontSize="12px">
                          {t('label.immediate-packaging')}
                        </Typography>
                      )}

                      {unit.immediatePackagings.map(immPack => (
                        <TreeFormBox key={immPack.id}>
                          <Box sx={{ display: 'flex', alignItems: 'end' }}>
                            <CategoryDropdown
                              value={immPack.name}
                              options={categories.immediatePackagings}
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
                            />
                            <AddPropertiesButton
                              hasProperties={!!immPack.properties?.length}
                              onClick={() =>
                                onOpenPropertiesModal(
                                  draft,
                                  route,
                                  form,
                                  strength,
                                  unit,
                                  immPack
                                )
                              }
                            />
                          </Box>
                        </TreeFormBox>
                      ))}

                      <AddButton
                        label={t('label.add-immediate-packaging')}
                        onClick={() =>
                          onUpdate(
                            { id: makeThrowawayId(), name: '' },
                            unit.immediatePackagings
                          )
                        }
                      />
                    </TreeFormBox>
                  ))}

                  <AddButton
                    label={t('label.add-unit')}
                    onClick={() =>
                      onUpdate(
                        {
                          id: makeThrowawayId(),
                          name: '',
                          immediatePackagings: [],
                        },
                        strength.units
                      )
                    }
                  />
                </TreeFormBox>
              ))}

              <AddButton
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

          <AddButton
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

      <AddButton
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

const TreeFormBox = ({ children }: { children?: React.ReactNode }) => (
  <Box
    sx={{
      marginLeft: '10px',
      paddingLeft: '10px',
      paddingTop: '10px',
      borderLeft: '1px solid black',
    }}
  >
    {children}
  </Box>
);

const CategoryDropdown = ({
  value,
  options,
  onChange,
  getOptionDisabled,
}: {
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  getOptionDisabled: (o: Option) => boolean;
}) => (
  <Select
    autoFocus
    value={value}
    onChange={e => onChange(e.target.value)}
    options={options}
    renderOption={(option: Option) => (
      <MenuItem
        key={option.value}
        value={option.value}
        disabled={getOptionDisabled(option)}
      >
        {option.label}
      </MenuItem>
    )}
    sx={{ width: '100%' }}
  />
);

const AddButton = ({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) => {
  return (
    <FlatButton
      startIcon={<PlusCircleIcon />}
      label={label}
      onClick={onClick}
      disableFocusRipple
      sx={{
        marginLeft: '20px',
        '&.Mui-focusVisible': {
          backgroundColor: '#e95c3029',
        },
      }}
    />
  );
};

const AddPropertiesButton = ({
  onClick,
  hasProperties,
}: {
  onClick: () => void;
  hasProperties: boolean;
}) => {
  const t = useTranslation('system');
  return (
    <IconButton
      icon={hasProperties ? <AngleCircleRightIcon /> : <PlusCircleIcon />}
      label={t('label.add-properties')}
      onClick={onClick}
      color="primary"
    />
  );
};
