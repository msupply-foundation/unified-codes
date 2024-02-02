import React from 'react';
import { DetailTabs, TabDefinition } from '@common/components';
import { useTranslation } from '@common/intl';
import { InteractionGroupTab } from './InteractionGroupTab';
import { InteractionTab } from './InteractionsTab';

export const DrugInteractionsView = () => {
  const t = useTranslation('system');

  const tabs: TabDefinition[] = [
    {
      Component: <InteractionTab />,
      value: t('label.drug-interactions'),
    },
    {
      Component: <InteractionGroupTab />,
      value: t('label.drug-interaction-groups'),
    },
  ];
  return <DetailTabs tabs={tabs} />;
};
