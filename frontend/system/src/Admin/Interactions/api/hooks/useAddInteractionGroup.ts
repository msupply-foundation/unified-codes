import { useQueryClient, useGql } from '@uc-frontend/common';
import { getSdk } from '../operations.generated';
import { DRUG_INTERACTION_GROUP_KEY } from '.';

export const useAddDrugInteractionGroup = () => {
  const { client } = useGql();
  const sdk = getSdk(client);
  const queryClient = useQueryClient();

  const invalidateQueries = () => {
    queryClient.invalidateQueries([DRUG_INTERACTION_GROUP_KEY]);
  };

  return [sdk.AddDrugInteractionGroup, invalidateQueries] as const;
};
