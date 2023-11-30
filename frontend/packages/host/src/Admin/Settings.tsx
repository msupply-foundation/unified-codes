import React from 'react';

import {
  Box,
  Grid,
  TranslateIcon,
  Typography,
  useTranslation,
} from '@uc-frontend/common';
import { LanguageMenu } from '../components';
import { Setting } from './Setting';
import { Environment } from '@uc-frontend/config';
import { useHost } from '../api/hooks';
import { useEntity } from '../api/hooks/utils/useEntity';

export const Settings: React.FC = () => {
  const t = useTranslation('host');
  const { data: version } = useHost.utils.version();
  const { data: entity } = useEntity('c7750265');

  return (
    <Grid
      container
      flexDirection="column"
      justifyContent="flex-start"
      style={{ padding: 15, width: 500 }}
      flexWrap="nowrap"
    >
      <Typography variant="h5" color="primary" style={{ paddingBottom: 25 }}>
        {t('heading.settings-display')}
      </Typography>
      <Setting
        component={<LanguageMenu />}
        title={t('button.language')}
        icon={<TranslateIcon />}
      />
      <Typography variant="h5" color="primary" style={{ paddingBottom: 25 }}>
        Entity Query
      </Typography>
      <Entity entity={entity} />
      <Grid style={{ position: 'absolute', right: 0, bottom: 30 }}>
        <Grid container padding={1} flexDirection="column">
          <Grid item display="flex" flex={1} gap={1}>
            <Grid item justifyContent="flex-end" flex={1} display="flex">
              <Typography fontWeight={700} whiteSpace="nowrap">
                {t('label.app-version')}
              </Typography>
            </Grid>
            <Grid item flex={1}>
              <Typography>{Environment.BUILD_VERSION}</Typography>
            </Grid>
          </Grid>
          {!!version && (
            <Grid item display="flex" flex={1} gap={1}>
              <Grid item justifyContent="flex-end" flex={1} display="flex">
                <Typography fontWeight={700} whiteSpace="nowrap">
                  {t('label.api-version')}
                </Typography>
              </Grid>
              <Grid item flex={1}>
                <Typography>{version}</Typography>
              </Grid>
            </Grid>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};

type IEntity = {
  description?: string | null;
  code: string;
  children?: IEntity[] | null;
  properties?:
    | {
        type: string;
        value: string;
      }[]
    | null;
};

const Entity = ({ entity }: { entity?: IEntity | null }) => {
  return (
    <Box paddingLeft={'10px'}>
      <Typography>
        {entity?.description} ({entity?.code})
      </Typography>
      {entity?.children?.map(c => (
        <Entity entity={c} key={c.code} />
      ))}
      {entity?.properties && (
        <>
          <Typography fontWeight={700}>Properties</Typography>
          {entity.properties.map(p => (
            <Typography key={p.value}>
              {p.type}: {p.value}
            </Typography>
          ))}
        </>
      )}
    </Box>
  );
};
