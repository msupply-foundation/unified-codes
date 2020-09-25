import React from 'react';

import { Property } from '@unified-codes/data';
import EntityDetails, {IExternalLink, IFormCategory } from './EntityDetails';

export default {
  component: EntityDetails,
  title: 'EntityDetails',
};

const formCategoriesMock: IFormCategory[] = [
  {
    name: 'Category 1',
    forms: ['form1', 'form2'],
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
  return <EntityDetails />;
};

export const withMockData = () => {
  return <EntityDetails formCategories={formCategoriesMock} externalLinks={externalLinksMock} entityProperties={otherPropertiesMock} />;
};
