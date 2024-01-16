import { useGql, useQuery } from '@uc-frontend/common';
import { PENDING_CHANGE_KEY } from '../../../queryKeys';
import { getSdk } from '../operations.generated';

export const usePendingChange = (id: string) => {
  const { client } = useGql();
  const sdk = getSdk(client);

  const cacheKeys = [PENDING_CHANGE_KEY, id];

  return useQuery(cacheKeys, async () => {
    const response = await sdk.pendingChange({ id });
    return response?.pendingChange;
  });
};
