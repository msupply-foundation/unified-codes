import { useGql, useQuery } from 'frontend/common/src';
import { BARCODES_KEY } from '../../../../queryKeys';
import { getSdk } from '../operations.generated';

export const useBarcodes = ({
  first,
  offset,
}: {
  first: number;
  offset: number;
}) => {
  const { client } = useGql();
  const sdk = getSdk(client);
  const cacheKeys = [BARCODES_KEY, first, offset];

  return useQuery(cacheKeys, async () => {
    const response = await sdk.Barcodes({ first, offset });
    return response?.barcodes;
  });
};
