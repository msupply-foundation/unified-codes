import { useGql, useQuery } from '@uc-frontend/common';
import { ENTITY_WITH_GS1S_KEY } from 'frontend/system/src/queryKeys';
import { getSdk } from '../operations.generated';

export const useEntityWithGS1s = (code: string) => {
  const { client } = useGql();
  const sdk = getSdk(client);

  const cacheKeys = [ENTITY_WITH_GS1S_KEY, code];

  return useQuery(cacheKeys, async () => {
    const response = await sdk.entityWithGS1s({ code });
    return response?.entity;
  });
};
