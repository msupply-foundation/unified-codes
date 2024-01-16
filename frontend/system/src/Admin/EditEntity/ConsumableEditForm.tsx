import { useTranslation } from '@common/intl';
import { Box, SaveIcon, ButtonWithIcon } from '@common/ui';
import React, { useMemo, useState } from 'react';
import { useUuid } from '../../hooks';
import { ConsumableInput, EntityDetails } from './types';
import { getAllEntityCodes } from './helpers';
import { ConsumableFormTree } from './components/ConsumableFormTree';

export const ConsumableEditForm = ({
  initialEntity,
}: {
  initialEntity?: EntityDetails;
}) => {
  const t = useTranslation('system');

  const initialIds = useMemo(
    () => getAllEntityCodes(initialEntity),
    [initialEntity]
  );

  const uuid = useUuid();

  const [draft, setDraft] = useState<ConsumableInput>(
    // TODO: support generating consumable input from existing entity - probably after
    // the data has been mapped into this structure though?
    // initialEntity
    //   ? buildConsumableInputFromEntity(initialEntity)
    //   :
    {
      id: uuid(),
      name: '',
      presentations: [],
      extraDescriptions: [],
    }
  );

  const onSubmit = () => {
    console.log(draft);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <ConsumableFormTree
        draft={draft}
        setDraft={setDraft}
        initialIds={initialIds}
      />
      <Box sx={{ display: 'flex', justifyContent: 'end' }}>
        <ButtonWithIcon
          Icon={<SaveIcon />}
          label={t('button.save')}
          onClick={onSubmit}
          variant="contained"
        />
      </Box>
    </Box>
  );
};
