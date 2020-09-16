import * as React from 'react';

import { Entities, EntityCollection } from '@unified-codes/data';
import { ExplorerComponent } from './Explorer';

export default { title: 'Explorer' };

export const withNoProps = () => {
  const entities = new EntityCollection(Entities);

  const onReady = () => console.log('onReady called...');
  const onUpdateVariables = () => console.log('onUpdateVariables called...');
  const onSearch = () => console.log('onSearch called...');

  return (
    <ExplorerComponent
      entities={entities}
      onReady={onReady}
      onSearch={onSearch}
      onUpdateVariables={onUpdateVariables}
    />
  );
};
