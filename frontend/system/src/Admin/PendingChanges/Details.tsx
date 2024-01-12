import { useBreadcrumbs } from '@common/hooks';
import { ChevronDownIcon } from '@common/icons';
import { UpsertEntityInput } from '@common/types';
import { TreeView } from '@mui/lab';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { usePendingChange } from '../api/hooks/usePendingChange';
import { PendingChangeTreeItem } from './TreeItem';

export const PendingChangeDetails = () => {
  const { id } = useParams();
  const { setSuffix } = useBreadcrumbs();

  const [expanded, setExpanded] = useState<string[]>([]);

  const { data: pendingChange } = usePendingChange(id ?? '');

  useEffect(() => {
    if (pendingChange?.name) setSuffix(pendingChange.name);
  }, [pendingChange?.name]);

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
      addToExpandedIds(JSON.parse(pendingChange.body));

      setExpanded(expandedIds);
    }
  }, [pendingChange?.body]);

  // TODO: no data
  return (
    <>
      <TreeView
        disableSelection
        expanded={expanded}
        defaultExpandIcon={<ChevronDownIcon sx={{ rotate: '-90deg' }} />}
        defaultCollapseIcon={<ChevronDownIcon />}
        onNodeToggle={(_, codes: string[]) => setExpanded(codes)}
        sx={{ overflow: 'auto', width: '100%', marginY: '16px' }}
      >
        <PendingChangeTreeItem
          node={pendingChange ? JSON.parse(pendingChange.body) : null}
          isRoot
        />
      </TreeView>
    </>
  );
};
