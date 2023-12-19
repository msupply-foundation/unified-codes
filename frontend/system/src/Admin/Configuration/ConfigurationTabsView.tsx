import { DetailTabs, TabDefinition } from '@common/components';
import { useTranslation } from '@common/intl';
import { Box, Paper } from '@common/ui';
import React from 'react';
import { categories } from '../DrugEditForm/categories';
import { CategoryConfigTab } from './CategoryConfigTab';

export const ConfigurationTabsView = () => {
  const t = useTranslation('system');

  const tabs: TabDefinition[] = [
    {
      Component: (
        <CategoryConfigTab data={categories.routes} name={t('label.routes')} />
      ),
      value: t('label.routes'),
    },
    {
      Component: (
        <CategoryConfigTab data={categories.forms} name={t('label.forms')} />
      ),
      value: t('label.forms'),
    },
    {
      Component: (
        <CategoryConfigTab
          data={categories.immediatePackagings}
          name={t('label.immediate-packaging')}
        />
      ),
      value: t('label.immediate-packaging'),
    },
    // TODO: would be nice to manage properties options here too
    // would need to also manage what the external links to the different databases are
    // and see if we have other references to the property codes throughout the codebase first!
  ];
  return (
    <>
      <Paper
        sx={{
          backgroundColor: 'background.menu',
          borderRadius: '16px',
          flex: 1,
          margin: '10px auto',
          maxWidth: '1200px',
          padding: '16px',
          width: '100%',
        }}
      >
        <Box
          sx={{
            backgroundColor: 'white',
            display: 'flex',
            borderRadius: '16px',
            padding: '0 16px',
            maxHeight: '100%',
            overflowY: 'scroll',
          }}
        >
          <DetailTabs tabs={tabs} />
        </Box>
      </Paper>
    </>
  );
};
