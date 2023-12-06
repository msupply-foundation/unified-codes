import { useTranslation } from 'frontend/common/src/intl';
import { EnvUtils } from 'frontend/common/src/utils';

export const useGetPageTitle = () => {
  const t = useTranslation(['host']);
  const getPageTitle = (route: string) => {
    const mappedRoute = EnvUtils.mapRoute(route);
    return mappedRoute.title
      ? `${t(mappedRoute.title)} | ${t('app')} `
      : t('app');
  };

  return getPageTitle;
};
