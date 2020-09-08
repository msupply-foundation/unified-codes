import * as React from 'react';

import { Entity, IEntity } from '@unified-codes/data';

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
  const data = entities.map((entityNode: IEntity) => new Entity(entityNode));
  const entityData = { data, hasMore: false, totalResults: 2 };
  return <EntityBrowser entities={entityData} />;
};
