import * as React from 'react';
import { Entity } from '../src/types';
import { EntityTable } from '../src/components';

const entities: Entity[] = [
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
    return <EntityTable data={entities}/>;
}