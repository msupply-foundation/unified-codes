import React, { useEffect } from 'react';
import { useTranslation } from '@common/intl';
import { AppBarContentPortal } from '@common/ui';
import { useBreadcrumbs } from '@common/hooks';
import { useEntity } from '../api';
import { Box, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import { EntityDetailsFragment } from '../api/operations.generated';

export const EntityDetails = () => {
  const t = useTranslation('system');
  const { code } = useParams();
  const { setSuffix } = useBreadcrumbs();

  const { data: entity, isError, isLoading } = useEntity(code || '');

  useEffect(() => {
    if (entity?.description) setSuffix(entity.description);
  }, [entity?.description]);

  return (
    <>
      <AppBarContentPortal
        sx={{
          paddingBottom: '16px',
          flex: 1,
          display: 'flex',
          justifyContent: 'space-between',
        }}
      ></AppBarContentPortal>
      <Entity entity={entity} />
    </>
  );
};

type IEntity = EntityDetailsFragment & { children?: IEntity[] | null };

const Entity = ({ entity }: { entity?: IEntity | null }) => {
  if (!entity) return null;
  return (
    <Box paddingLeft={'10px'}>
      <Typography>
        {entity.description}
        {' - '}
        <span style={{ color: '#e95c30', fontWeight: 'bold' }}>
          {entity.code}
        </span>
      </Typography>
      {entity.children?.map(c => (
        <Entity entity={c} key={c.code} />
      ))}
      {entity.properties && (
        <>
          <Typography fontWeight={700}>Properties</Typography>
          {entity.properties.map(p => (
            <Typography key={p.value}>
              {p.type}: {p.value}
            </Typography>
          ))}
        </>
      )}
    </Box>
  );
};
