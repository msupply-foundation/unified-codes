import { useUserAccountDelete } from './useUserAccountDelete';
import { useUserAccountCreate } from './useUserAccountCreate';
import { useUserAccountUpdate } from './useUserAccountUpdate';
import { useUserAccounts } from './useUserAccount';
import { useUserAccountsAll } from './useUserAccountAll';
import { useNextUserAccount } from './useNextUserAccount';
import { useUserAccountInvite } from './useUserAccountInvite';

export const Document = {
  useUserAccountDelete,
  useUserAccountInsert: useUserAccountCreate,
  useUserAccountUpdate,
  useUserAccounts,
  useUserAccountsAll,
  useNextUserAccount,
  useUserAccountInvite,
};
