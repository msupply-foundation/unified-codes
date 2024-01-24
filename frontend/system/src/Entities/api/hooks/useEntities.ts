import { EntitySearchInput, useGql, useQuery } from '@uc-frontend/common';
import { ENTITIES_KEY } from '../../../queryKeys';
import { getSdk } from './../operations.generated';

export const useEntities = ({
  filter,
  first,
  offset,
  options,
}: {
  filter: EntitySearchInput;
  first: number;
  offset: number;
  options?: { enabled: boolean };
}) => {
  const { client } = useGql();
  const sdk = getSdk(client);

  const cacheKeys = [ENTITIES_KEY, first, offset, filter];

  return useQuery(
    cacheKeys,
    async () => {
      const response = await sdk.entities({
        filter,
        first,
        offset,
      });
      return response?.entities;
    },
    options
  );
};
