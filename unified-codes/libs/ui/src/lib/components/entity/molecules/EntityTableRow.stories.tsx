import React from 'react';
import { EntityTableRow } from './EntityTableRow';

import { Entities, Entity } from '@unified-codes/data';

export default {
  component: EntityTableRow,
  title: 'EntityTable/EntityTableRow',
};

export const withNoProps = () => {
  const entity = new Entity(Entities[0]);
  return <EntityTableRow entity={entity} />;
};
