import * as React from 'react';

import { Entity } from '@unified-codes/data';
import { IExplorerData } from '../../types';

import { ExplorerComponent } from './Explorer';

export default { title: 'Explorer' };

export const withNoProps = () => {
  const [entities] = React.useState<Entity[]>([]);
  const data: IExplorerData = {
    entities,
    hasMore: false,
    totalResults: 0,
  };

  const onReady = () => console.log('onReady called...');
  const onUpdateVariables = () => console.log('onUpdateVariables called...');
  const onSearch = () => console.log('onSearch called...');

  return (
    <ExplorerComponent
      data={data}
      onReady={onReady}
      onSearch={onSearch}
      onUpdateVariables={onUpdateVariables}
    />
  );
};
