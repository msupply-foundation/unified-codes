import { useQueryClient, useGql } from '@uc-frontend/common';
import { getSdk } from '../operations.generated';
import { PENDING_CHANGES_KEY, PENDING_CHANGE_KEY } from '../../../queryKeys';

export const useEditPendingChange = () => {
  const { client } = useGql();
  const sdk = getSdk(client);
  const queryClient = useQueryClient();

  const invalidateQueries = () => {
    queryClient.invalidateQueries([PENDING_CHANGES_KEY]);
    queryClient.invalidateQueries([PENDING_CHANGE_KEY]);
  };

  // TODO:
  //  return useMutation(sdk.updatePendingChange, {
  //   onSettled: invalidateQueries,
  // });

  return [sdk.updatePendingChange, invalidateQueries] as const;
};
