import { AboutPage } from '../components/containers/about';
import { DetailPage } from '../components/containers/detail';
import { ExplorerPage } from '../components/containers/explorer';
import { ErrorPage } from '../components/containers/error';
import { LoginPage } from '../components/containers/login';

export const ROUTES = {
  ABOUT: AboutPage,
  DETAIL: DetailPage,
  EXPLORER: ExplorerPage,
  ERROR: ErrorPage,
  LOGIN: LoginPage,
};

export default ROUTES;
