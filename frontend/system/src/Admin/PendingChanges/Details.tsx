import { useBreadcrumbs } from '@common/hooks';
import { ChevronDownIcon } from '@common/icons';
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
    const expandedIds: string[] = [];

    // const addToExpandedIds = (ent?: EntityData | null) => {
    // // Contains change?
    //   if (ent) {
    //     expandedIds.push(ent.code);
    //     ent.children?.forEach(addToExpandedIds);
    //   }
    // };
    // addToExpandedIds(entity);

    // // NOT ANYMORE??
    // // entity?.properties && expandedIds.push(`${entity.code}_properties`);

    setExpanded(expandedIds);
  }, [pendingChange]);

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
