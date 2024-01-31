import { useQueryClient, useGql, useMutation } from '@uc-frontend/common';
import {
  ENTITY_WITH_GS1S_KEY,
  GS1_BARCODES_KEY,
} from 'frontend/system/src/queryKeys';
import { getSdk } from '../operations.generated';

export const useAddGS1 = () => {
  const { client } = useGql();
  const sdk = getSdk(client);
  const queryClient = useQueryClient();

  const invalidateQueries = () => {
    queryClient.invalidateQueries([GS1_BARCODES_KEY]);
    queryClient.invalidateQueries([ENTITY_WITH_GS1S_KEY]);
  };

  return useMutation(sdk.AddGs1, {
    onSettled: invalidateQueries,
  });
};
