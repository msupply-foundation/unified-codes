import { DetailTabs, TabDefinition } from '@common/components';
import { useTranslation } from '@common/intl';
import React from 'react';
import { config } from '../../config';
import { OptionListConfigTab } from './OptionListConfigTab';
import { PropertiesConfigTab } from './PropertiesConfigTab';

export const ConfigurationTabsView = () => {
  const t = useTranslation('system');

  const tabs: TabDefinition[] = [
    {
      Component: (
        <OptionListConfigTab data={config.routes} category={t('label.route')} />
      ),
      value: t('label.routes'),
    },
    {
      Component: (
        <OptionListConfigTab data={config.forms} category={t('label.form')} />
      ),
      value: t('label.forms'),
    },
    {
      Component: (
        <OptionListConfigTab
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
