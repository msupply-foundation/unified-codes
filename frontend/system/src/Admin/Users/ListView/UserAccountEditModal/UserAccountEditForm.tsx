import React, { FC, lazy } from 'react';
import {
  BasicTextInput,
  Grid,
  useTranslation,
  Select,
  PermissionNode,
  TypedTFunction,
  LocaleKey,
  PasswordTextInput,
  useAuthContext,
  isValidUsername,
  validateUsernameHelperText,
} from '@uc-frontend/common';
import { UserAccountRowFragment } from '../../api';

const PasswordStrengthMeter = lazy(
  () =>
    import('frontend/host/src/components/PasswordReset/PasswordStrengthMeter')
);

type UserAccountEditFormProps = {
  userAccount: UserAccountRowFragment;
  password: string;
  setPassword: (password: string) => void;
  onUpdate: (patch: Partial<UserAccountRowFragment>) => void;
};

const PERMISSION_NODES_MAPPING = {
  serverAdmin: PermissionNode.ServerAdmin,
};

const userIdentifyingData = (userAccount: UserAccountRowFragment): string[] => {
  return [
    userAccount.displayName ?? '',
    userAccount.email ? userAccount.email : '',
  ];
};

const permissionOptions = (t: TypedTFunction<LocaleKey>) => {
  return Object.keys(PERMISSION_NODES_MAPPING).map((value: string, index) => ({
    label: t(`permissions.${value.toLowerCase()}` as LocaleKey),
    value: Object.values(PERMISSION_NODES_MAPPING)[index] as string,
  }));
};

const permissionValueToArray = (permission: PermissionNode): PermissionNode[] =>
  permission === ('None' as PermissionNode) ? [] : [permission];

const permissionArrayToValue = (permissions: PermissionNode[]): string =>
  permissions.length === 0 ? 'None' : (permissions[0] as PermissionNode);

export const UserAccountEditForm: FC<UserAccountEditFormProps> = ({
  userAccount,
  password,
  setPassword,
  onUpdate,
}) => {
  const t = useTranslation(['system']);

  const { hasPermission } = useAuthContext();
  const loggedInAsServerAdmin = hasPermission(PermissionNode.ServerAdmin);

  return (
    <Grid flexDirection="column" display="flex" gap={2}>
      <BasicTextInput
        autoFocus
        value={userAccount.username}
        error={!isValidUsername(userAccount.username)}
        helperText={validateUsernameHelperText(userAccount.username, t)}
        required
        onChange={e => onUpdate({ username: e.target.value.toLowerCase() })}
        label={t('heading.username')}
        InputLabelProps={{ shrink: true }}
      />
      {/* TODO: Confirmation before password changes */}
      <PasswordTextInput
        value={password || ''}
        onChange={e => setPassword(e.target.value)}
        label={t('heading.password')}
      />
      <PasswordStrengthMeter
        password={password}
        userInfo={userIdentifyingData(userAccount)}
        includeFeedback={true}
      />
      <BasicTextInput
        value={userAccount.displayName}
        onChange={e => onUpdate({ displayName: e.target.value })}
        label={t('label.name')}
        InputLabelProps={{ shrink: true }}
      />
      <BasicTextInput
        value={userAccount.email || ''}
        onChange={e => onUpdate({ email: e.target.value })}
        label={t('label.email')}
        InputLabelProps={{ shrink: true }}
      />
      <Grid item>
        <Select
          label={t('label.role')}
          required
          disabled={!loggedInAsServerAdmin}
          value={permissionArrayToValue(userAccount.permissions)} // Right now we're only supporting a single 'role' in the frontend, but back end supports more complex permissions (for future use)
          options={permissionOptions(t)}
          onChange={e => {
            onUpdate({
              permissions: permissionValueToArray(
                e.target.value as PermissionNode
              ),
            });
          }}
          fullWidth
        />
      </Grid>
    </Grid>
  );
};
