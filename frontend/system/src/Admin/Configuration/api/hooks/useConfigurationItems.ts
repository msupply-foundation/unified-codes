import {
  ConfigurationItemTypeInput,
  useGql,
  useQuery,
} from '@uc-frontend/common';
import { getSdk } from '../operations.generated';
import { CONFIG_ITEM_KEY } from '.';

export const useConfigurationItems = ({
  type,
}: {
  type: ConfigurationItemTypeInput;
}) => {
  const { client } = useGql();
  const sdk = getSdk(client);

  const cacheKeys = [CONFIG_ITEM_KEY, type];

  return useQuery(cacheKeys, async () => {
    const response = await sdk.ConfigurationItems({
      type,
    });
    return response?.configurationItems?.data ?? [];
  });
};
