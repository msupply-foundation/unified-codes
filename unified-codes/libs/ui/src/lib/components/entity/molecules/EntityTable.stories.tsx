import React from 'react';

import { Entity, IEntity } from '@unified-codes/data';

import EntityTable from './EntityTable';

export default {
  component: EntityTable,
  title: 'EntityTable',
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
  const entities = data.map((entity: IEntity) => new Entity(entity));
  return <EntityTable data={entities} />;
};
