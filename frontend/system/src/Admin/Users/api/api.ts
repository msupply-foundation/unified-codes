import {
  SortBy,
  UserAccountSortInput,
  UserAccountSortFieldInput,
  CreateUserAccountInput,
  UpdateUserAccountInput,
  InviteUserInput,
  FilterBy,
  AcceptUserInviteInput,
  PaginationInput,
} from '@uc-frontend/common';
import { InviteUserModalInput } from '../ListView/UserAccountInviteModal';
import { Sdk, UserAccountRowFragment } from './operations.generated';

export type ListParams = {
  sortBy: SortBy<UserAccountRowFragment>;
  filterBy: FilterBy | null;
  first: number;
  offset: number;
};

export type SortByParams = {
  sortBy: SortBy<UserAccountRowFragment>;
};
export const userAccountParsers = {
  toSortInput: (
    sortBy: SortBy<UserAccountRowFragment>
  ): UserAccountSortInput => {
    return {
      desc: sortBy.isDesc,
      key: sortBy.key as UserAccountSortFieldInput,
    };
  },
  toPaginate: (first: number, offset: number): PaginationInput => {
    return {
      first: first,
      offset: offset,
    };
  },
  toDelete: (userAccount: UserAccountRowFragment): string => userAccount.id,
  toCreate: (
    userAccount: UserAccountRowFragment,
    password: string
  ): CreateUserAccountInput => ({
    id: userAccount?.id,
    username: userAccount?.username,
    password: password,
    displayName: userAccount?.displayName || userAccount?.username,
    email: userAccount?.email,
    permissions: userAccount?.permissions,
  }),
  toUpdate: (
    userAccount: UserAccountRowFragment,
    password: string
  ): UpdateUserAccountInput => ({
    id: userAccount?.id,
    username: userAccount?.username,
    password: password ? password : null, // If it looks like it's not an empty string or null, it is a password
    displayName: userAccount?.displayName,
    email: userAccount?.email,
    permissions: userAccount?.permissions,
  }),
};

export const userAccountInviteParsers = {
  toInvite: (userAccount: InviteUserModalInput): InviteUserInput => ({
    email: userAccount?.email,
    permissions: userAccount?.permissions,
    username: userAccount?.username,
    displayName: userAccount?.displayName,
  }),
};

export const getUserAccountQueries = (sdk: Sdk) => ({
  get: {
    list: async ({ sortBy, filterBy, first, offset }: ListParams) => {
      // eslint-disable-next-line new-cap
      const response = await sdk.UserAccounts({
        sort: [userAccountParsers.toSortInput(sortBy)],
        filter: filterBy,
        page: userAccountParsers.toPaginate(first, offset),
      });
      return response?.userAccounts;
    },
    listAll: async ({ sortBy }: SortByParams) => {
      // eslint-disable-next-line new-cap
      const response = await sdk.UserAccounts({
        sort: [userAccountParsers.toSortInput(sortBy)],
        filter: null,
        page: null,
      });
      return response?.userAccounts;
    },
  },

  create: (userAccount: CreateUserAccountInput) =>
    sdk.createUserAccount({
      input: userAccount,
    }),
  update: (userAccount: UpdateUserAccountInput) =>
    sdk.updateUserAccount({
      input: userAccount,
    }),
  delete: (userAccount: UserAccountRowFragment) =>
    sdk.deleteUserAccount({
      input: userAccountParsers.toDelete(userAccount),
    }),
  invite: (userInvite: InviteUserInput) =>
    sdk.inviteUser({ input: userInvite }),
  acceptInvite: (input: AcceptUserInviteInput, token: string) =>
    sdk.acceptUserInvite({ input: input, token: token }),
});
