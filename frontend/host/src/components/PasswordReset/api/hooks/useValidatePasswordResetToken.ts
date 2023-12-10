import { useMutation, useQueryClient } from '@uc-frontend/common';
import { usePasswordResetApi } from './utils/usePasswordResetApi';

export const useValidatePasswordResetToken = () => {
  const queryClient = useQueryClient();
  const api = usePasswordResetApi();
  return useMutation(
    async (token: string) => api.validatePasswordResetToken(token),
    {
      onSettled: () => queryClient.invalidateQueries(api.keys.base()),
    }
  );
};
