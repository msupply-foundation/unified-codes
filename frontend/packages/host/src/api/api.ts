import { Sdk } from './operations.generated';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getHostQueries = (sdk: Sdk) => ({
  get: {
    version: async () => {
      // const result = await sdk.apiVersion();
      // return result.apiVersion;
      return 'v1';
    },
    entity: async (code: string) => {
      const result = await sdk.entity({ code });
      return result.entity2;
    },
  },
});
