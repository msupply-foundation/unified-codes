import * as React from 'react';
import { Entity, EntityNode } from '../src/types';
import { EntityTable } from '../src/components';

const entities: EntityNode[] = [
    {
        "code": "QFWR9789",
        "description": "Amoxicillin",
        "type": "medicinal_product",
    },
    {
        "code": "GH89P98W",
        "description": "Paracetamol",
        "type": "medicinal_product",
    }
];

export default { title: 'EntityTable' };

export const withAmoxicillinAndParacetamol = () => {
    const data = entities.map(entityNode => new Entity(entityNode));
    return <EntityTable data={data}/>;
}