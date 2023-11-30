import { LocaleKey, TypedTFunction } from '@common/intl';

const MIN_USERNAME_LENGTH = 3;
const invalidUsernameRegex = new RegExp('[^0-9A-Za-z_+.@]');

export const isValidUsername = (username: string): boolean => {
  return (
    (username.length >= MIN_USERNAME_LENGTH &&
      !invalidUsernameRegex.test(username)) ??
    false
  );
};

export const validateUsernameHelperText = (
  username: string,
  t: TypedTFunction<LocaleKey> // from useTranslation()
): string | undefined => {
  if (username.length < MIN_USERNAME_LENGTH) {
    return t('error.username-too-short', { ns: 'system' });
  }
  if (invalidUsernameRegex.test(username)) {
    return t('error.username-invalid-characters', { ns: 'system' });
  }
  return undefined;
};
