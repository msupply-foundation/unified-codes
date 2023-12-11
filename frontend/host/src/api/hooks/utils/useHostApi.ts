import { useAuthContext, useGql } from '@uc-frontend/common';
import { getHostQueries } from '../../api';
import { getSdk } from '../../operations.generated';

export const useHostApi = () => {
  const keys = {
    base: () => ['host'] as const,
    version: () => [...keys.base(), 'version'] as const,
    settings: () => [...keys.base(), 'settings'] as const,
  };

  const { client } = useGql();
  const {} = useAuthContext();
  const queries = getHostQueries(getSdk(client));
  return { ...queries, keys };
};
