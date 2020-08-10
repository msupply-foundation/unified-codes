import React from 'react';

import { Entity, EntityNode } from '@unified-codes/data';

import EntityTable from './EntityTable';

export default {
  component: EntityTable,
  title: 'EntityTable',
};

export const primary = () => {
  const data: EntityNode[] = [
    {
      code: "QFWR9789",
      description: "Amoxicillin",
      type: "medicinal_product",
    },
    {
      code: "GH89P98W",
      description: "Paracetamol",
      type: "medicinal_product",
    },
  ];
  const entities = data.map((entityNode: EntityNode) => new Entity(entityNode));
  return <EntityTable data={entities} />;
};
