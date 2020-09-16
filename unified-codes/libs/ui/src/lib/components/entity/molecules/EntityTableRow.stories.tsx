import React from 'react';
import { EntityTableRow } from './EntityTableRow';

import { Entity } from '@unified-codes/data';

export default {
  component: EntityTableRow,
  title: 'EntityTable/EntityTableRow',
};

export const withNoProps = () => {
  const entity = new Entity({
    code: 'QFWR9789',
    description: 'Amoxicillin',
    type: 'medicinal_product',
  });
  return <EntityTableRow entity={entity} />;
};
