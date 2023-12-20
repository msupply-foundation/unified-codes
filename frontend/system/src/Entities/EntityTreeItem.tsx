import React from 'react';
import { LocaleKey, useTranslation } from '@common/intl';
import { CopyIcon, FlatButton } from '@common/ui';
import { useNotification } from '@common/hooks';
import { Link, Typography } from '@mui/material';
import { TreeItem } from '@mui/lab';
import { EntityDetailsFragment } from './api/operations.generated';

export type EntityData = EntityDetailsFragment & {
  children?: EntityData[] | null;
};

const PROPERTY_URL: { [key: string]: (code: string) => string } = {
  ['code_rxnav']: code =>
    `https://mor.nlm.nih.gov/RxNav/search?searchBy=RXCUI&searchTerm=${code}`,
  ['code_nzulm']: code =>
    `https://search.nzulm.org.nz/search/product?table=MP&id=${code}`,
};

export const EntityTreeItem = ({
  entity,
  showAllCodes,
  isRoot = false,
}: {
  entity?: EntityData | null;
  showAllCodes: boolean;
  isRoot?: boolean;
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

  // use default chevron icons, unless we're looking at a leaf node
  const customIcons = isLeaf ? { expandIcon: <></>, collapseIcon: <></> } : {};

  return (
    <TreeItem
      {...customIcons}
      sx={{
        paddingY: '3px',
        borderLeft: !isRoot ? '1px solid black' : undefined,
      }}
      nodeId={entity.code}
      label={
        <Typography>
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
      {!!entity.properties.length && (
        <TreeItem
          nodeId={entity.code + '_properties'}
          label={t('label.properties')}
          sx={{ borderLeft: isRoot ? '1px solid black' : undefined }}
        >
          {entity.properties.map(p => (
            <TreeItem
              key={p.value}
              nodeId={entity.code + p.type}
              label={
                <Typography>
                  {t(`property-${p.type}` as LocaleKey)}:{' '}
                  {PROPERTY_URL[p.type] ? (
                    <Link href={PROPERTY_URL[p.type]!(p.value)} target="_blank">
                      {p.value}
                    </Link>
                  ) : (
                    p.value
                  )}
                </Typography>
              }
            />
          ))}
        </TreeItem>
      )}
    </TreeItem>
  );
};
