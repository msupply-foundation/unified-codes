import { useGql, SortBy } from '@uc-frontend/common';
import { getUserAccountQueries, ListParams } from '../../api';
import { getSdk, UserAccountRowFragment } from '../../operations.generated';

export const useUserAccountApi = () => {
  const keys = {
    base: () => ['userAccount'] as const,
    detail: (id: string) => [...keys.base(), id] as const,
    list: () => [...keys.base(), 'list'] as const,
    paramList: (params: ListParams) => [...keys.list(), params] as const,
    sortedList: (sortBy: SortBy<UserAccountRowFragment>) =>
      [...keys.list(), sortBy] as const,
  };
  const { client } = useGql();
  const sdk = getSdk(client);
  const queries = getUserAccountQueries(sdk);
  return { ...queries, keys };
};
