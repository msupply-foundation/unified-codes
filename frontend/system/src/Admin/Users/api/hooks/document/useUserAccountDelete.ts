import { useMutation, useQueryClient } from '@uc-frontend/common';
import { UserAccountRowFragment } from '../../operations.generated';
import { useUserAccountApi } from '../utils/useUserAccountApi';

export const useUserAccountDelete = () => {
  const queryClient = useQueryClient();
  const api = useUserAccountApi();
  return useMutation(
    async (userAccount: UserAccountRowFragment) => api.delete(userAccount),
    {
      onSettled: () => queryClient.invalidateQueries(api.keys.base()),
    }
  );
};
