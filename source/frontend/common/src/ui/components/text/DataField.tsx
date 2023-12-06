import React from 'react';
import { Typography } from 'frontend/common/src/ui/components';
import { useTranslation } from 'frontend/common/src/intl';

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
