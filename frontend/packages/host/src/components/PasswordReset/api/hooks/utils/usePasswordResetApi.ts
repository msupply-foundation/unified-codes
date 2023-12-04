import { useAuthContext, useGql } from '@uc-frontend/common';
import { getPasswordResetQueries } from '../../api';
import { getSdk } from '../../operations.generated';

export const usePasswordResetApi = () => {
  const keys = {
    base: () => ['password_reset'] as const,
  };

  const { client } = useGql();
  const {} = useAuthContext();
  const queries = getPasswordResetQueries(getSdk(client));
  return { ...queries, keys };
};
