import { useGql, useQuery } from '@uc-frontend/common';
import { getSdk } from '../operations.generated';
import { ENTITY_KEY } from '../../../queryKeys';

export const useProduct = (code: string) => {
  const { client } = useGql();
  const sdk = getSdk(client);

  const cacheKeys = [ENTITY_KEY, 'PRODUCT', code];

  return useQuery(cacheKeys, async () => {
    const response = await sdk.product({ code });
    return response?.product;
  });
};
