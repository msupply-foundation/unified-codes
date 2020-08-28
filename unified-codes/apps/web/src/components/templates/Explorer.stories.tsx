import * as React from 'react';

import { Entity } from '@unified-codes/data';

import { ExplorerComponent } from './Explorer';

export default { title: 'Explorer' };

export const withNoProps = () => {
  const [entities] = React.useState<Entity[]>([]);

  const onReady = () => console.log('onReady called...');
  const onClear = () => console.log('onClear called...');
  const onSearch = () => console.log('onSearch called...');

  return (
    <ExplorerComponent
      entities={entities}
      onReady={onReady}
      onClear={onClear}
      onSearch={onSearch}
    />
  );
};
