import { useQueryClient, useGql } from '@uc-frontend/common';
import { getSdk } from '../operations.generated';
import { PENDING_CHANGES_KEY, PENDING_CHANGE_KEY } from '../../../queryKeys';

export const useRejectPendingChange = () => {
  const { client } = useGql();
  const sdk = getSdk(client);
  const queryClient = useQueryClient();

  const invalidateQueries = () => {
    queryClient.invalidateQueries([PENDING_CHANGES_KEY]);
    queryClient.invalidateQueries([PENDING_CHANGE_KEY]);
  };

  return [sdk.rejectPendingChange, invalidateQueries] as const;
};
