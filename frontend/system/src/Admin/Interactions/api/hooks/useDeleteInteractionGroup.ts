import { useGql, useMutation, useQueryClient } from '@uc-frontend/common';
import { getSdk } from '../operations.generated';
import { DRUG_INTERACTION_GROUP_KEY } from '.';

export const useDeleteInteractionGroup = () => {
  const { client } = useGql();
  const sdk = getSdk(client);
  const queryClient = useQueryClient();

  return useMutation(
    async (id: string) => sdk.DeleteDrugInteractionGroup({ id }),
    {
      onSettled: () =>
        queryClient.invalidateQueries(DRUG_INTERACTION_GROUP_KEY),
    }
  );
};
