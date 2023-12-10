import { Sdk } from './operations.generated';

export const getPasswordResetQueries = (sdk: Sdk) => ({
  initiatePasswordReset: async (emailOrUserId: string) => {
    const result = await sdk.initiatePasswordReset({
      emailOrUserId: emailOrUserId,
    });
    return result.initiatePasswordReset;
  },
  validatePasswordResetToken: async (token: string) => {
    const result = await sdk.validatePasswordResetToken({ token: token });
    return result.validatePasswordResetToken;
  },
  resetPasswordUsingToken: async (token: string, password: string) => {
    const result = await sdk.resetPasswordUsingToken({
      token: token,
      password: password,
    });
    return result.resetPasswordUsingToken;
  },
});
