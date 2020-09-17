import * as React from 'react';

import { EntityCollection, IEntity } from '@unified-codes/data';
import { ExplorerComponent } from './Explorer';

export default { title: 'Explorer' };

export const withNoProps = () => {
  const entities: IEntity[] = [
    {
      code: 'QFWR9789',
      description: 'Amoxicillin',
      type: 'medicinal_product',
    },
    {
      code: 'a1004adb',
      description: 'Metronidazole',
      type: 'medicinal_product',
    },
    {
      code: 'GH89P98W',
      description: 'Paracetamol',
      type: 'medicinal_product',
    },
  ];
  const entityCollection = new EntityCollection(entities);

  const onReady = () => console.log('onReady called...');
  const onUpdateVariables = () => console.log('onUpdateVariables called...');
  const onSearch = () => console.log('onSearch called...');

  return (
    <ExplorerComponent
      entities={entityCollection}
      onReady={onReady}
      onSearch={onSearch}
      onUpdateVariables={onUpdateVariables}
    />
  );
};
