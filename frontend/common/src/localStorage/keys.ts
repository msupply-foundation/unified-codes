import { SupportedLocales } from '@common/intl';
import { ThemeOptions } from '@mui/material';
import { AuthError } from '../authentication/AuthContext';

export type GroupByItem = {
  outboundShipment?: boolean;
  inboundShipment?: boolean;
};
type AuthenticationCredentials = {
  username: string;
};

export type LocalStorageRecord = {
  '/appdrawer/open': boolean;
  '/detailpanel/open': boolean;
  '/localisation/locale': Record<string, SupportedLocales>;
  '/groupbyitem': GroupByItem;
  '/theme/custom': ThemeOptions;
  '/theme/logo': string;
  '/mru/credentials': AuthenticationCredentials;
  '/auth/error': AuthError | undefined;
};

export type LocalStorageKey = keyof LocalStorageRecord;
