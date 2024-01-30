import { useGql, useMutation, useQueryClient } from '@uc-frontend/common';
import { getSdk } from '../operations.generated';
import { CONFIG_ITEM_KEY } from '.';

export const useDeleteConfigurationItem = () => {
  const { client } = useGql();
  const sdk = getSdk(client);
  const queryClient = useQueryClient();

  return useMutation(async (code: string) => sdk.DeleteConfigItem({ code }), {
    onSettled: () => queryClient.invalidateQueries(CONFIG_ITEM_KEY),
  });
};
