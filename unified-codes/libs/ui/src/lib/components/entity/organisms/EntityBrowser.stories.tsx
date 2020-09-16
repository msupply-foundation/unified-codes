import * as React from 'react';

import { Entities, EntityCollection } from '@unified-codes/data';

import { EntityBrowser } from './EntityBrowser';

export default {
  component: EntityBrowser,
  title: 'EntityBrowser',
};

export const withNoProps = () => {
  const entityCollection = new EntityCollection(Entities);
  return <EntityBrowser entities={entityCollection} />;
};
