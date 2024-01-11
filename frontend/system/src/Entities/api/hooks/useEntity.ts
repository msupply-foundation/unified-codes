import { useGql, useQuery } from '@uc-frontend/common';
import { getSdk } from '../operations.generated';
import { ENTITY_KEY } from '../../../queryKeys';

export const useEntity = (code: string) => {
  const { client } = useGql();
  const sdk = getSdk(client);

  const cacheKeys = [ENTITY_KEY, code];

  return useQuery(cacheKeys, async () => {
    const response = await sdk.entity({ code });
    return response?.entity;
  });
};
