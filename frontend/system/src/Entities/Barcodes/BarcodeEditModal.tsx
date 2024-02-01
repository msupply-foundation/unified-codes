import {
  AutocompleteList,
  AutocompleteOptionRenderer,
  BasicTextInput,
  DialogButton,
  InlineSpinner,
  LoadingButton,
} from '@common/components';
import { useDialog } from '@common/hooks';
import { CheckIcon } from '@common/icons';
import { useTranslation } from '@common/intl';
import { AddBarcodeInput } from '@common/types';
import { Grid, Typography } from '@common/ui';
import { RegexUtils } from '@common/utils';
import { Alert, AlertTitle } from '@mui/material';
import React, { useState } from 'react';
import { useEntities } from '../../Entities/api';
import { EntityRowFragment } from '../../Entities/api/operations.generated';
import { useAddBarcode } from './api';
import { getParentDescription } from './helpers';

type BarcodeEditModalProps = {
  isOpen: boolean;
  onClose: () => void;
  entityCodes?: string[];
};

export const BarcodeEditModal = ({
  isOpen,
  onClose,
  entityCodes,
}: BarcodeEditModalProps) => {
  const t = useTranslation('system');

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [draft, setDraft] = useState<AddBarcodeInput>({
    entityCode: '',
    gtin: '',
    manufacturer: '',
  });

  const { Modal } = useDialog({ isOpen, onClose });

  const { data: packSizeEntities } = useEntities({
    first: 10000,
    filter: { type: 'PackSize', orderBy: { field: 'description' } },
    offset: 0,
  });

  const { mutateAsync: addBarcode, isLoading } = useAddBarcode();

  const onSubmit = async () => {
    try {
      await addBarcode({
        input: {
          ...draft,
        },
      });
      onClose();
    } catch (err) {
      if (err instanceof Error) setErrorMessage(err.message);
      else setErrorMessage(t('messages.unknown-error'));
    }
  };

  const packSizeOptions: EntityRowFragment[] = packSizeEntities?.data ?? [];

  const isInvalid = !draft.gtin || !draft.manufacturer || !draft.entityCode;
  const modalWidth = Math.min(window.innerWidth - 200, 800);

  return (
    <Modal
      width={modalWidth}
      okButton={
        <LoadingButton
          disabled={isInvalid}
          onClick={onSubmit}
          isLoading={isLoading}
          startIcon={<CheckIcon />}
          variant="contained"
        >
          {t('button.ok')}
        </LoadingButton>
      }
      cancelButton={<DialogButton variant="cancel" onClick={onClose} />}
      title={t('label.add-barcode')}
    >
      {isLoading ? (
        <InlineSpinner />
      ) : (
        <Grid flexDirection="column" display="flex" gap={2}>
          <BasicTextInput
            autoFocus
            required
            InputLabelProps={{ shrink: true }}
            label={t('label.gtin')}
            value={draft.gtin}
            onChange={e => setDraft({ ...draft, gtin: e.target.value })}
          />
          <BasicTextInput
            required
            InputLabelProps={{ shrink: true }}
            label={t('label.manufacturer')}
            value={draft.manufacturer}
            onChange={e => setDraft({ ...draft, manufacturer: e.target.value })}
          />
          <AutocompleteList
            options={packSizeOptions}
            renderOption={renderOption}
            getOptionLabel={option => `${option.id}`}
            width={modalWidth - 50}
            openOnFocus
            renderInput={props => (
              <BasicTextInput
                required
                label={t('label.pack-size-code')}
                {...props}
                InputLabelProps={{ shrink: true }}
              />
            )}
            filterOptions={(options, state) =>
              options.filter(
                option =>
                  // if entityCodes are defined, filter out options that are not in the list
                  (entityCodes?.includes(option.code) ?? true) &&
                  RegexUtils.matchObjectProperties(state.inputValue, option, [
                    'description',
                    'code',
                  ])
              )
            }
            onChange={(e, value) =>
              setDraft({
                ...draft,
                entityCode: (value as unknown as EntityRowFragment)?.code ?? '',
              })
            }
          />
          {errorMessage ? (
            <Grid item>
              <Alert
                severity="error"
                onClose={() => {
                  setErrorMessage('');
                }}
              >
                <AlertTitle>{t('error')}</AlertTitle>
                {errorMessage}
              </Alert>
            </Grid>
          ) : null}
        </Grid>
      )}
    </Modal>
  );
};

const renderOption: AutocompleteOptionRenderer<EntityRowFragment> = (
  props,
  option
): JSX.Element => (
  <li key={option.id} {...props}>
    <Typography component="span" width="100px">
      {option.code}
    </Typography>
    <Typography component="span" width={`calc(100% - 100px)`}>
      {getParentDescription(option)}{' '}
      <Typography component="span" fontWeight="bold">
        {option.name}
      </Typography>
    </Typography>
  </li>
);
