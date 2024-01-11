import { useQueryClient, useGql } from '@uc-frontend/common';
import { getSdk } from '../operations.generated';
import { PENDING_CHANGES_KEY } from '../../../queryKeys';

export const useRequestChange = () => {
  const { client } = useGql();
  const sdk = getSdk(client);
  const queryClient = useQueryClient();

  const invalidateQueries = () => {
    queryClient.invalidateQueries([PENDING_CHANGES_KEY]);
  };

  return [sdk.requestChange, invalidateQueries] as const;
};
