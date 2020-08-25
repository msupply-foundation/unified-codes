import React from 'react';

import { Entity, EntityNode } from '@unified-codes/data';

import { EntityBrowser } from './EntityBrowser';

export default {
  component: EntityBrowser,
  title: 'EntityBrowser',
};

export const primary = () => {
  const data: EntityNode[] = [
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
  const entities = data.map((entityNode: EntityNode) => new Entity(entityNode));
  return <EntityBrowser entities={entities} />;
};
