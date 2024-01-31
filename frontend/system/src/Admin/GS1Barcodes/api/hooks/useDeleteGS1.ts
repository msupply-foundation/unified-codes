import { useGql, useMutation, useQueryClient } from '@uc-frontend/common';
import { GS1_BARCODES_KEY } from 'frontend/system/src/queryKeys';
import { getSdk } from '../operations.generated';

export const useDeleteGS1 = () => {
  const { client } = useGql();
  const sdk = getSdk(client);
  const queryClient = useQueryClient();

  return useMutation(sdk.DeleteGS1, {
    onSettled: () => queryClient.invalidateQueries(GS1_BARCODES_KEY),
  });
};
