export * from './routes';
import config from './config';

interface EnvironmentConfig {
  API_HOST: string;
  BUILD_VERSION: string;
  BUGSNAG_API_KEY?: string;
  GRAPHQL_URL: string;
  COOKIE_LIFETIME_MINUTES: number;
}

declare global {
  interface Window {
    env: EnvironmentConfig;
  }
}

const {
  API_HOST = 'http://localhost:4000',
  BUILD_VERSION = '0.0.0',
  BUGSNAG_API_KEY = '',
} = config ?? {};

export const Environment: EnvironmentConfig = {
  API_HOST,
  BUILD_VERSION,
  BUGSNAG_API_KEY,
  GRAPHQL_URL: `${API_HOST}/graphql`,
  COOKIE_LIFETIME_MINUTES: 4 * 60, // 4 hours
};
