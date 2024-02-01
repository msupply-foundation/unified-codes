import React, { useEffect } from 'react';
import { useBreadcrumbs } from '@common/hooks';
import { useParams } from 'react-router';
import { BarcodeList } from './BarcodeList';
import { useEntityWithBarcodes } from './api';
import { AppBarContentPortal, Typography } from '@common/components';
import { useTranslation } from '@common/intl';
import { getBarcodes, getPackSizeCodes } from './helpers';

export const BarcodeListForEntityView = () => {
  const t = useTranslation('system');
  const { code } = useParams();
  const { setSuffix } = useBreadcrumbs();

  const {
    data: entity,
    isError,
    isLoading,
  } = useEntityWithBarcodes(code ?? '');

  useEffect(() => {
    setSuffix(t('label.details'));
  }, []);

  if (!entity) return null;

  const barcodes = getBarcodes(entity);
  const entityCodes = getPackSizeCodes(entity);

  return (
    <>
      <AppBarContentPortal width="100%">
        <Typography fontStyle="italic" marginLeft="10px" maxWidth="70%">
          {entity.description}
        </Typography>
      </AppBarContentPortal>
      <BarcodeList
        barcodes={barcodes}
        isError={isError}
        isLoading={isLoading}
        entityCodes={entityCodes}
      />
    </>
  );
};
