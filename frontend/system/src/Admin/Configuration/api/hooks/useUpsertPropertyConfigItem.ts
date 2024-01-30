import { useQueryClient, useGql, useMutation } from '@uc-frontend/common';
import { PROPERTY_CONFIG_ITEMS_KEY } from 'frontend/system/src/queryKeys';
import { getSdk } from '../operations.generated';

export const useUpsertPropertyConfigItem = () => {
  const { client } = useGql();
  const sdk = getSdk(client);
  const queryClient = useQueryClient();

  const invalidateQueries = () => {
    queryClient.invalidateQueries([PROPERTY_CONFIG_ITEMS_KEY]);
  };

  return useMutation(sdk.UpsertPropertyConfigItem, {
    onSettled: invalidateQueries,
  });
};
