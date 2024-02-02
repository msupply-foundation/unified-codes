import { useQueryClient, useGql, useMutation } from '@uc-frontend/common';
import { getSdk } from '../operations.generated';
import { DRUG_INTERACTION_KEY } from '.';

export const useUpsertDrugInteraction = () => {
  const { client } = useGql();
  const sdk = getSdk(client);
  const queryClient = useQueryClient();

  const invalidateQueries = () => {
    queryClient.invalidateQueries([DRUG_INTERACTION_KEY]);
  };

  return useMutation(sdk.UpsertDrugInteraction, {
    onSettled: invalidateQueries,
  });
};
