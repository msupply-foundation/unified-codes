import React, { FC, useMemo, useState } from 'react';
import { EntityRowFragment } from '../../Entities/api';
import { InteractionGroupFragment } from './api/operations.generated';
import { Autocomplete, Grid, Typography } from '@common/ui';
import { useTranslation } from '@common/intl';

type DrugOrGroupSelectorProps = {
  drugs: EntityRowFragment[];
  groups: InteractionGroupFragment[];
  initialSelectedId?: string;
  otherSelectedId?: string;
  setSelection: (input: { drugId?: string; groupId?: string }) => void;
  isLoading: boolean;
};

interface SelectionOption {
  id: string;
  name: string;
  label: string;
}

export const DrugOrGroupSelector: FC<DrugOrGroupSelectorProps> = ({
  drugs,
  groups,
  initialSelectedId,
  otherSelectedId,
  setSelection,
  isLoading,
}) => {
  const t = useTranslation('system');

  const [selectedId, setSelectedId] = useState<string | undefined | null>(
    initialSelectedId
  );

  const drugOptions = useMemo<SelectionOption[]>(() => {
    if (!drugs) return [];
    return drugs.map(drug => ({
      id: drug.code,
      name: drug.description,
      label: drug.description,
    }));
  }, [drugs]);

  const groupOptions = useMemo<SelectionOption[]>(() => {
    if (!groups) return [];
    return groups.map(group => ({
      id: group.id,
      name: group.name ?? 'Unknown',
      label: group.name ?? 'Unknown',
    }));
  }, [groups]);

  return (
    <Grid item>
      <Grid flexDirection={'row'} display={'flex'} gap={2}>
        <Grid item>
          <Typography variant="body2">{t('label.drug-name')} </Typography>
          <Autocomplete
            loading={isLoading}
            value={drugOptions.find(drug => drug.id === selectedId) ?? null}
            title={t('label.drug-name')}
            options={drugOptions}
            onChange={(e, v) => {
              setSelectedId(v?.id ?? null);
              setSelection({ drugId: v?.id });
            }}
            getOptionLabel={option => option.name}
            getOptionDisabled={option => option.id === otherSelectedId}
            width="250px"
            popperMinWidth={500}
            disabled={isLoading}
          />
        </Grid>
        <Grid item>
          <Typography variant="h6">{t('label.or')}</Typography>
        </Grid>
        <Grid item>
          <Typography variant="body2">
            {t('label.drug-interaction-group')}
          </Typography>
          <Autocomplete
            title={t('label.drug-interaction-group')}
            loading={isLoading}
            value={groupOptions.find(group => group.id === selectedId) ?? null}
            options={groupOptions}
            onChange={(e, v) => {
              setSelectedId(v?.id ?? null);
              setSelection({ groupId: v?.id });
            }}
            getOptionLabel={option => option.name}
            getOptionDisabled={option => option.id === otherSelectedId}
            width="250px"
            popperMinWidth={300}
            disabled={isLoading}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};
