import { DetailTabs, TabDefinition } from '@common/components';
import { useTranslation } from '@common/intl';
import React from 'react';
import { categories } from '../DrugEditForm/categories';
import { CategoryConfigTab } from './CategoryConfigTab';

export const ConfigurationTabsView = () => {
  const t = useTranslation('system');

  const tabs: TabDefinition[] = [
    {
      Component: (
        <CategoryConfigTab
          data={categories.routes}
          category={t('label.route')}
        />
      ),
      value: t('label.routes'),
    },
    {
      Component: (
        <CategoryConfigTab data={categories.forms} category={t('label.form')} />
      ),
      value: t('label.forms'),
    },
    {
      Component: (
        <CategoryConfigTab
          data={categories.immediatePackagings}
          category={t('label.immediate-packaging')}
        />
      ),
      value: t('label.immediate-packaging'),
    },
    // TODO: would be nice to manage properties options here too
    // would need to also manage what the external links to the different databases are
    // and see if we have other references to the property codes throughout the codebase first!
  ];
  return <DetailTabs tabs={tabs} />;
};
