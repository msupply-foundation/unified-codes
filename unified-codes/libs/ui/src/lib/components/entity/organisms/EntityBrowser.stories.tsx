import * as React from 'react';

import { Entity, IEntity } from '@unified-codes/data';

import { EntityBrowser } from './EntityBrowser';

export default {
  component: EntityBrowser,
  title: 'Library/EntityBrowser',
};

export const withNoProps = () => {
  const data: IEntity[] = [
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
  const entities = data.map((entityNode: IEntity) => new Entity(entityNode));
  return <EntityBrowser entities={entities} />;
};
