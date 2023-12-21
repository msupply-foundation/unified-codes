import React, { useEffect } from 'react';
import { useParams } from 'frontend/common/src';
import { useBreadcrumbs } from '@common/hooks';
import { useEntity } from '../../Entities/api';
import { DrugEditForm } from './DrugEditForm';

export const EditDrugView = () => {
  const { code } = useParams();
  const { setSuffix } = useBreadcrumbs();

  const { data: entity } = useEntity(code || '');

  useEffect(() => {
    if (entity?.name) setSuffix(entity.name);
  }, [entity?.name]);
  return entity ? <DrugEditForm initialEntity={entity} /> : null;
};
