import { LocaleKey, TypedTFunction } from '@common/intl';

const MIN_LENGTH = 3;
const invalidVariableName = new RegExp('[^0-9A-Za-z_]');

export const isValidVariableName = (name: string): boolean => {
  return (
    (name.length >= MIN_LENGTH && !invalidVariableName.test(name)) ?? false
  );
};

export const validateVariableNameHelperText = (
  name: string,
  t: TypedTFunction<LocaleKey> // from useTranslation()
): string | undefined => {
  if (name.length < MIN_LENGTH) {
    return t('error.name-too-short', { ns: 'system' });
  }
  if (invalidVariableName.test(name)) {
    return t('error.name-invalid-characters', { ns: 'system' });
  }
  return undefined;
};
