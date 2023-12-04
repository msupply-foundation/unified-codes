import React from 'react';

import {
  Grid,
  TranslateIcon,
  Typography,
  useTranslation,
} from '@uc-frontend/common';
import { LanguageMenu } from '../components';
import { Setting } from './Setting';
import { Environment } from '@uc-frontend/config';
import { useHost } from '../api/hooks';

export const Settings: React.FC = () => {
  const t = useTranslation('host');
  const { data } = useHost.utils.version();

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
          {!!data && (
            <Grid item display="flex" flex={1} gap={1}>
              <Grid item justifyContent="flex-end" flex={1} display="flex">
                <Typography fontWeight={700} whiteSpace="nowrap">
                  {t('label.api-version')}
                </Typography>
              </Grid>
              <Grid item flex={1}>
                <Typography>{data}</Typography>
              </Grid>
            </Grid>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};
