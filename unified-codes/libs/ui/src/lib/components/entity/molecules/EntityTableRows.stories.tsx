import React from 'react';

import { IEntity, EEntityField } from '@unified-codes/data';

import { EntityTableRows } from './EntityTableRows';

export default {
  component: EntityTableRows,
  title: 'EntityTable/EntityTableRows',
};

export const withProps = () => {
    const columns = [ EEntityField.CODE, EEntityField.DESCRIPTION, EEntityField.TYPE ];

    const entities: IEntity[] = [
        { code: 'A', description: 'Drug A', type: 'medicinal_product' },
        { code: 'B', description: 'Drug B', type: 'medicinal_product' },
        { code: 'C', description: 'Drug C', type: 'medicinal_product' },
        { code: 'D', description: 'Drug D', type: 'medicinal_product' },
        { code: 'E', description: 'Drug E', type: 'medicinal_product' }
    ];

  return <EntityTableRows columns={columns} entities={entities}/>;
};
