import * as React from 'react';

import { Entity } from '@unified-codes/data';
import { IExplorerData } from '../../types';

import { ExplorerComponent } from './Explorer';

export default { title: 'Explorer' };

export const withNoProps = () => {
  const [entities] = React.useState<Entity[]>([]);
  const data: IExplorerData = {
    data: entities,
    hasMore: false,
    totalResults: 0,
  };

  const onReady = () => console.log('onReady called...');
  const onClear = () => console.log('onClear called...');
  const onSearch = () => console.log('onSearch called...');
  const onFetch = () => console.log('onFetch called...');

  return (
    <ExplorerComponent
      entities={data}
      onReady={onReady}
      onClear={onClear}
      onSearch={onSearch}
      onFetch={onFetch}
    />
  );
};
