import {
  CreateUserAccountInput,
  useMutation,
  useQueryClient,
} from '@uc-frontend/common';
import { useUserAccountApi } from '../utils/useUserAccountApi';

export const useUserAccountCreate = () => {
  const queryClient = useQueryClient();
  const api = useUserAccountApi();
  return useMutation(
    async (userAccount: CreateUserAccountInput) => api.create(userAccount),
    {
      onSettled: () => queryClient.invalidateQueries(api.keys.base()),
    }
  );
};
