import React, { useEffect } from 'react';
import { useParams } from 'frontend/common/src';
import { useBreadcrumbs } from '@common/hooks';
import { useEntity } from '../../Entities/api';
import { DrugEditForm } from './DrugEditForm';
import { VaccineEditForm } from './VaccineEditForm';
import { ConsumableEditForm } from './ConsumableEditForm';

export const EditEntityView = () => {
  const { code } = useParams();
  const { setSuffix } = useBreadcrumbs();

  const { data: entity, isFetchedAfterMount } = useEntity(code || '');

  useEffect(() => {
    if (entity?.name) setSuffix(entity.name);
  }, [entity?.name]);

  return isFetchedAfterMount && entity ? (
    entity.type === 'vaccine' ? (
      <VaccineEditForm initialEntity={entity} />
    ) : entity.type === 'consumable' ? (
      <ConsumableEditForm initialEntity={entity} />
    ) : (
      <DrugEditForm initialEntity={entity} />
    )
  ) : null;
};
