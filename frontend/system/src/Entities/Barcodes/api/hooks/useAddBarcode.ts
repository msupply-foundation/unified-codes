import { useQueryClient, useGql, useMutation } from '@uc-frontend/common';
import {
  ENTITY_WITH_BARCODES_KEY,
  BARCODES_KEY,
} from 'frontend/system/src/queryKeys';
import { getSdk } from '../operations.generated';

export const useAddBarcode = () => {
  const { client } = useGql();
  const sdk = getSdk(client);
  const queryClient = useQueryClient();

  const invalidateQueries = () => {
    queryClient.invalidateQueries([BARCODES_KEY]);
    queryClient.invalidateQueries([ENTITY_WITH_BARCODES_KEY]);
  };

  return useMutation(sdk.AddBarcode, {
    onSettled: invalidateQueries,
  });
};
