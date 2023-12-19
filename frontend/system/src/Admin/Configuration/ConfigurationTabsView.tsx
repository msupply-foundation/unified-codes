import { DetailTabs, TabDefinition } from '@common/components';
import { useTranslation } from '@common/intl';
import React from 'react';
import { config } from '../../config';
import { CategoryConfigTab } from './CategoryConfigTab';
import { PropertiesConfigTab } from './PropertiesConfigTab';

export const ConfigurationTabsView = () => {
  const t = useTranslation('system');

  const tabs: TabDefinition[] = [
    {
      Component: (
        <CategoryConfigTab data={config.routes} category={t('label.route')} />
      ),
      value: t('label.routes'),
    },
    {
      Component: (
        <CategoryConfigTab data={config.forms} category={t('label.form')} />
      ),
      value: t('label.forms'),
    },
    {
      Component: (
        <CategoryConfigTab
          data={config.immediatePackagings}
          category={t('label.immediate-packaging')}
        />
      ),
      value: t('label.immediate-packaging'),
    },
    {
      Component: <PropertiesConfigTab data={config.properties} />,
      value: t('label.properties'),
    },
  ];
  return <DetailTabs tabs={tabs} />;
};
