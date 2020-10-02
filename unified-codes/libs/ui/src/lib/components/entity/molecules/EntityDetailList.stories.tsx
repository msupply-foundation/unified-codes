import React from 'react';

import { Property, IEntity } from '@unified-codes/data';
import EntityDetailList, { IExternalLink } from './EntityDetailList';

export default {
  component: EntityDetailList,
  title: 'EntityDetail/EntityDetailList',
};

const subCategoriesMock: IEntity[] = [
  {
    type: 'Category 1',
    description: 'Mock Description 1',
    code: 'ABC',
    has_child: [
      {
        type: 'SubCategory 11',
        description: 'Mock Description 11',
        code: 'DEF',
        has_child: [
          { type: 'SubCategory 12', description: 'Mock Description 12', code: 'GHI' },
          { type: 'SubCategory 13', description: 'Mock Description 13', code: 'ZZZ' },
        ],
      },
    ],
  },
  {
    type: 'Category 2',
    description: 'Mock Description 2',
    code: 'JKL',
    has_child: [{ type: 'SubCategory 21', description: 'Mock Description 21', code: 'MNO' }],
  },
];
const externalLinksMock: IExternalLink[] = [
  {
    type: 'NZULM',
    url: 'https://search.nzulm.org.nz/search/product?table=MP&id=20023151000116107',
  },
];
const otherPropertiesMock: Property[] = [
  {
    type: 'ddd',
    value: '1.5 g O; 3 g P',
  },
];

export const withNoProps = () => {
  return <EntityDetailList />;
};

export const withMockData = () => {
  return (
    <EntityDetailList
      productSubCategories={subCategoriesMock}
      externalLinks={externalLinksMock}
      entityProperties={otherPropertiesMock}
    />
  );
};
