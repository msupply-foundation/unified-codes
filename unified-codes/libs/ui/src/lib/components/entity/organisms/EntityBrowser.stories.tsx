import * as React from 'react';

import { EntityCollection, IEntity } from '@unified-codes/data';

import { EntityBrowser } from './EntityBrowser';

export default {
  component: EntityBrowser,
  title: 'EntityBrowser',
};

export const withNoProps = () => {
  const entities: IEntity[] = [
    {
      code: 'QFWR9789',
      description: 'Amoxicillin',
      type: 'medicinal_product',
    },
    {
      code: 'a1004adb',
      description: 'Metronidazole',
      type: 'medicinal_product',
    },
    {
      code: 'GH89P98W',
      description: 'Paracetamol',
      type: 'medicinal_product',
    },
  ];
  const entityCollection = new EntityCollection(entities);
  const onEntitySelect = () => console.log('onEntitySelect triggered');

  return <EntityBrowser entities={entityCollection} onEntitySelect={onEntitySelect} />;
};
