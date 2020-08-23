import * as React from 'react';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';

import { Entity, IEntity } from '@unified-codes/data';

import { ExplorerComponent } from './Explorer';

export default { title: 'Explorer' };

export const primary = () => {
  const client = new ApolloClient({
    uri: process.env.NX_DATA_SERVICE,
    cache: new InMemoryCache(),
  });

  const [entities, setEntities] = React.useState<Entity[]>([]);

  const onData = (data: { entities: IEntity[] }) => {
    const { entities: entityNodes } = data;
    const entities = entityNodes.map((entityNode: IEntity) => new Entity(entityNode));
    setEntities(entities);
  }

  const onError = () => console.log("onError called...");
  const onLoading = () => console.log("onLoading called...");

  return (
    <ApolloProvider client={client}>
      <ExplorerComponent entities={entities} onData={onData} onError={onError} onLoading={onLoading} />
    </ApolloProvider>
  );
};