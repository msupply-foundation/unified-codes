import { PendingChangeSummaryFragment } from '../operations.generated';
import { usePendingChanges } from './usePendingChanges';

export const useNextPendingChange = (
  currentPendingChangeId: string
): PendingChangeSummaryFragment | null => {
  // get all
  const { data } = usePendingChanges({ first: 1000, offset: 0 });

  if (!data || !data.nodes.length) return null;

  const idx = data?.nodes.findIndex(n => n.id === currentPendingChangeId);

  const next = data?.nodes[(idx + 1) % data?.nodes.length];

  if (next?.id === currentPendingChangeId) return null;

  return next ?? null;
};
