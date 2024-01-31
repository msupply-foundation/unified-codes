import React, { useMemo } from 'react';
import { useTranslation } from '@common/intl';
import { EntityType } from '../constants';
import { RouteBuilder } from '@common/utils';
import { AppRoute } from 'frontend/config/src';
import { EntityData } from './EntityData';
import { Link } from 'frontend/common/src';

const SHOW_BARCODE_LINK_TYPES = [
  EntityType.Unit,
  EntityType.ImmediatePackaging,
  EntityType.PackSize,
];

export const BarcodeLink = ({ entity }: { entity: EntityData }) => {
  const t = useTranslation('system');

  if (!SHOW_BARCODE_LINK_TYPES.includes(entity.type as EntityType))
    return <></>;

  const barcodeCount = useMemo(() => getBarcodeCount(entity), [entity]);

  return (
    <>
      {!!barcodeCount && (
        <Link
          style={{ color: '#e95c30' }}
          to={RouteBuilder.create(AppRoute.Admin)
            .addPart(AppRoute.Barcodes)
            .addPart(entity.code)
            .build()}
        >
          {t('label.related-barcodes', { count: barcodeCount })}
        </Link>
      )}
    </>
  );
};

const getBarcodeCount = (entity: EntityData) => {
  let count = 0;

  count += entity.barcodes.length;

  const countChildBarcodes = (e: EntityData) => {
    e.children?.forEach(c => {
      count += c.barcodes.length;
      countChildBarcodes(c);
    });
  };
  countChildBarcodes(entity);

  return count;
};
