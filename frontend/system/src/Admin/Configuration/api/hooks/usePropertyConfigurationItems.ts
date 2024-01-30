import { useGql, useQuery } from '@uc-frontend/common';
import { getSdk } from '../operations.generated';
import { PROPERTY_CONFIG_ITEMS_KEY } from 'frontend/system/src/queryKeys';

export const usePropertyConfigurationItems = () => {
  const { client } = useGql();
  const sdk = getSdk(client);

  const cacheKeys = [PROPERTY_CONFIG_ITEMS_KEY];

  return useQuery(cacheKeys, async () => {
    const response = await sdk.PropertyConfigurationItems();
    return response?.propertyConfigurationItems?.data ?? [];
  });
};
