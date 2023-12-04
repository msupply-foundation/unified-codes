import { useCallback } from 'react';
import { useToggle } from '../useToggle';

interface InviteModalState<T> {
  onOpenInvite: (entity?: T | null) => void;
  onCloseInvite: () => void;
  isOpenInvite: boolean;
}

export const useInviteModal = <T>(): InviteModalState<T> => {
  const modalControl = useToggle(false);

  const onOpenInvite = useCallback(() => {
    modalControl.toggleOn();
  }, []);

  const onCloseInvite = useCallback(() => {
    modalControl.toggleOff();
  }, []);

  return {
    onOpenInvite,
    onCloseInvite,
    isOpenInvite: modalControl.isOn,
  };
};
