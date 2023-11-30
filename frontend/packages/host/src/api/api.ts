import { Sdk } from './operations.generated';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getHostQueries = (sdk: Sdk) => ({
  get: {
    version: async () => {
      // const result = await sdk.apiVersion();
      // return result.apiVersion;
      return 'v1';
    },
  },
});
