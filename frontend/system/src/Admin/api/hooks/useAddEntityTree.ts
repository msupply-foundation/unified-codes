import { useQueryClient, useGql } from '@uc-frontend/common';
import { getSdk } from '../operations.generated';
import { ENTITIES_KEY, ENTITY_KEY } from '../../../queryKeys';

export const useAddEntityTree = () => {
  const { client } = useGql();
  const sdk = getSdk(client);
  const queryClient = useQueryClient();

  const invalidateQueries = () => {
    queryClient.invalidateQueries([ENTITY_KEY]);
    queryClient.invalidateQueries([ENTITIES_KEY]);
  };

  return [sdk.addEntityTree, invalidateQueries] as const;
};
