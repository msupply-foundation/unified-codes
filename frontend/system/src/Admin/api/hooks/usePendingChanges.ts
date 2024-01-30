import {
  PendingChangeSortFieldInput,
  SortBy,
  useGql,
  useQuery,
} from '@uc-frontend/common';
import { PENDING_CHANGES_KEY } from '../../../queryKeys';
import { getSdk, PendingChangeSummaryFragment } from '../operations.generated';

export const usePendingChanges = ({
  first,
  offset,
  sortBy,
}: {
  first: number;
  offset: number;
  sortBy?: SortBy<PendingChangeSummaryFragment>;
}) => {
  const { client } = useGql();
  const sdk = getSdk(client);

  const cacheKeys = [PENDING_CHANGES_KEY, first, offset, sortBy];

  return useQuery(cacheKeys, async () => {
    const response = await sdk.pendingChanges({
      page: {
        first,
        offset,
      },
      sort: sortBy?.key
        ? {
            desc: sortBy.isDesc ?? false,
            key: sortBy.key as PendingChangeSortFieldInput,
          }
        : undefined,
    });
    return response?.pendingChanges;
  });
};
