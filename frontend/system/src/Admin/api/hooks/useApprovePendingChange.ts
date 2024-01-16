import { useQueryClient, useGql, useMutation } from '@uc-frontend/common';
import { getSdk } from '../operations.generated';
import {
  ENTITIES_KEY,
  ENTITY_KEY,
  PENDING_CHANGES_KEY,
  PENDING_CHANGE_KEY,
} from '../../../queryKeys';

export const useApprovePendingChange = () => {
  const { client } = useGql();
  const sdk = getSdk(client);
  const queryClient = useQueryClient();

  const invalidateQueries = () => {
    queryClient.invalidateQueries([ENTITY_KEY]);
    queryClient.invalidateQueries([ENTITIES_KEY]);
    queryClient.invalidateQueries([PENDING_CHANGES_KEY]);
    queryClient.invalidateQueries([PENDING_CHANGE_KEY]);
  };

  return useMutation(sdk.approvePendingChange, {
    onSettled: invalidateQueries,
  });
};
