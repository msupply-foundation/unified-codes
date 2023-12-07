import React from 'react';
import { Typography } from '@common/components';
import { useTranslation } from '@common/intl';

export const DataField = ({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) => {
  const t = useTranslation();

  return (
    <Typography>
      <Typography
        component={'span'}
        sx={{ fontWeight: 'bold', color: 'gray.dark' }}
      >
        {label}
        {': '}
      </Typography>

      <Typography
        component={'span'}
        sx={{ color: 'gray.dark', fontStyle: value ? undefined : 'italic' }}
      >
        {value || t('label.not-provided')}
      </Typography>
    </Typography>
  );
};
