import React from 'react';
import { useTranslation } from '@common/intl';
import { TabDefinition, DetailTabs } from '@common/ui';
import { DrugEditForm } from './DrugEditForm';
import { VaccineEditForm } from './DrugEditForm/VaccineEditForm';

export const NewItemView = () => {
  const t = useTranslation('system');

  const tabs: TabDefinition[] = [
    {
      Component: <DrugEditForm />,
      value: t('label.new-drug'),
    },
    {
      Component: <>Coming soon :)</>,
      value: t('label.new-consumable'),
    },
    {
      Component: <VaccineEditForm />,
      value: t('label.new-vaccine'),
    },
  ];
  return <DetailTabs tabs={tabs} />;
};