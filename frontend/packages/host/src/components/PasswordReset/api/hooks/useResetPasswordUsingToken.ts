import { useMutation, useQueryClient } from '@uc-frontend/common';
import { usePasswordResetApi } from './utils/usePasswordResetApi';

type resetPasswordParams = {
  token: string;
  password: string;
};

export const useResetPasswordUsingToken = () => {
  const queryClient = useQueryClient();
  const api = usePasswordResetApi();
  return useMutation(
    async (params: resetPasswordParams) =>
      api.resetPasswordUsingToken(params.token, params.password),
    {
      onSettled: () => queryClient.invalidateQueries(api.keys.base()),
    }
  );
};
