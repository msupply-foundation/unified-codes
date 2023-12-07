import countries from 'i18n-iso-countries';
import { IntlUtils } from '../utils';

const register = (language: string) => {
  countries.registerLocale(
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require(`i18n-iso-countries/langs/${language}.json`)
  );
};

export const getTranslatedCountry = (
  countryCode: string | null | undefined
) => {
  const language = IntlUtils.useCurrentLanguage();
  register(language);

  if (!countryCode) return '';
  return countries.getName(countryCode, language);
};

export const useI18nCountryOptions = () => {
  const language = IntlUtils.useCurrentLanguage();
  register(language);

  return Object.entries(countries.getNames(language))
    .map(([key, value]) => {
      // key === Country code to store and translate from in future
      // value === translated string to show as label
      return { label: value, value: key };
    })
    .sort((a, b) => {
      if (a.label > b.label) return 1;
      if (a.label < b.label) return -1;
      return 0;
    });
};
