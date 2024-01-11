import { useGql, useQuery } from '@uc-frontend/common';
import { PENDING_CHANGES_KEY } from '../../../queryKeys';
import { getSdk } from '../operations.generated';

// export const usePendingChanges = ({
//   filter,
//   first,
//   offset,
// }: {
//   filter: EntitySearchInput;
//   first: number;
//   offset: number;
// }) => {
export const usePendingChanges = () => {
  const { client } = useGql();
  const sdk = getSdk(client);

  // const cacheKeys = [PENDING_CHANGES_KEY, first, offset, filter];
  const cacheKeys = [PENDING_CHANGES_KEY];

  return useQuery(cacheKeys, async () => {
    // const response = await sdk.pendingChanges({
    //   filter,
    //   first,
    //   offset,
    // });
    const response = await sdk.pendingChanges();
    return response?.pendingChanges;
  });
};
