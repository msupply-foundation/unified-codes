import React, { FC } from 'react';

import {
  DownloadIcon,
  PlusCircleIcon,
  useNotification,
  AppBarButtonsPortal,
  Grid,
  useAuthContext,
  useTranslation,
  FileUtils,
  SortBy,
  LoadingButton,
  PermissionNode,
} from '@uc-frontend/common';
import { UserAccountRowFragment, useUserAccount } from '..';
import { userAccountsToCsv } from '../utils';

interface AppBarButtonsProps {
  onCreate: () => void;
  onInvite: () => void;
  sortBy: SortBy<UserAccountRowFragment>;
}

export const AppBarButtons: FC<AppBarButtonsProps> = ({
  onInvite,
  onCreate,
  sortBy,
}) => {
  const { hasPermission } = useAuthContext();
  const { success, error } = useNotification();
  const t = useTranslation(['system']);
  const { isLoading, mutateAsync } = useUserAccount.document.listAll(sortBy);

  const csvExport = async () => {
    const data = await mutateAsync();
    if (!data || !data?.nodes.length) {
      error(t('error.no-data'))();
      return;
    }

    const csv = userAccountsToCsv(data.nodes, t);
    FileUtils.exportCSV(csv, t('filename.users'));
    success(t('success'))();
  };

  return (
    <AppBarButtonsPortal>
      <Grid container gap={1}>
        {hasPermission(PermissionNode.ServerAdmin) ? (
          <>
            <LoadingButton
              isLoading={false}
              startIcon={<PlusCircleIcon />}
              onClick={onCreate}
            >
              {t('label.new-user')}
            </LoadingButton>

            <LoadingButton
              startIcon={<DownloadIcon />}
              variant="outlined"
              isLoading={isLoading}
              onClick={csvExport}
            >
              {t('button.export')}
            </LoadingButton>
          </>
        ) : null}
        <LoadingButton
          startIcon={<PlusCircleIcon />}
          isLoading={false}
          onClick={onInvite}
        >
          {t('label.invite-user')}
        </LoadingButton>
      </Grid>
    </AppBarButtonsPortal>
  );
};
