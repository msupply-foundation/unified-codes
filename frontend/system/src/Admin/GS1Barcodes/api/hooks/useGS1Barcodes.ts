import { useGql, useQuery } from 'frontend/common/src';
import { GS1_BARCODES_KEY } from '../../../../queryKeys';
import { getSdk } from '../operations.generated';

export const useGS1Barcodes = () => {
  const { client } = useGql();
  const sdk = getSdk(client);
  const cacheKeys = [GS1_BARCODES_KEY];
  return useQuery(cacheKeys, async () => {
    const response = await sdk.Gs1Barcodes();
    return response?.gs1Barcodes?.data ?? [];
  });
};
