import { useTranslation } from '@common/intl';
import React, { useEffect } from 'react';
import { useEntities } from 'frontend/system/src/Entities/api';
import { Link } from 'react-router-dom';
import { RouteBuilder } from '@common/utils';
import { AppRoute } from 'frontend/config/src';
import { useDebounceCallback } from '@common/hooks';

export const ExistingNameSuggester = ({ name }: { name: string }) => {
  const t = useTranslation('system');

  const { refetch, data: matchingEntities } = useEntities({
    filter: {
      categories: ['drug', 'consumable', 'vaccine'],
      match: 'exact',
      description: name,
    },
    first: 1,
    offset: 0,
    options: { enabled: false }, // prevent automatic fetch - manual refetch called by debouncedOnChange
  });
  const match = matchingEntities?.data[0];

  const debouncedOnChange = useDebounceCallback(
    () => refetch(),
    [refetch],
    750
  );

  useEffect(() => {
    debouncedOnChange();
  }, [name]);

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
