import React from 'react';
import { render } from '@testing-library/react';

import { Entity, EntityNode } from "@unified-codes/data";

import EntityTableRow from './EntityTableRow';

describe(' EntityTableRow', () => {
  it('should render successfully', () => {
    const data: EntityNode = {
        code: "QFWR9789",
        description: "Amoxicillin",
        type: "medicinal_product",
    };
    const entity = new Entity(data);
    const { baseElement } = render(<EntityTableRow entity={entity} />);
    expect(baseElement).toBeTruthy();
  });
});
