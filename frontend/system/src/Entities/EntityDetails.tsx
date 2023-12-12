import React, { useEffect, useState } from 'react';
import { useTranslation } from '@common/intl';
import { AppBarContentPortal, ChevronDownIcon } from '@common/ui';
import { useBreadcrumbs } from '@common/hooks';
import { useEntity } from '../api';
import { Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import { EntityDetailsFragment } from '../api/operations.generated';
import { TreeItem, TreeView } from '@mui/lab';

type IEntity = EntityDetailsFragment & { children?: IEntity[] | null };

export const EntityDetails = () => {
  const t = useTranslation('system');
  const { code } = useParams();
  const { setSuffix } = useBreadcrumbs();
  const [expanded, setExpanded] = useState<string[]>([]);

  const { data: entity } = useEntity(code || '');

  useEffect(() => {
    if (entity?.name) setSuffix(entity.name);
  }, [entity?.name]);

  useEffect(() => {
    const codes: string[] = [];

    const addCodeToCodes = (ent?: IEntity | null) => {
      if (ent) {
        codes.push(ent.code);
        ent.children?.forEach(addCodeToCodes);
      }
    };
    addCodeToCodes(entity);

    setExpanded(codes);
  }, [entity]);

  return (
    <>
      <AppBarContentPortal
        sx={{
          paddingBottom: '16px',
          flex: 1,
          display: 'flex',
          justifyContent: 'space-between',
        }}
      ></AppBarContentPortal>
      <TreeView
        disableSelection
        expanded={expanded}
        defaultExpandIcon={<ChevronDownIcon sx={{ rotate: '-90deg' }} />}
        defaultCollapseIcon={<ChevronDownIcon />}
        onNodeToggle={(_, codes: string[]) => setExpanded(codes)}
      >
        <EntityTreeItem entity={entity} />
      </TreeView>
    </>
  );
};

const EntityTreeItem = ({ entity }: { entity?: IEntity | null }) => {
  if (!entity) return null;
  return (
    <TreeItem
      sx={{ paddingY: '5px' }}
      nodeId={entity.code}
      label={
        <Typography>
          {entity.name}
          {' - '}
          <span style={{ color: '#e95c30', fontWeight: 'bold' }}>
            {entity.code}
          </span>
        </Typography>
      }
    >
      {entity.children?.map(c => (
        <EntityTreeItem entity={c} key={c.code} />
      ))}
      {entity.properties && (
        <TreeItem nodeId={entity.code + '_properties'} label="Properties">
          {entity.properties.map(p => (
            <TreeItem
              key={p.value}
              nodeId={entity.code + p.value}
              label={`${p.type}: ${p.value}`}
            />
          ))}
        </TreeItem>
      )}
    </TreeItem>
  );
};
