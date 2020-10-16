import * as React from 'react';

export const useToggle = (
  initialState: boolean = false
): {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onToggle: () => void;
  [Symbol.iterator]: () => Generator<boolean | (() => void), void, unknown>;
} => {
  const [isOpen, setIsOpen] = React.useState<boolean>(initialState);

  const onClose = () => setIsOpen(false);
  const onOpen = () => setIsOpen(true);
  const onToggle = () => setIsOpen((isOpen) => !isOpen);

  return {
    isOpen,
    onOpen,
    onClose,
    onToggle,
    [Symbol.iterator]: function* () {
      yield isOpen;
      yield onToggle;
      yield onOpen;
      yield onClose;
    },
  };
};

export default useToggle;
