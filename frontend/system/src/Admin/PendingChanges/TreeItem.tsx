import React, { PropsWithChildren, ReactNode, useState } from 'react';
import { LocaleKey, useTranslation } from '@common/intl';
import { Box, Typography } from '@mui/material';
import { TreeItem } from '@mui/lab';
import { config } from '../../config';
import { PropertyInput, UpsertEntityInput } from '@common/types';
import { IconButton, LoadingButton } from '@common/components';
import { CheckIcon, CloseIcon, EditIcon } from '@common/icons';

export const PendingChangeTreeItem = ({
  node,
  refreshEntity,
  isRoot = false,
  list,
}: {
  node?: UpsertEntityInput | null;
  refreshEntity: () => void;
  isRoot?: boolean;
  list?: UpsertEntityInput[] | null;
}) => {
  const t = useTranslation('system');

  const [viewed, setViewed] = useState(false);

  if (!node) return null;

  const onDelete = () => {
    if (list) {
      const indexToDelete = list.findIndex(
        item => item.description === node.description
      );
      if (indexToDelete >= 0) {
        list.splice(indexToDelete, 1);
      }
      refreshEntity();
    }
  };

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
          {!isRoot &&
            isNew &&
            (!viewed ? (
              <Box>
                <ReviewButton icon={<CloseIcon />} onClick={onDelete}>
                  {t('label.reject')}
                </ReviewButton>

                <ReviewButton
                  icon={<EditIcon />}
                  onClick={() => console.log('TODO')}
                >
                  {t('label.edit')}
                </ReviewButton>

                <ReviewButton
                  icon={<CheckIcon />}
                  onClick={() => setViewed(true)}
                >
                  {t('label.viewed')}
                </ReviewButton>
              </Box>
            ) : (
              <IconButton
                icon={<EditIcon />}
                label={t('label.edit')}
                onClick={e => {
                  // prevent tree nodes opening/collapsing
                  e.stopPropagation();

                  setViewed(false);
                }}
              />
            ))}
        </Box>
      }
    >
      {node.children?.map(c => (
        <PendingChangeTreeItem
          node={c}
          key={c.code || c.description}
          refreshEntity={refreshEntity}
          list={node.children}
        />
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
  const t = useTranslation('system');

  const [propertyIsViewed, setPropertyIsViewed] = useState(false);

  const isNewProperty = !property.code.endsWith(property.key);

  const propertyConfig = config.properties.find(
    conf => conf.type === property.key
  );

  return (
    <TreeItem
      key={property.value}
      nodeId={nodeId}
      label={
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
          }}
        >
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
          {isNewProperty &&
            (!propertyIsViewed ? (
              <Box>
                <ReviewButton
                  icon={<CloseIcon />}
                  onClick={() => console.log('TODO')}
                >
                  {t('label.reject')}
                </ReviewButton>
                <ReviewButton
                  icon={<EditIcon />}
                  onClick={() => console.log('TODO')}
                >
                  {t('label.edit')}
                </ReviewButton>
                <ReviewButton
                  icon={<CheckIcon />}
                  onClick={() => setPropertyIsViewed(true)}
                >
                  {t('label.viewed')}
                </ReviewButton>
              </Box>
            ) : (
              <IconButton
                icon={<EditIcon />}
                label={t('label.edit')}
                onClick={e => {
                  // prevent tree nodes opening/collapsing
                  e.stopPropagation();

                  setPropertyIsViewed(false);
                }}
              />
            ))}
        </Box>
      }
    />
  );
};

const ReviewButton = ({
  children,
  icon,
  onClick,
}: PropsWithChildren & { onClick: () => void; icon: ReactNode }) => {
  return (
    <LoadingButton
      startIcon={icon}
      onClick={e => {
        // prevent tree nodes opening/collapsing
        e.stopPropagation();

        onClick();
      }}
      isLoading={false}
      variant="outlined"
      sx={{ border: '2px solid #e95c30', marginX: '3px' }}
    >
      {children}
    </LoadingButton>
  );
};
