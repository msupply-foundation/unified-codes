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
} from '@common/ui';
import React, { useState } from 'react';
import { categories } from './categories';
import { useUuid } from '../hooks';

type Strength = {
  tmpId: string;
  type: string;
};

type Form = {
  tmpId: string;
  type: string;
  strengths: Strength[];
};

type Route = {
  tmpId: string;
  type: string;
  forms: Form[];
};

type DrugInput = {
  name: string;
  routes: Route[];
};

export const DrugEditForm = () => {
  const t = useTranslation('system');
  const uuid = useUuid();
  const [draft, setDraft] = useState<DrugInput>({ name: '', routes: [] });
  console.log(draft);

  const onUpdate = (patch: Partial<DrugInput>) => {
    setDraft({ ...draft, ...patch });
  };

  const onUpdateRoute = (route: Route) => {
    const routeIndex = draft.routes.findIndex(r => r.tmpId === route.tmpId);
    if (routeIndex >= 0) {
      draft.routes[routeIndex] = route;
    } else {
      draft.routes.push(route);
    }
    setDraft({ ...draft });
  };

  const onUpdateForm = (form: Form, route: Route) => {
    const formIndex = route.forms.findIndex(f => f.tmpId === form.tmpId);
    if (formIndex >= 0) {
      route.forms[formIndex] = form;
    } else {
      route.forms.push(form);
    }
    setDraft({ ...draft });
  };

  const onUpdateStrength = (strength: Strength, form: Form) => {
    const strengthIndex = form.strengths.findIndex(
      s => s.tmpId === strength.tmpId
    );
    if (strengthIndex >= 0) {
      form.strengths[strengthIndex] = strength;
    } else {
      form.strengths.push(strength);
    }
    setDraft({ ...draft });
  };

  return (
    <Box sx={{ marginY: '16px', width: '100%' }}>
      <BasicTextInput
        autoFocus
        value={draft.name}
        onChange={e => onUpdate({ name: e.target.value })}
        label={t('label.drug-name')}
        InputLabelProps={{ shrink: true }}
        fullWidth
      />

      {!!draft.routes.length && (
        <Typography fontSize="12px">{t('label.routes')}</Typography>
      )}

      {draft.routes.map(route => (
        <TreeFormBox key={route.tmpId}>
          <CategoryDropdown
            value={route.type}
            options={categories.routes}
            onChange={type => onUpdateRoute({ ...route, type })}
            getOptionDisabled={o =>
              !!draft.routes.find(r => r.type === o.value)
            }
          />

          {!!route.forms.length && (
            <Typography fontSize="12px">{t('label.forms')}</Typography>
          )}

          {route.forms.map(form => (
            <TreeFormBox key={form.tmpId}>
              <CategoryDropdown
                value={form.type}
                options={categories.forms}
                onChange={type => onUpdateForm({ ...form, type }, route)}
                getOptionDisabled={o =>
                  !!route.forms.find(f => f.type === o.value)
                }
              />
              {!!form.strengths.length && (
                <Typography fontSize="12px">{t('label.strengths')}</Typography>
              )}

              {form.strengths.map(strength => (
                <TreeFormBox key={strength.tmpId}>
                  <BasicTextInput
                    value={strength.type}
                    onChange={e =>
                      onUpdateStrength(
                        { ...strength, type: e.target.value },
                        form
                      )
                    }
                    fullWidth
                  />
                </TreeFormBox>
              ))}

              <AddButton
                label={t('label.add-strength')}
                onClick={() =>
                  onUpdateStrength({ tmpId: uuid(), type: '' }, form)
                }
              />
            </TreeFormBox>
          ))}

          <AddButton
            label={t('label.add-form')}
            onClick={() =>
              onUpdateForm({ tmpId: uuid(), type: '', strengths: [] }, route)
            }
          />
        </TreeFormBox>
      ))}

      <AddButton
        label={t('label.add-route')}
        onClick={() => onUpdateRoute({ tmpId: uuid(), type: '', forms: [] })}
      />
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
      sx={{ marginLeft: '20px' }}
    />
  );
};
