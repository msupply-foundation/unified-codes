import { useQuery } from '@uc-frontend/common';
import { useHostApi } from './useHostApi';

export const useEntity = (code: string) => {
  const api = useHostApi();
  return useQuery(
    api.keys.entity(code),
    () => api.get.entity(code),
    // Don't refetch on open. But, don't cache data when this query
    // is inactive. For example, when navigating away from the page and back again, refetch.
    {
      refetchOnMount: false,
      cacheTime: 0,
    }
  );
};
