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

type Form = {
  tmpId: string;
  type: string;
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

const DrugEditForm = () => {
  const t = useTranslation('system');
  const getRandomUuid = useUuid();
  const [draft, setDraft] = useState<DrugInput>({ name: '', routes: [] });
  console.log(draft);

  const onUpdate = (patch: Partial<DrugInput>) => {
    setDraft({ ...draft, ...patch });
  };

  const onUpdateRoute = (route: Route) => {
    const routeIndex = draft.routes.findIndex(r => r.tmpId === route.tmpId);
    draft.routes[routeIndex] = route;
    setDraft({ ...draft });
  };

  const onUpdateForm = (form: Form, route: Route) => {
    const formIndex = route.forms.findIndex(f => f.tmpId === form.tmpId);
    route.forms[formIndex] = form;
    onUpdateRoute(route);
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
        <Box
          key={route.tmpId}
          sx={{
            marginLeft: '10px',
            paddingLeft: '10px',
            paddingTop: '10px',
            borderLeft: '1px solid black',
          }}
        >
          <Select
            value={route.type}
            onChange={e => onUpdateRoute({ ...route, type: e.target.value })}
            options={categories.routes}
            renderOption={(option: Option) => (
              <MenuItem
                key={option.value}
                value={option.value}
                disabled={!!draft.routes.find(r => r.type === option.value)}
              >
                {option.label}
              </MenuItem>
            )}
            sx={{ width: '100%' }}
          />
          {!!route.forms.length && (
            <Typography fontSize="12px">{t('label.forms')}</Typography>
          )}
          {route.forms.map(form => (
            <Box
              key={form.tmpId}
              sx={{
                marginLeft: '10px',
                paddingLeft: '10px',
                paddingTop: '10px',
                borderLeft: '1px solid black',
              }}
            >
              <Select
                value={form.type}
                onChange={e =>
                  onUpdateForm({ ...form, type: e.target.value }, route)
                }
                renderOption={(option: Option) => (
                  <MenuItem
                    key={option.value}
                    value={option.value}
                    disabled={!!route.forms.find(f => f.type === option.value)}
                  >
                    {option.label}
                  </MenuItem>
                )}
                options={categories.forms}
                sx={{ width: '100%' }}
              />
              {/* <FlatButton
                startIcon={<PlusCircleIcon />}
                label={t('label.add-form')}
                onClick={() =>
                  onUpdateRoute({
                    ...form,
                    forms: [
                      ...form.forms,
                      { type: '', tmpId: getRandomUuid() },
                    ],
                  })
                }
                sx={{ marginLeft: '20px' }}
              /> */}
            </Box>
          ))}
          <FlatButton
            startIcon={<PlusCircleIcon />}
            label={t('label.add-form')}
            onClick={() =>
              onUpdateRoute({
                ...route,
                forms: [...route.forms, { type: '', tmpId: getRandomUuid() }],
              })
            }
            sx={{ marginLeft: '20px' }}
          />
        </Box>
      ))}
      <FlatButton
        startIcon={<PlusCircleIcon />}
        label={t('label.add-route')}
        onClick={() =>
          onUpdate({
            routes: [
              ...draft.routes,
              { type: '', tmpId: getRandomUuid(), forms: [] },
            ],
          })
        }
        sx={{ marginLeft: '20px' }}
      />
    </Box>
  );
};

export default DrugEditForm;
