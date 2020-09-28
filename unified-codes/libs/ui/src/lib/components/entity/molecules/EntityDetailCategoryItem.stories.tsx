import React from 'react';

import { IEntity } from '@unified-codes/data';
import EntityDetailCategoryItem from './EntityDetailCategoryItem';

export default {
  component: EntityDetailCategoryItem,
  title: 'EntityDetail/EntityDetailCategoryItem',
};

const mockEntityDetails: IEntity = {
  type: 'Category 1',
  description: 'Mock Description 1',
  code: 'ABC',
  has_child: [
    { type: 'SubCategory 2', description: 'Mock Description 2', code: 'DEF' },
    {
      type: 'SubCategory 3',
      description: 'Mock Description 3',
      code: 'GHI',
      has_child: [{ type: 'SubCategory 4', description: 'Mock Description 4', code: 'JKL' }],
    },
  ],
};

export const withDummyEntity = () => {
  return <EntityDetailCategoryItem entity={mockEntityDetails} />;
};
