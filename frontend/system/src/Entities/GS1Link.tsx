import React, { useMemo } from 'react';
import { useTranslation } from '@common/intl';
import { EntityType } from '../constants';
import { RouteBuilder } from '@common/utils';
import { AppRoute } from 'frontend/config/src';
import { EntityData } from './EntityData';
import { Link } from 'frontend/common/src';

const SHOW_GS1_LINK_TYPES = [
  EntityType.Unit,
  EntityType.ImmediatePackaging,
  EntityType.PackSize,
];

export const GS1Link = ({ entity }: { entity: EntityData }) => {
  const t = useTranslation('system');

  if (!SHOW_GS1_LINK_TYPES.includes(entity.type as EntityType)) return <></>;

  const barcodeCount = useMemo(() => getBarcodeCount(entity), [entity]);

  return (
    <>
      {!!barcodeCount && (
        <Link
          style={{ color: '#e95c30' }}
          to={RouteBuilder.create(AppRoute.Admin)
            .addPart(AppRoute.GS1Barcodes)
            .addPart(entity.code)
            .build()}
        >
          {t('label.linked-gs1s', { count: barcodeCount })}
        </Link>
      )}
    </>
  );
};

const getBarcodeCount = (entity: EntityData) => {
  let count = 0;

  count += entity.gs1Barcodes.length;

  const countChildBarcodes = (e: EntityData) => {
    e.children?.forEach(c => {
      count += c.gs1Barcodes.length;
      countChildBarcodes(c);
    });
  };
  countChildBarcodes(entity);

  return count;
};
