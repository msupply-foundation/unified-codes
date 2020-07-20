import * as React from 'react';
import { EntityTableRow } from '../src/components';

const entities = {
    "amoxicillin": {
        "code": "QFWR9789",
        "description": "Amoxicillin",
        "type": "medicinal_product",
    },
    "paracetamol": {
        "code": "GH89P98W",
        "description": "Paracetamol",
        "type": "medicinal_product",
    },


}

export default { title: 'EntityTableRow' };

export const withAmoxicillin = () => {
    const { amoxicillin } = entities;
    return <EntityTableRow entity={amoxicillin}/>;
}

export const withParacetamol = () => {
    const { paracetamol } = entities;
    return <EntityTableRow entity={paracetamol}/>;
}