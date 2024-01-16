import { FlatButton, InlineSpinner } from '@common/components';
import { PlusCircleIcon } from '@common/icons';
import { Box } from '@common/ui';
import React from 'react';

export const AddFieldButton = ({
  label,
  onClick,
  isLoading,
}: {
  label: string;
  onClick: () => void;
  isLoading?: boolean;
}) => {
  if (isLoading) {
    return (
      <Box width={'fit-content'} margin={'10px 20px'}>
        <InlineSpinner />
      </Box>
    );
  }
  return (
    <FlatButton
      startIcon={<PlusCircleIcon />}
      label={label}
      onClick={onClick}
      disableFocusRipple
      sx={{
        marginLeft: '20px',
        '&.Mui-focusVisible': {
          backgroundColor: '#e95c3029',
        },
      }}
    />
  );
};
