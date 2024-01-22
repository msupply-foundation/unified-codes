import { useTranslation } from '@common/intl';
import React from 'react';
import { useEntities } from 'frontend/system/src/Entities/api';
import { Link } from 'react-router-dom';
import { RouteBuilder } from '@common/utils';
import { AppRoute } from 'frontend/config/src';

export const ExistingNameSuggestor = ({ name }: { name: string }) => {
  const t = useTranslation('system');

  const { data: matchingEntities } = useEntities({
    filter: {
      categories: ['drug', 'consumable', 'vaccine'],
      match: 'exact',
      description: name,
    },
    first: 1,
    offset: 0,
  });
  const match = matchingEntities?.data[0];

  return match ? (
    <Link
      style={{ display: 'block', marginLeft: '10px', color: '#003AB1' }}
      to={RouteBuilder.create(AppRoute.Admin)
        .addPart(AppRoute.Edit)
        .addPart(match.code)
        .build()}
    >
      {t('message.did-you-mean', {
        suggestion: `${match.description} (${match.code})`,
      })}
    </Link>
  ) : null;
};
