import { EntitySearchInput, useGql, useQuery } from '@uc-frontend/common';
import { getSdk } from './../operations.generated';

export const useEntities = ({
  filter,
  first,
  offset,
}: {
  filter: EntitySearchInput;
  first: number;
  offset: number;
}) => {
  const { client } = useGql();
  const sdk = getSdk(client);

  const cacheKeys = ['ENTITIES', first, offset, filter];

  return useQuery(cacheKeys, async () => {
    const response = await sdk.entities({
      filter,
      first,
      offset,
    });
    return response?.entities;
  });
};
