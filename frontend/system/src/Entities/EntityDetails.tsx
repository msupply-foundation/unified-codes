import React, { useEffect, useState } from 'react';
import { useTranslation } from '@common/intl';
import {
  AppBarContentPortal,
  ChevronDownIcon,
  CopyIcon,
  FlatButton,
  Switch,
} from '@common/ui';
import { useBreadcrumbs, useNotification } from '@common/hooks';
import { useEntity } from '../api';
import { FormControlLabel, Typography } from '@mui/material';
import { TreeItem, TreeView } from '@mui/lab';
import { useParams } from 'react-router-dom';
import { EntityDetailsFragment } from '../api/operations.generated';

type IEntity = EntityDetailsFragment & { children?: IEntity[] | null };

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

    const addCodeToList = (ent?: IEntity | null) => {
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

const EntityTreeItem = ({
  entity,
  showAllCodes,
}: {
  showAllCodes: boolean;
  entity?: IEntity | null;
}) => {
  const t = useTranslation('system');
  const { success } = useNotification();

  if (!entity) return null;

  const handleCopyToClipboard = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    // prevent tree nodes opening/collapsing
    e.stopPropagation();

    navigator.clipboard.writeText(entity.code);

    success(t('message.code-copied-to-clipboard', { code: entity.code }))();
  };

  const isLeaf = !entity.children?.length;
  const showCode = showAllCodes || isLeaf;

  return (
    <TreeItem
      sx={{ paddingY: '5px' }}
      nodeId={entity.code}
      label={
        <Typography sx={{ height: '26px' }}>
          {entity.name}{' '}
          {showCode && (
            <>
              -
              <FlatButton
                endIcon={<CopyIcon />}
                sx={{ padding: 0 }}
                label={entity.code}
                onClick={handleCopyToClipboard}
              />
            </>
          )}
        </Typography>
      }
    >
      {entity.children?.map(c => (
        <EntityTreeItem entity={c} key={c.code} showAllCodes={showAllCodes} />
      ))}
      {entity.properties && (
        <TreeItem
          nodeId={entity.code + '_properties'}
          label={t('label.properties')}
        >
          {entity.properties.map(p => (
            <TreeItem
              key={p.value}
              nodeId={entity.code + p.type}
              label={`${p.type}: ${p.value}`}
            />
          ))}
        </TreeItem>
      )}
    </TreeItem>
  );
};
