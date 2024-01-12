import React from 'react';
import { LocaleKey, useTranslation } from '@common/intl';
import { useNotification } from '@common/hooks';
import { Box, Typography } from '@mui/material';
import { TreeItem } from '@mui/lab';
import { config } from '../../config';
import { UpsertEntityInput } from '@common/types';

export const PendingChangeTreeItem = ({
  node,
  isRoot = false,
}: {
  node?: UpsertEntityInput | null;
  isRoot?: boolean;
}) => {
  const t = useTranslation('system');
  const { success } = useNotification();

  if (!node) return null;

  const isLeaf = !node.children?.length && !node.properties?.length;

  // use default chevron icons, unless we're looking at a leaf node
  const customIcons = isLeaf ? { expandIcon: <></>, collapseIcon: <></> } : {};

  return (
    <TreeItem
      {...customIcons}
      sx={{
        paddingY: '3px',
        borderLeft: !isRoot ? '1px solid black' : undefined,
      }}
      nodeId={node.code ?? node.description ?? ''}
      label={
        <Box>
          {/* show node type above name */}
          {!isRoot && (
            <Typography
              sx={{
                color: '#898989',
                fontSize: '10px',
              }}
            >
              {t(`entity-type.${node.type}` as LocaleKey)}
            </Typography>
          )}
          {node.name}{' '}
        </Box>
      }
    >
      {node.children?.map(c => (
        <PendingChangeTreeItem node={c} key={c.code || c.description} />
      ))}
      {!!node.properties?.length && (
        <TreeItem
          nodeId={node.code + '_properties'}
          label={t('label.properties')}
          sx={{ borderLeft: isRoot ? '1px solid black' : undefined }}
        >
          {node.properties.map(p => {
            const propertyConfig = config.properties.find(
              conf => conf.type === p.key
            );
            return (
              <TreeItem
                key={p.value}
                nodeId={node.code + p.key}
                label={
                  <Typography>
                    {propertyConfig?.label}: {p.value}
                  </Typography>
                }
              />
            );
          })}
        </TreeItem>
      )}
    </TreeItem>
  );
};
