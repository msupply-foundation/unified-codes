import { Document } from './document';
import { Utils } from './utils';

export const useUserAccount = {
  document: {
    list: Document.useUserAccounts,
    listAll: Document.useUserAccountsAll,

    update: Document.useUserAccountUpdate,
    delete: Document.useUserAccountDelete,
    insert: Document.useUserAccountInsert,
    invite: Document.useUserAccountInvite,

    next: Document.useNextUserAccount,
  },
  utils: {
    api: Utils.useUserAccountApi,
  },
};
