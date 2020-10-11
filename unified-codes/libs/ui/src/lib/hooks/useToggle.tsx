import * as React from 'react';

export const useToggle = (initialState: boolean = false) => {
  const [isOpen, setIsOpen] = React.useState<boolean>(initialState);

  const onClose = () => setIsOpen(false);
  const onOpen = () => setIsOpen(true);
  const onToggle = () => setIsOpen(isOpen => !isOpen);

  return {
    isOpen,
    onOpen,
    onClose,
    onToggle,
  };
};

export default useToggle;
