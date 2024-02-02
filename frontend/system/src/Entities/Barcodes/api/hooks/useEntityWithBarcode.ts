import { useGql, useQuery } from '@uc-frontend/common';
import { ENTITY_WITH_BARCODES_KEY } from 'frontend/system/src/queryKeys';
import { getSdk } from '../operations.generated';

export const useEntityWithBarcodes = (code: string) => {
  const { client } = useGql();
  const sdk = getSdk(client);

  const cacheKeys = [ENTITY_WITH_BARCODES_KEY, code];

  return useQuery(cacheKeys, async () => {
    const response = await sdk.entityWithBarcodes({ code });
    return response?.entity;
  });
};
