import { LocaleKey } from '@common/intl';

interface RouteMapping {
  title?: LocaleKey;
  docs: string;
}

const mapRoute = (route: string): RouteMapping => {
  const inRoute = (sub: string) => new RegExp(`/${sub}/|/${sub}\$`).test(route);
  switch (true) {
    case inRoute('Users'):
      return { title: undefined, docs: '/managing-users/' };
    default:
      return { title: undefined, docs: '/introduction/' };
  }
};

export const EnvUtils = {
  // Using isProduction rather than isDevelopment, as we also use a testing
  // environment while running jest, so easier to check !isProduction, generally.
  isProduction: (): boolean => process.env['NODE_ENV'] === 'production',
  mapRoute,
};
