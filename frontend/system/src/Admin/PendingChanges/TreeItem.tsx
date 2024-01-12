import React from 'react';
import { LocaleKey, useTranslation } from '@common/intl';
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

  if (!node) return null;

  const isLeaf = !node.children?.length && !node.properties?.length;

  // use default chevron icons, unless we're looking at a leaf node
  const customIcons = isLeaf ? { expandIcon: <></>, collapseIcon: <></> } : {};

  const nodeId = node.code || node.description || '?';
  const isNew = !node.code;

  return (
    <TreeItem
      {...customIcons}
      sx={{
        paddingY: '3px',
        borderLeft: !isRoot ? '1px solid black' : undefined,
      }}
      nodeId={nodeId}
      label={
        <Box>
          {/* show node type above name */}
          {!isRoot && (
            <Typography
              sx={{
                color: isNew ? '#008b08' : '898989',
                fontSize: '10px',
              }}
            >
              {t(`entity-type.${node.type}` as LocaleKey)}
            </Typography>
          )}
          <Typography
            sx={
              isNew
                ? {
                    color: '#008b08',
                    fontWeight: 'bold',
                  }
                : { color: '#898989' }
            }
          >
            {node.name}
          </Typography>
        </Box>
      }
    >
      {node.children?.map(c => (
        <PendingChangeTreeItem node={c} key={c.code || c.description} />
      ))}
      {!!node.properties?.length && (
        <TreeItem
          nodeId={nodeId + '_properties'}
          label={
            <Typography sx={{ color: '898989' }}>
              {t('label.properties')}
            </Typography>
          }
          sx={{
            borderLeft: isRoot ? '1px solid black' : undefined,
          }}
        >
          {node.properties.map(p => {
            const isNewProperty = !p.code.endsWith(p.key);

            const propertyConfig = config.properties.find(
              conf => conf.type === p.key
            );

            return (
              <TreeItem
                key={p.value}
                nodeId={node.code + p.key}
                label={
                  <Typography
                    sx={
                      isNewProperty
                        ? {
                            color: '#008b08',
                            fontWeight: 'bold',
                          }
                        : { color: '#898989' }
                    }
                  >
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
