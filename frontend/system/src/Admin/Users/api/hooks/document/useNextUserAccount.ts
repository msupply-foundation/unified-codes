import { UserAccountRowFragment } from '../../operations.generated';
import { useUserAccounts } from './useUserAccount';

export const useNextUserAccount = (
  currentUserAccount: UserAccountRowFragment | null
): UserAccountRowFragment | null => {
  const { data } = useUserAccounts();
  const idx = data?.nodes.findIndex(l => l.id === currentUserAccount?.id);
  if (idx == undefined) return null;
  const next = data?.nodes[(idx + 1) % data?.nodes.length];

  return next ?? null;
};
