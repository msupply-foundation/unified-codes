import { useTranslation } from '@common/intl';
import { BasicTextInput, Box, FlatButton, PlusCircleIcon } from '@common/ui';
import React, { useState } from 'react';

type DrugInput = {
  name: string;
};

const DrugEditForm = () => {
  const t = useTranslation('system');
  const [draft, setDraft] = useState<DrugInput>({ name: '' });
  console.log(draft);

  const onUpdate = (patch: Partial<DrugInput>) => {
    setDraft({ ...draft, ...patch });
  };

  return (
    <Box sx={{ marginY: '16px' }}>
      <BasicTextInput
        autoFocus
        value={draft.name}
        onChange={e => onUpdate({ name: e.target.value })}
        label={t('label.drug-name')}
        InputLabelProps={{ shrink: true }}
        fullWidth
      />
      <FlatButton
        startIcon={<PlusCircleIcon />}
        sx={{ padding: 0 }}
        label={'add route'}
        onClick={() => console.log()}
      />
    </Box>
  );
};

export default DrugEditForm;
