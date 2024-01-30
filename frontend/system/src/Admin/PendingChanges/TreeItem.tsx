import React from 'react';
import { LocaleKey, useTranslation } from '@common/intl';
import { Box, Typography } from '@mui/material';
import { TreeItem } from '@mui/lab';
import { usePropertyConfigurationItems } from '../Configuration/api/hooks/usePropertyConfigurationItems';
import {
  AlternativeNameInput,
  PropertyInput,
  UpsertEntityInput,
} from '@common/types';

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
      {!!node.alternativeNames?.length && (
        <TreeItem
          nodeId={nodeId + '_altNames'}
          label={
            <Typography sx={{ color: grey }}>{t('label.alt-names')}</Typography>
          }
          sx={{
            borderLeft: isRoot ? '1px solid black' : undefined,
          }}
        >
          {node.alternativeNames.map(n => (
            <AltNameTreeItem
              key={n.name}
              nodeId={node.code + n.name}
              altName={n}
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

  const { data: config } = usePropertyConfigurationItems();

  const propertyConfig = config?.find(conf => conf.type === property.key);

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

const AltNameTreeItem = ({
  altName,
  nodeId,
}: {
  nodeId: string;
  altName: AlternativeNameInput;
}) => {
  const isNewName = !altName.code;

  return (
    <TreeItem
      nodeId={nodeId}
      label={
        <Typography
          sx={
            isNewName
              ? {
                  color: '#008b08',
                  fontWeight: 'bold',
                }
              : { color: '#898989' }
          }
        >
          {altName.name}
        </Typography>
      }
    />
  );
};
