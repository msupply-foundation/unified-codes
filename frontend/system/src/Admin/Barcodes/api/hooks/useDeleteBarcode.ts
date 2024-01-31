import { useGql, useMutation, useQueryClient } from '@uc-frontend/common';
import { BARCODES_KEY } from 'frontend/system/src/queryKeys';
import { getSdk } from '../operations.generated';

export const useDeleteBarcode = () => {
  const { client } = useGql();
  const sdk = getSdk(client);
  const queryClient = useQueryClient();

  return useMutation(sdk.DeleteBarcode, {
    onSettled: () => queryClient.invalidateQueries(BARCODES_KEY),
  });
};
