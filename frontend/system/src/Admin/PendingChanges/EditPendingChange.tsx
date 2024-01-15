import { CheckIcon } from '@common/icons';
import { useTranslation } from '@common/intl';
import { UpsertEntityInput } from '@common/types';
import { Box, LoadingButton } from '@common/ui';
import React, { useMemo, useState } from 'react';
import { EntityCategory } from '../../constants';
import { DrugFormTree } from '../EditDrug/DrugEditForm/DrugFormTree';
import { VaccineFormTree } from '../EditDrug/DrugEditForm/VaccineFormTree';
import {
  buildDrugInputFromEntity,
  buildEntityDetailsFromPendingChangeBody,
  buildEntityFromDrugInput,
  buildEntityFromVaccineInput,
  buildVaccineInputFromEntity,
  getAllEntityCodes,
} from '../EditDrug/helpers';
import { DrugInput, EntityDetails, VaccineInput } from '../EditDrug/types';

export const EditPendingChange = ({
  entity,
  loading,
  onSave,
}: {
  entity: UpsertEntityInput;
  loading: boolean;
  onSave: (updated: UpsertEntityInput) => Promise<void>;
}) => {
  const asEntityDetails = useMemo(
    () => buildEntityDetailsFromPendingChangeBody(entity ?? {}),
    [entity]
  );

  const initialIds = useMemo(
    () => getAllEntityCodes(asEntityDetails),
    [asEntityDetails]
  );

  return entity?.category === EntityCategory.Drug ? (
    <EditDrug
      entity={asEntityDetails}
      onSave={onSave}
      initialIds={initialIds}
      loading={loading}
    />
  ) : entity?.category === EntityCategory.Vaccine ? (
    <EditVaccine
      entity={asEntityDetails}
      onSave={onSave}
      initialIds={initialIds}
      loading={loading}
    />
  ) : null;
};

const EditDrug = ({
  entity,
  initialIds,
  loading,
  onSave,
}: {
  entity: EntityDetails;
  loading: boolean;
  initialIds: string[];
  onSave: (updated: UpsertEntityInput) => Promise<void>;
}) => {
  const t = useTranslation('system');

  const [draft, setDraft] = useState<DrugInput>(
    buildDrugInputFromEntity(entity)
  );

  const onSubmit = () => {
    onSave(buildEntityFromDrugInput(draft));
  };

  return (
    <Box sx={{ width: '100%' }}>
      <DrugFormTree draft={draft} setDraft={setDraft} initialIds={initialIds} />
      <LoadingButton
        startIcon={<CheckIcon />}
        onClick={onSubmit}
        isLoading={loading}
        sx={{ float: 'right' }}
      >
        {t('label.save')}
      </LoadingButton>
    </Box>
  );
};

const EditVaccine = ({
  entity,
  initialIds,
  loading,
  onSave,
}: {
  entity: EntityDetails;
  loading: boolean;
  initialIds: string[];
  onSave: (updated: UpsertEntityInput) => Promise<void>;
}) => {
  const t = useTranslation('system');

  const [draft, setDraft] = useState<VaccineInput>(
    buildVaccineInputFromEntity(entity)
  );

  const onSubmit = () => {
    onSave(buildEntityFromVaccineInput(draft));
  };

  return (
    <Box sx={{ width: '100%' }}>
      <VaccineFormTree
        draft={draft}
        setDraft={setDraft}
        initialIds={initialIds}
      />
      <LoadingButton
        startIcon={<CheckIcon />}
        onClick={onSubmit}
        isLoading={loading}
        sx={{ float: 'right' }}
      >
        {t('label.save')}
      </LoadingButton>
    </Box>
  );
};
