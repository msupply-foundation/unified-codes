import React from 'react';
import { render } from '@testing-library/react';

import { Entity, EntityNode } from "@unified-codes/data";

import EntityTable from './EntityTable';

describe(' EntityTable', () => {
  it('should render successfully', () => {
    const data: EntityNode[] = [
        {
            code: "QFWR9789",
            description: "Amoxicillin",
            type: "medicinal_product",
        },
        {
          code: "GH89P98W",
          description: "Paracetamol",
          type: "medicinal_product",
        },
    ];
    const entities = data.map((entityNode: EntityNode) => new Entity(entityNode));
    const { baseElement } = render(<EntityTable data={entities} />);
    expect(baseElement).toBeTruthy();
  });
});
