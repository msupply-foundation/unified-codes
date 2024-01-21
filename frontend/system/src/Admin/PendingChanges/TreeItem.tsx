import React from 'react';
import { LocaleKey, useTranslation } from '@common/intl';
import { Box, Typography } from '@mui/material';
import { TreeItem } from '@mui/lab';
import { config } from '../../config';
import { PropertyInput, UpsertEntityInput } from '@common/types';

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

  const grey = '#898989';
  const green = '#008b08';

  return (
    <TreeItem
      {...customIcons}
      sx={{
        paddingY: '3px',
        borderLeft: !isRoot ? '1px solid black' : undefined,
      }}
      nodeId={nodeId}
      label={
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box>
            {/* show node type above name */}
            {!isRoot && (
              <Typography
                sx={{
                  color: isNew ? green : grey,
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
                      color: green,
                      fontWeight: 'bold',
                    }
                  : { color: grey }
              }
            >
              {node.name}
            </Typography>
          </Box>
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
            <Typography sx={{ color: grey }}>
              {t('label.properties')}
            </Typography>
          }
          sx={{
            borderLeft: isRoot ? '1px solid black' : undefined,
          }}
        >
          {node.properties.map(p => (
            <PropertyTreeItem
              key={p.value}
              nodeId={node.code + p.key}
              property={p}
            />
          ))}
        </TreeItem>
      )}
    </TreeItem>
  );
};

const PropertyTreeItem = ({
  property,
  nodeId,
}: {
  property: PropertyInput;
  nodeId: string;
}) => {
  const isNewProperty = !property.code;

  const propertyConfig = config.properties.find(
    conf => conf.type === property.key
  );

  return (
    <TreeItem
      key={property.value}
      nodeId={nodeId}
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
          {propertyConfig?.label}: {property.value}
        </Typography>
      }
    />
  );
};
