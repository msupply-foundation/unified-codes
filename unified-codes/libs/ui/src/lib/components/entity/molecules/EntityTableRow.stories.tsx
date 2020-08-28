import React from 'react';
import { EntityTableRow } from './EntityTableRow';

import { Entity, IEntity } from '@unified-codes/data';

export default {
  component: EntityTableRow,
  title: 'EntityTable/EntityTableRow',
};

export const withNoProps = () => {
  const data: IEntity = {
    code: 'QFWR9789',
    description: 'Amoxicillin',
    type: 'medicinal_product',
  };
  const entity = new Entity(data);
  return <EntityTableRow entity={entity} />;
};
