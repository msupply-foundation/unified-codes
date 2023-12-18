import React, { FC } from 'react';
import {
  TableProvider,
  DataTable,
  useColumns,
  createTableStore,
  useEditModal,
  useInviteModal,
  NothingHere,
  useTranslation,
  useUrlQueryParams,
} from '@uc-frontend/common';
import { useUserAccount, UserAccountRowFragment } from '../api';
import { AppBarButtons } from './AppBarButtons';
import { UserAccountEditModal } from './UserAccountEditModal';
import { UserAccountInviteModal } from './UserAccountInviteModal';
import { Toolbar } from './Toolbar';
import { UserActions } from './UserActions';

const UserAccountListComponent: FC = () => {
  const {
    updateSortQuery,
    updatePaginationQuery,
    filter,
    queryParams: { sortBy, page, first, offset },
  } = useUrlQueryParams({
    filterKey: 'username',
    initialSort: {
      key: 'username',
      dir: 'asc',
    },
  });
  const { data, isError, isLoading } = useUserAccount.document.list();
  const pagination = { page, first, offset };
  const t = useTranslation('system');
  const { isOpen, entity, mode, onClose, onOpen } =
    useEditModal<UserAccountRowFragment>();
  const { isOpenInvite, onCloseInvite, onOpenInvite } =
    useInviteModal<UserAccountRowFragment>();
  const userAccounts = data?.nodes ?? [];
  const columns = useColumns<UserAccountRowFragment>(
    [
      { key: 'username', label: 'label.username', width: 75 },
      {
        key: 'displayName',
        label: 'label.name',
        width: 75,
      },
      {
        key: 'email',
        label: 'label.email',
        width: 160,
        sortable: false,
        accessor: ({ rowData }: { rowData: UserAccountRowFragment }) => {
          return rowData.email ?? '';
        },
      },
      {
        key: 'actions',
        label: 'label.actions',
        width: 260,
        sortable: false,
        Cell: props => (
          <UserActions
            email={props.rowData.email ?? null}
            userId={props.rowData.id}
          />
        ),
      },
      'selection',
    ],
    {
      onChangeSortBy: updateSortQuery,
      sortBy,
    },
    [updateSortQuery, sortBy]
  );

  return (
    <>
      {isOpen && (
        <UserAccountEditModal
          mode={mode}
          isOpen={isOpen}
          onClose={onClose}
          userAccount={entity}
        />
      )}
      {isOpenInvite && (
        <UserAccountInviteModal
          isOpen={isOpenInvite}
          onClose={onCloseInvite}
          userAccount={null}
        />
      )}
      <Toolbar data={userAccounts} filter={filter} />
      <AppBarButtons
        onInvite={() => onOpenInvite()}
        onCreate={() => onOpen()}
        sortBy={sortBy}
      />
      <DataTable
        pagination={{ ...pagination, total: data?.totalCount }}
        onChangePage={updatePaginationQuery}
        columns={columns}
        data={userAccounts}
        isError={isError}
        isLoading={isLoading}
        onRowClick={onOpen}
        noDataElement={
          <NothingHere body={t('error.no-users')} onCreate={() => onOpen()} />
        }
      />
    </>
  );
};

export const UserAccountListView: FC = () => {
  return (
    <TableProvider createStore={createTableStore}>
      <UserAccountListComponent />
    </TableProvider>
  );
};
