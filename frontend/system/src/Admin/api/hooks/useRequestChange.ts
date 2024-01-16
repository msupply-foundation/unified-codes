import { useQueryClient, useGql, useMutation } from '@uc-frontend/common';
import { getSdk } from '../operations.generated';
import { PENDING_CHANGES_KEY, PENDING_CHANGE_KEY } from '../../../queryKeys';

export const useRequestChange = () => {
  const { client } = useGql();
  const sdk = getSdk(client);
  const queryClient = useQueryClient();

  const invalidateQueries = () => {
    queryClient.invalidateQueries([PENDING_CHANGES_KEY]);
    queryClient.invalidateQueries([PENDING_CHANGE_KEY]);
  };

  return useMutation(sdk.requestChange, {
    onSettled: invalidateQueries,
  });
};
