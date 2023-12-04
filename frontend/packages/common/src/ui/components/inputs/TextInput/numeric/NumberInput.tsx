import React, { ForwardedRef } from 'react';
import { NumericTextInput } from '@common/components';
import { NumUtils } from '@common/utils';
import { NumericTextInputProps } from './NumericTextInput';

interface NumberProps extends Omit<NumericTextInputProps, 'onChange'> {
  min?: number;
  max?: number;
  onChange: (newValue: number) => void;
}

// where Number is between min and max
export const NumberInput = React.forwardRef(
  (
    {
      sx,
      disabled = false,
      value,
      min = -999999999,
      max = 999999999,
      onChange,
      ...rest
    }: NumberProps,
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    return (
      <NumericTextInput
        ref={ref}
        type="number"
        InputProps={{
          sx: { ...sx, '& .MuiInput-input': { textAlign: 'right' } },
        }}
        onChange={e => {
          const newValue = NumUtils.parseString(e.target.value, min, max);
          onChange(newValue);
        }}
        disabled={disabled}
        value={value}
        {...rest}
      />
    );
  }
);
