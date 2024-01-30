import { useGql, useQuery } from '@uc-frontend/common';
import { getSdk } from '../operations.generated';
import { DRUG_INTERACTION_GROUP_KEY } from '.';

export const useAllDrugInteractionGroups = () => {
  const { client } = useGql();
  const sdk = getSdk(client);

  const cacheKeys = [DRUG_INTERACTION_GROUP_KEY];

  return useQuery(cacheKeys, async () => {
    const response = await sdk.DrugInteractionGroups();
    return response?.allDrugInteractionGroups?.data ?? [];
  });
};
