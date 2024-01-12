import { useBreadcrumbs } from '@common/hooks';
import { CheckIcon, ChevronDownIcon, CloseIcon } from '@common/icons';
import { useTranslation } from '@common/intl';
import { UpsertEntityInput } from '@common/types';
import { Box, LoadingButton } from '@common/ui';
import { TreeView } from '@mui/lab';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { usePendingChange } from '../api/hooks/usePendingChange';
import { PendingChangeTreeItem } from './TreeItem';

export const PendingChangeDetails = () => {
  const { id } = useParams();
  const { setSuffix } = useBreadcrumbs();
  const t = useTranslation('system');

  const [expanded, setExpanded] = useState<string[]>([]);
  const [entity, setEntity] = useState<UpsertEntityInput | null>(null);

  const { data: pendingChange } = usePendingChange(id ?? '');

  useEffect(() => {
    if (pendingChange?.name) setSuffix(pendingChange.name);
  }, [pendingChange?.name]);

  useEffect(() => {
    if (!entity && pendingChange) setEntity(JSON.parse(pendingChange.body));
  }, [pendingChange]);

  useEffect(() => {
    if (pendingChange) {
      const expandedIds: string[] = [];

      const addToExpandedIds = (ent?: UpsertEntityInput | null) => {
        if (ent) {
          const nodeId = ent.code || ent.description || '?';
          expandedIds.push(nodeId);
          ent.children?.forEach(addToExpandedIds);

          ent?.properties && expandedIds.push(`${nodeId}_properties`);
        }
      };
      addToExpandedIds(entity);

      setExpanded(expandedIds);
    }
  }, [entity]);

  // TODO: what do display if no data
  return (
    <Box sx={{ width: '100%' }}>
      <TreeView
        disableSelection
        expanded={expanded}
        defaultExpandIcon={<ChevronDownIcon sx={{ rotate: '-90deg' }} />}
        defaultCollapseIcon={<ChevronDownIcon />}
        sx={{ overflow: 'auto', width: '100%', marginY: '16px' }}
      >
        <PendingChangeTreeItem
          refreshEntity={() => setEntity({ ...entity })}
          node={entity}
          isRoot
        />
      </TreeView>
      <Box sx={{ float: 'right' }}>
        <LoadingButton
          startIcon={<CloseIcon />}
          onClick={() => console.log('TODO')}
          isLoading={false}
          variant="outlined"
          sx={{ border: '2px solid #e95c30', marginX: '3px' }}
        >
          {t('label.reject')}
        </LoadingButton>
        <LoadingButton
          startIcon={<CheckIcon />}
          onClick={() => console.log('TODO')}
          isLoading={false}
          sx={{ border: '2px solid #e95c30', marginX: '3px' }}
        >
          {t('label.approve-next')}
        </LoadingButton>
      </Box>
    </Box>
  );
};
