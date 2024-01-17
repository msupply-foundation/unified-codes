import React from 'react';
import { LocaleKey, useTranslation } from '@common/intl';
import { CopyIcon, FlatButton } from '@common/ui';
import { useNotification } from '@common/hooks';
import { Box, Link, Typography } from '@mui/material';
import { TreeItem } from '@mui/lab';
import { EntityDetailsFragment } from './api/operations.generated';
import { config } from '../config';

export type EntityData = EntityDetailsFragment & {
  children?: EntityData[] | null;
};

export const EntityTreeItem = ({
  entity,
  showAllCodes,
  isRoot = false,
  highlightCode,
}: {
  entity?: EntityData | null;
  showAllCodes: boolean;
  isRoot?: boolean;
  highlightCode?: string;
}) => {
  const t = useTranslation('system');
  const { success } = useNotification();

  if (!entity) return null;

  const handleCopyToClipboard =
    (code: string) => (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      // prevent tree nodes opening/collapsing
      e.stopPropagation();

      navigator.clipboard.writeText(code);

      success(t('message.code-copied-to-clipboard', { code }))();
    };

  const isLeaf = !entity.children?.length;
  const showCode = showAllCodes || isLeaf || highlightCode === entity.code;

  // use default chevron icons, unless we're looking at a leaf node with no properties
  const customIcons =
    isLeaf && !entity.properties?.length
      ? { expandIcon: <></>, collapseIcon: <></> }
      : {};

  return (
    <TreeItem
      {...customIcons}
      sx={{
        paddingY: '3px',
        borderLeft: !isRoot ? '1px solid black' : undefined,
      }}
      nodeId={entity.code}
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
              {t(`entity-type.${entity.type}` as LocaleKey)}
            </Typography>
          )}
          <Typography
            id={entity.code}
            variant={highlightCode === entity.code ? 'h6' : 'body1'}
          >
            {entity.name}{' '}
            {showCode && (
              <>
                -
                <FlatButton
                  endIcon={<CopyIcon />}
                  sx={{ padding: 0 }}
                  label={entity.code}
                  onClick={handleCopyToClipboard(entity.code)}
                />
              </>
            )}
          </Typography>
        </Box>
      }
    >
      {entity.children?.map(c => (
        <EntityTreeItem
          entity={c}
          key={c.code}
          showAllCodes={showAllCodes}
          highlightCode={highlightCode}
        />
      ))}
      {!!entity.properties.length && (
        <TreeItem
          nodeId={entity.code + '_properties'}
          label={t('label.properties')}
          sx={{ borderLeft: isRoot ? '1px solid black' : undefined }}
        >
          {entity.properties.map(p => {
            const propertyConfig = config.properties.find(
              conf => conf.type === p.type
            );
            const url = propertyConfig?.url.replace(/{{code}}/g, p.value);
            return (
              <TreeItem
                key={p.value}
                nodeId={entity.code + p.type}
                label={
                  <Typography>
                    {propertyConfig?.label}:{' '}
                    {url ? (
                      <Link href={url} target="_blank">
                        {p.value}
                      </Link>
                    ) : (
                      p.value
                    )}
                    <FlatButton
                      startIcon={<CopyIcon />}
                      sx={{ padding: 0, minWidth: '40px' }}
                      onClick={handleCopyToClipboard(p.value)}
                      label=""
                    />
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
