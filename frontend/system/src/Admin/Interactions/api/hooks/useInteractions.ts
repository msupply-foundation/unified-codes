import { useGql, useQuery } from '@uc-frontend/common';
import { getSdk } from '../operations.generated';
import { DRUG_INTERACTION_KEY } from '.';

export const useAllDrugInteractions = () => {
  const { client } = useGql();
  const sdk = getSdk(client);

  const cacheKeys = [DRUG_INTERACTION_KEY];

  return useQuery(cacheKeys, async () => {
    const response = await sdk.DrugInteractions();
    return response?.allDrugInteractions?.data ?? [];
  });
};
