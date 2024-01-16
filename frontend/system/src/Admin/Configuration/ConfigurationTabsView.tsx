import { DetailTabs, TabDefinition } from '@common/components';
import { useTranslation } from '@common/intl';
import React from 'react';
import { config } from '../../config';
import { OptionListConfigTab } from './OptionListConfigTab';
import { PropertiesConfigTab } from './PropertiesConfigTab';
import { ConfigurationItemTypeInput } from '@common/types';

export const ConfigurationTabsView = () => {
  const t = useTranslation('system');

  const tabs: TabDefinition[] = [
    {
      Component: (
        <OptionListConfigTab
          type={ConfigurationItemTypeInput.Route}
          category={t('label.route')}
        />
      ),
      value: t('label.routes'),
    },
    {
      Component: (
        <OptionListConfigTab
          type={ConfigurationItemTypeInput.Form}
          category={t('label.form')}
        />
      ),
      value: t('label.forms'),
    },
    {
      Component: (
        <OptionListConfigTab
          type={ConfigurationItemTypeInput.ImmediatePackaging}
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
