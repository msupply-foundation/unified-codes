import { useGql, useQuery } from 'frontend/common/src';
import { GS1_BARCODES_KEY } from '../../../../queryKeys';
import { getSdk } from '../operations.generated';

export const useGS1Barcodes = ({
  first,
  offset,
}: {
  first: number;
  offset: number;
}) => {
  const { client } = useGql();
  const sdk = getSdk(client);
  const cacheKeys = [GS1_BARCODES_KEY, first, offset];

  return useQuery(cacheKeys, async () => {
    const response = await sdk.Gs1Barcodes({ first, offset });
    return response?.gs1Barcodes;
  });
};
