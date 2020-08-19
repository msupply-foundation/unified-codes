import React from 'react';
import { EntityTableRow } from './EntityTableRow';

import { Entity, EntityNode } from '@unified-codes/data';

export default {
  component: EntityTableRow,
  title: 'EntityTableRow',
};

export const primary = () => {
  const data: EntityNode = {
    code: 'QFWR9789',
    description: 'Amoxicillin',
    type: 'medicinal_product',
  };
  const entity = new Entity(data);
  return <EntityTableRow entity={entity} />;
};
