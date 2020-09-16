import * as React from 'react';

import { EntityTypeFilter } from './EntityTypeFilter';

export default { title: 'EntityTypeFilter' };

const entityTypes = [
  { name: 'Type #1', active: true },
  { name: 'Type #2', active: false },
  { name: 'Type #3', active: false },
];

export const withDummyTypes = () => {
  return (
      <EntityTypeFilter types={entityTypes}/>
  );
};
