import { useQueryClient, useGql } from '@uc-frontend/common';
import { getSdk } from '../operations.generated';
import { CONFIG_ITEM_KEY } from '.';

export const useAddConfigItem = () => {
  const { client } = useGql();
  const sdk = getSdk(client);
  const queryClient = useQueryClient();

  const invalidateQueries = () => {
    queryClient.invalidateQueries([CONFIG_ITEM_KEY]);
  };

  return [sdk.AddConfigItem, invalidateQueries] as const;
};
