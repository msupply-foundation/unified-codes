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
} from '@common/ui';
import React, { useState } from 'react';
import { categories } from './categories';
import { useUuid } from '../hooks';
import { PropertiesModal, Property } from './PropertiesModal';
import { useEditModal } from '@common/hooks';

type ImmediatePackaging = {
  tmpId: string;
  name: string;
  properties?: Property[];
};

type Unit = {
  tmpId: string;
  name: string;
  immediatePackagings: ImmediatePackaging[];
  properties?: Property[];
};

type Strength = {
  tmpId: string;
  name: string;
  units: Unit[];
  properties?: Property[];
};

type Form = {
  tmpId: string;
  name: string;
  strengths: Strength[];
  properties?: Property[];
};

type Route = {
  tmpId: string;
  name: string;
  forms: Form[];
  properties?: Property[];
};

type DrugInput = {
  name: string;
  routes: Route[];
  properties?: Property[];
};

export const DrugEditForm = () => {
  const t = useTranslation('system');
  const uuid = useUuid();
  const [draft, setDraft] = useState<DrugInput>({ name: '', routes: [] });
  const [propertiesModalTitle, setPropertiesModalTitle] = useState('');
  const [entityForProperties, setEntityForProperties] = useState<{
    name: string;
    properties?: Property[];
  }>(draft);

  const { isOpen, onClose, onOpen } = useEditModal<{
    type: string;
    value: string;
  }>();

  const onOpenPropertiesModal = (
    title: string,
    entity: { name: string; properties?: Property[] }
  ) => {
    // TODO... can we determine the title from the entity...
    setPropertiesModalTitle(title);
    setEntityForProperties(entity);

    onOpen();
  };

  const onSubmit = () => {
    console.log(draft);
  };

  const onUpdateRoot = (patch: Partial<DrugInput>) => {
    setDraft({ ...draft, ...patch });
  };

  // Bit hacky but it works...
  const onUpdate = <T extends { tmpId: string }>(updated: T, list: T[]) => {
    const indexToUpdate = list.findIndex(item => item.tmpId === updated.tmpId);
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
          isOpen={isOpen}
          onClose={onClose}
          title={propertiesModalTitle}
          onSave={(newProperties: Property[]) => {
            entityForProperties.properties = newProperties;
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
          onClick={() => onOpenPropertiesModal(draft.name, draft)}
        />
      </Box>

      {!!draft.routes.length && (
        <Typography fontSize="12px">{t('label.routes')}</Typography>
      )}

      {draft.routes.map(route => (
        <TreeFormBox key={route.tmpId}>
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
              onClick={() =>
                // TODO: build title dynamically...
                onOpenPropertiesModal(`${draft.name} - ${route.name}`, route)
              }
            />
          </Box>

          {!!route.forms.length && (
            <Typography fontSize="12px">{t('label.forms')}</Typography>
          )}

          {route.forms.map(form => (
            <TreeFormBox key={form.tmpId}>
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
                  onClick={() =>
                    // TODO: build title dynamically...
                    onOpenPropertiesModal(
                      `${draft.name} - ${route.name} - ${form.name}`,
                      form
                    )
                  }
                />
              </Box>
              {!!form.strengths.length && (
                <Typography fontSize="12px">{t('label.strengths')}</Typography>
              )}

              {form.strengths.map(strength => (
                <TreeFormBox key={strength.tmpId}>
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

                  {!!strength.units.length && (
                    <Typography fontSize="12px">{t('label.units')}</Typography>
                  )}

                  {strength.units.map(unit => (
                    <TreeFormBox key={unit.tmpId}>
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

                      {!!unit.immediatePackagings.length && (
                        <Typography fontSize="12px">
                          {t('label.immediate-packaging')}
                        </Typography>
                      )}

                      {unit.immediatePackagings.map(immPack => (
                        <TreeFormBox key={immPack.tmpId}>
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
                        </TreeFormBox>
                      ))}

                      <AddButton
                        label={t('label.add-immediate-packaging')}
                        onClick={() =>
                          onUpdate(
                            { tmpId: uuid(), name: '' },
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
                        { tmpId: uuid(), name: '', immediatePackagings: [] },
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
                    { tmpId: uuid(), name: '', units: [] },
                    form.strengths
                  )
                }
              />
            </TreeFormBox>
          ))}

          <AddButton
            label={t('label.add-form')}
            onClick={() =>
              onUpdate({ tmpId: uuid(), name: '', strengths: [] }, route.forms)
            }
          />
        </TreeFormBox>
      ))}

      <AddButton
        label={t('label.add-route')}
        onClick={() =>
          onUpdate({ tmpId: uuid(), name: '', forms: [] }, draft.routes)
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

const AddPropertiesButton = ({ onClick }: { onClick: () => void }) => {
  const t = useTranslation('system');
  return (
    <IconButton
      icon={<PlusCircleIcon />}
      label={t('label.add-properties')}
      onClick={onClick}
      color="primary"
    />
  );
};
