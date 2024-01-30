import { SortBy, useMutation } from '@uc-frontend/common';
import { UserAccountRowFragment } from '../../operations.generated';
import { useUserAccountApi } from '../utils/useUserAccountApi';

export const useUserAccountsAll = (sortBy: SortBy<UserAccountRowFragment>) => {
  const api = useUserAccountApi();
  const result = useMutation(api.keys.sortedList(sortBy), () =>
    api.get.listAll({ sortBy })
  );

  return { ...result };
};
