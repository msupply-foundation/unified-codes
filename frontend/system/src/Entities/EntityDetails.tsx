import React, { useEffect, useState } from 'react';
import { useTranslation } from '@common/intl';
import {
  AppBarContentPortal,
  ButtonWithIcon,
  ChevronDownIcon,
  EditIcon,
  Switch,
  Box,
} from '@common/ui';
import { useBreadcrumbs } from '@common/hooks';
import { useEntity } from './api';
import { FormControlLabel } from '@mui/material';
import { TreeView } from '@mui/lab';
import { useNavigate, useParams } from 'react-router-dom';
import { EntityTreeItem, EntityData } from './EntityTreeItem';
import { RouteBuilder } from '@common/utils';
import { AppRoute } from 'frontend/config/src';
import { useAuthContext } from '@common/authentication';
import { PermissionNode } from '@common/types';

export const EntityDetails = () => {
  const t = useTranslation('system');
  const { code } = useParams();
  const { setSuffix } = useBreadcrumbs();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState<string[]>([]);
  const [showAllCodes, setShowAllCodes] = useState(false);
  const { hasPermission } = useAuthContext();

  const { data: entity } = useEntity(code || '');

  useEffect(() => {
    if (entity?.name) setSuffix(entity.name);
  }, [entity?.name]);

  useEffect(() => {
    const expandedIds: string[] = [];

    const addToExpandedIds = (ent?: EntityData | null) => {
      if (ent) {
        expandedIds.push(ent.code);
        ent.children?.forEach(addToExpandedIds);
      }
    };
    addToExpandedIds(entity);

    entity?.properties && expandedIds.push(`${entity.code}_properties`);

    setExpanded(expandedIds);
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
        sx={{ overflow: 'auto', width: '100%', marginY: '16px' }}
      >
        <EntityTreeItem showAllCodes={showAllCodes} entity={entity} isRoot />
      </TreeView>

      {hasPermission(PermissionNode.ServerAdmin) && (
        <Box>
          <ButtonWithIcon
            sx={{ marginTop: '16px' }}
            variant="contained"
            onClick={() => {
              navigate(
                RouteBuilder.create(AppRoute.Admin)
                  .addPart(AppRoute.Edit)
                  .addPart(entity?.code ?? '')
                  .build()
              );
            }}
            Icon={<EditIcon />}
            label={t('label.update')}
          />
        </Box>
      )}
    </>
  );
};
