import * as React from 'react';

import { EntityCollection } from '@unified-codes/data';
import { ExplorerComponent } from './Explorer';

export default { title: 'Explorer' };

export const withNoProps = () => {
  const data = new EntityCollection();

  const onReady = () => console.log('onReady called...');
  const onUpdateVariables = () => console.log('onUpdateVariables called...');
  const onSearch = () => console.log('onSearch called...');

  return (
    <ExplorerComponent
      entities={data}
      onReady={onReady}
      onSearch={onSearch}
      onUpdateVariables={onUpdateVariables}
    />
  );
};
