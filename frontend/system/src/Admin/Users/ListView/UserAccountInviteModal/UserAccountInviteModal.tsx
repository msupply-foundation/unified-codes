import React, { FC, useState } from 'react';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import {
  useDialog,
  BasicTextInput,
  Grid,
  DialogButton,
  useTranslation,
  LoadingButton,
  CheckIcon,
  Select,
  PermissionNode,
  TypedTFunction,
  LocaleKey,
  validateUsernameHelperText,
  isValidUsername,
} from '@uc-frontend/common';
import { useUserAccount } from '../../api';

import { userAccountInviteParsers } from '../../api/api';

const PERMISSION_NODES_MAPPING = {
  // None: 'None,
  ServerAdmin: PermissionNode.ServerAdmin,
};

interface UserAccountInviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  userAccount: InviteUserModalInput | null;
}

export interface InviteUserModalInput {
  username: string;
  displayName: string;
  permissions: PermissionNode[];
  email: string;
}

interface useDraftUserAccountControlInvite {
  draft: InviteUserModalInput;
  onSave: () => Promise<void>;
  onUpdate: (patch: Partial<InviteUserModalInput>) => void;
  isLoading: boolean;
}

const createNewUserAccount = (): InviteUserModalInput => ({
  username: '',
  displayName: '',
  permissions: [],
  email: '',
});

const useDraftUserAccountInvite = (): useDraftUserAccountControlInvite => {
  const [userAccount, setUserAccount] = useState<InviteUserModalInput>(
    createNewUserAccount()
  );

  const { mutateAsync: invite, isLoading: insertIsLoading } =
    useUserAccount.document.invite();

  const onUpdate = (patch: Partial<InviteUserModalInput>) => {
    setUserAccount({ ...userAccount, ...patch });
  };

  const onSave = async () => {
    await invite(userAccountInviteParsers.toInvite(userAccount));
  };

  return {
    draft: userAccount,
    onSave,
    onUpdate,
    isLoading: insertIsLoading,
  };
};

const permissionOptions = (t: TypedTFunction<LocaleKey>) => {
  const enumOptions = Object.keys(PERMISSION_NODES_MAPPING).map(
    (value: string, index) => ({
      label: t(`permissions.${value.toLowerCase()}` as LocaleKey),
      value: Object.values(PERMISSION_NODES_MAPPING)[index] as string,
    })
  );
  return enumOptions;
  // TODO: for now our only role is ServerAdmin... do we want another role that's not quite server admin to invite people to?
  // return enumOptions.filter(
  //   value => value.value !== PermissionNode.ServerAdmin
  // );
};

const permissionValueToArray = (permission: PermissionNode): PermissionNode[] =>
  permission === ('None' as PermissionNode) ? [] : [permission];

const permissionArrayToValue = (permissions: PermissionNode[]): string =>
  permissions.length === 0 ? 'None' : (permissions[0] as PermissionNode);

const emailInvalid = (email: string) =>
  !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const UserAccountInviteModal: FC<UserAccountInviteModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [errorMessage, setErrorMessage] = useState('');
  const t = useTranslation(['system']);
  const { Modal } = useDialog({ isOpen, onClose });
  const { draft, onSave, isLoading, onUpdate } = useDraftUserAccountInvite();

  const [userNameEdited, setUserNameEdited] = useState(false);

  const isInvalid =
    !draft.email || emailInvalid(draft.email) || draft.permissions.length === 0;

  return (
    <Modal
      okButton={
        <LoadingButton
          disabled={isInvalid}
          onClick={() => {
            onSave().then(onClose, err => {
              if (!err || !err.message) {
                err = { message: t('messages.unknown-error') };
              }
              setErrorMessage(err.message);
            });
          }}
          startIcon={<CheckIcon />}
          variant="contained"
          isLoading={isLoading}
        >
          {t('button.ok')}
        </LoadingButton>
      }
      cancelButton={<DialogButton variant="cancel" onClick={onClose} />}
      title={t('label.invite-user', { ns: 'system' })}
    >
      {isLoading ? (
        <> </>
      ) : (
        <Grid flexDirection="column" display="flex" gap={2}>
          <BasicTextInput
            autoFocus
            required
            value={draft.email || ''}
            error={emailInvalid(draft.email)}
            helperText={
              draft.email !== '' && emailInvalid(draft.email)
                ? t('error.email-invalid')
                : ''
            }
            onChange={e => {
              const email = e.target.value.trimStart().trimEnd();
              if (!userNameEdited) {
                onUpdate({ username: email, email: email });
              } else {
                onUpdate({ email: email });
              }
            }}
            label={t('label.email')}
            InputLabelProps={{ shrink: true }}
          />
          <BasicTextInput
            fullWidth
            required
            label={t('heading.username')}
            value={draft.username}
            error={!isValidUsername(draft.username)}
            helperText={validateUsernameHelperText(draft.username, t)}
            onChange={e => {
              {
                setUserNameEdited(true);
                onUpdate({ username: e.target.value.trimStart().trimEnd() });
              }
            }}
            InputLabelProps={{ shrink: true }}
          />
          <BasicTextInput
            fullWidth
            required
            label={t('label.display-name')}
            value={draft.displayName}
            error={!isValidUsername(draft.displayName)}
            onChange={e => {
              {
                onUpdate({ displayName: e.target.value.trimStart().trimEnd() });
              }
            }}
            InputLabelProps={{ shrink: true }}
          />
          <Grid item>
            <Select
              label={t('label.role')}
              required
              value={permissionArrayToValue(draft.permissions)}
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
          {errorMessage ? (
            <Grid item>
              <Alert
                severity="error"
                onClose={() => {
                  setErrorMessage('');
                }}
              >
                <AlertTitle>Error</AlertTitle>
                {errorMessage}
              </Alert>
            </Grid>
          ) : null}
        </Grid>
      )}
    </Modal>
  );
};
