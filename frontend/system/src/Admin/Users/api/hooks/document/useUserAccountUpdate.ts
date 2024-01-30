import {
  UpdateUserAccountInput,
  useMutation,
  useQueryClient,
} from '@uc-frontend/common';
import { useUserAccountApi } from '../utils/useUserAccountApi';

export const useUserAccountUpdate = () => {
  const queryClient = useQueryClient();
  const api = useUserAccountApi();
  return useMutation(
    async (userAccount: UpdateUserAccountInput) => api.update(userAccount),
    {
      onSettled: () => queryClient.invalidateQueries(api.keys.base()),
    }
  );
};
