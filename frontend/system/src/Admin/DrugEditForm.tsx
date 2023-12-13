import { useTranslation } from '@common/intl';
import {
  BasicTextInput,
  Box,
  FlatButton,
  PlusCircleIcon,
  Select,
  Typography,
} from '@common/ui';
import React, { useState } from 'react';
import { categories } from './categories';
import { useUuid } from '../hooks';

type Route = {
  tmpId: string;
  type: string;
};

type DrugInput = {
  name: string;
  routes?: Route[];
};

const DrugEditForm = () => {
  const t = useTranslation('system');
  const getRandomUuid = useUuid();
  const [draft, setDraft] = useState<DrugInput>({ name: '' });
  console.log(draft);

  const onUpdate = (patch: Partial<DrugInput>) => {
    setDraft({ ...draft, ...patch });
  };

  const onUpdateRoute = (route: Route) => {
    onUpdate({
      routes: [
        ...(draft.routes ?? []).filter(r => r.tmpId !== route.tmpId),
        route,
      ],
    });
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
      {draft.routes && (
        <Typography fontSize="12px">{t('label.routes')}</Typography>
      )}
      {draft.routes?.map(route => (
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
            sx={{ width: '100%' }}
          />
        </Box>
      ))}
      <FlatButton
        startIcon={<PlusCircleIcon />}
        label={t('label.add-route')}
        onClick={() =>
          onUpdate({
            routes: [
              ...(draft.routes ?? []),
              { type: '', tmpId: getRandomUuid() },
            ],
          })
        }
        sx={{ marginLeft: '20px' }}
      />
    </Box>
  );
};

export default DrugEditForm;
