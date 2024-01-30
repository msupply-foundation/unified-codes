import zustand, { SetState } from 'zustand';
import { ButtonWithIcon } from './ui';
import { useAuthContext } from './authentication';

export {
  KBarProvider,
  KBarPortal,
  KBarPositioner,
  KBarAnimator,
  KBarSearch,
  KBarResults,
  useRegisterActions,
  useMatches,
} from 'kbar';

export * from 'graphql-request';
export * from 'react-query';
export * from 'react-query/devtools';
export * from 'react-router-dom';
export * from './utils';
export * from './ui';
export * from './hooks';
export * from './intl';
export * from './styles';
export * from './localStorage';
export * from './types';
export * from './api';
export * from './authentication';

export {
  zustand,
  SetState,
  /* 
   The below should be exported above by the `*`, but
   not explicitly exporting them here results in code from
   `ui/components/modals` becoming undefined/unresolved. 
   Probably an issue with circular deps?
  */
  ButtonWithIcon,
  useAuthContext,
};
