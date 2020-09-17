import * as React from 'react';

import { Entity, EntityCollection, IEntity } from '@unified-codes/data';
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
      code: 'GH89P98W',
      description: 'Paracetamol',
      type: 'medicinal_product',
    },
  ];

  const onEntitySelect = () => console.log('onSelect triggered');
  const data = entities.map((entityNode: IEntity) => new Entity(entityNode));
  const entityCollection = new EntityCollection(data);
  return <EntityBrowser entities={entityCollection} onEntitySelect={onEntitySelect} />;
};
