import React, { useEffect } from 'react';
import { useBreadcrumbs } from '@common/hooks';
import { useParams } from 'react-router';
import { GS1List } from './GS1List';
import { useEntityWithGS1s } from './api';
import { AppBarContentPortal, Typography } from '@common/components';
import { useTranslation } from '@common/intl';
import { getGS1Barcodes, getPackSizeCodes } from './helpers';

export const GS1ListForEntityView = () => {
  const t = useTranslation('system');
  const { code } = useParams();
  const { setSuffix } = useBreadcrumbs();

  const { data: entity, isError, isLoading } = useEntityWithGS1s(code ?? '');

  useEffect(() => {
    setSuffix(t('label.details'));
  }, []);

  if (!entity) return null;

  const gs1Barcodes = getGS1Barcodes(entity);
  const entityCodes = getPackSizeCodes(entity);

  return (
    <>
      <AppBarContentPortal width="100%">
        <Typography fontStyle="italic" marginLeft="10px" maxWidth="70%">
          {entity.description}
        </Typography>
      </AppBarContentPortal>
      <GS1List
        gs1Barcodes={gs1Barcodes}
        isError={isError}
        isLoading={isLoading}
        entityCodes={entityCodes}
      />
    </>
  );
};
