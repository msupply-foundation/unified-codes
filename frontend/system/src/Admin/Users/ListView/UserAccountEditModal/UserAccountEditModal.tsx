import React, { FC, useState } from 'react';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import {
  ModalMode,
  useDialog,
  Grid,
  DialogButton,
  useTranslation,
  FnUtils,
  LoadingButton,
  CheckIcon,
  InlineSpinner,
  isValidUsername,
  User,
} from '@uc-frontend/common';
import { UserAccountRowFragment, useUserAccount } from '../../api';
import { userAccountParsers } from '../../api/api';
import { UserAccountEditForm } from './UserAccountEditForm';

interface UserAccountEditModalProps {
  mode: ModalMode | null;
  isOpen: boolean;
  onClose: () => void;
  userAccount: UserAccountRowFragment | null | User;
}

const createUserAccountRowFragment = (
  seed?: UserAccountRowFragment | User | null
): UserAccountRowFragment => ({
  __typename: 'UserAccountNode',
  id: FnUtils.generateUUID(),
  username: '',
  displayName: '',
  permissions: [],
  ...seed,
});

interface UseDraftUserAccountControl {
  draft: UserAccountRowFragment;
  password?: string;
  setPassword: (password: string) => void;
  onUpdate: (patch: Partial<UserAccountRowFragment>) => void;
  onChangeUserAccount: () => void;
  onSave: () => Promise<void>;
  isLoading: boolean;
}

export const useDraftUserAccount = (
  seed: UserAccountRowFragment | User | null,
  mode: ModalMode | null
): UseDraftUserAccountControl => {
  const [userAccount, setUserAccount] = useState<UserAccountRowFragment>(() =>
    createUserAccountRowFragment(seed)
  );
  const [password, setPassword] = useState('');
  const nextUserAccount = useUserAccount.document.next(userAccount);
  const { mutateAsync: insert, isLoading: insertIsLoading } =
    useUserAccount.document.insert();
  const { mutateAsync: update, isLoading: updateIsLoading } =
    useUserAccount.document.update();

  const onUpdate = (patch: Partial<UserAccountRowFragment>) => {
    setUserAccount({ ...userAccount, ...patch });
  };

  const onSave = async () => {
    if (mode === ModalMode.Create) {
      await insert(userAccountParsers.toCreate(userAccount, password));
    } else {
      await update(userAccountParsers.toUpdate(userAccount, password));
    }
  };

  const onChangeUserAccount = () => {
    if (mode === ModalMode.Create) {
      setUserAccount(createUserAccountRowFragment());
    } else {
      setUserAccount(createUserAccountRowFragment(nextUserAccount));
    }
  };

  return {
    draft: userAccount,
    password,
    setPassword,
    onUpdate,
    onChangeUserAccount,
    onSave,
    isLoading: updateIsLoading || insertIsLoading,
  };
};

export const UserAccountEditModal: FC<UserAccountEditModalProps> = ({
  mode,
  isOpen,
  onClose,
  userAccount,
}) => {
  const [errorMessage, setErrorMessage] = useState('');
  const { Modal } = useDialog({ isOpen, onClose });
  const t = useTranslation(['system']);
  const { draft, password, setPassword, onUpdate, onSave, isLoading } =
    useDraftUserAccount(userAccount, mode);

  const isInvalid =
    (!isValidUsername(draft.username) ||
      (mode === ModalMode.Create && !password) ||
      draft.permissions.length === 0) ??
    true;

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
          isLoading={isLoading}
          startIcon={<CheckIcon />}
          variant="contained"
        >
          {t('button.ok')}
        </LoadingButton>
      }
      cancelButton={<DialogButton variant="cancel" onClick={onClose} />}
      title={
        mode === ModalMode.Create
          ? t('label.create-user', { ns: 'system' })
          : t('label.edit-user', { ns: 'system' })
      }
    >
      {isLoading ? (
        <InlineSpinner />
      ) : (
        <Grid flexDirection="column" display="flex" gap={2}>
          <UserAccountEditForm
            userAccount={draft}
            password={password ?? ''}
            setPassword={setPassword}
            onUpdate={onUpdate}
          />
          {errorMessage ? (
            <Grid item>
              <Alert
                severity="error"
                onClose={() => {
                  setErrorMessage('');
                }}
              >
                <AlertTitle>{t('error')}</AlertTitle>
                {errorMessage}
              </Alert>
            </Grid>
          ) : null}
        </Grid>
      )}
    </Modal>
  );
};
