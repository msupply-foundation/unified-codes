import React, { useEffect, useState } from 'react';
import { useTranslation } from '@common/intl';
import { AppBarContentPortal, ChevronDownIcon, Switch } from '@common/ui';
import { useBreadcrumbs } from '@common/hooks';
import { useEntity } from '../api';
import { FormControlLabel } from '@mui/material';
import { TreeView } from '@mui/lab';
import { useParams } from 'react-router-dom';
import { EntityTreeItem, EntityData } from './EntityTreeItem';

export const EntityDetails = () => {
  const t = useTranslation('system');
  const { code } = useParams();
  const { setSuffix } = useBreadcrumbs();
  const [expanded, setExpanded] = useState<string[]>([]);
  const [showAllCodes, setShowAllCodes] = useState(false);

  const { data: entity } = useEntity(code || '');

  useEffect(() => {
    if (entity?.name) setSuffix(entity.name);
  }, [entity?.name]);

  useEffect(() => {
    const allCodes: string[] = [];

    const addCodeToList = (ent?: EntityData | null) => {
      if (ent) {
        allCodes.push(ent.code);
        ent.children?.forEach(addCodeToList);
      }
    };
    addCodeToList(entity);

    setExpanded(allCodes);
  }, [entity]);

  return (
    <>
      <AppBarContentPortal
        sx={{
          paddingBottom: '16px',
          flex: 1,
          display: 'flex',
          justifyContent: 'end',
          marginRight: 'max(0px, calc((100vw - 1200px) / 2))',
        }}
      >
        <FormControlLabel
          control={
            <Switch
              checked={showAllCodes}
              onChange={() => setShowAllCodes(!showAllCodes)}
            />
          }
          label={`${t('label.show-all-codes')}:`}
          labelPlacement="start"
        />
      </AppBarContentPortal>
      <TreeView
        disableSelection
        expanded={expanded}
        defaultExpandIcon={<ChevronDownIcon sx={{ rotate: '-90deg' }} />}
        defaultCollapseIcon={<ChevronDownIcon />}
        onNodeToggle={(_, codes: string[]) => setExpanded(codes)}
      >
        <EntityTreeItem showAllCodes={showAllCodes} entity={entity} />
      </TreeView>
    </>
  );
};