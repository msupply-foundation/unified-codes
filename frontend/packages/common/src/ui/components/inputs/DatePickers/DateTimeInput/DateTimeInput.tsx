import React, { FC } from 'react';
import { BaseDatePickerInput } from '../BaseDatePickerInput';

interface DateTimeInputProps {
  date: Date | null;
  onChange: (value: Date | null) => void;
  disabled?: boolean;
}

export const DateTimeInput: FC<DateTimeInputProps> = ({
  date,
  onChange,
  disabled,
}) => {
  return (
    <BaseDatePickerInput
      disabled={disabled}
      views={['year', 'month', 'day']}
      inputFormat="yyyy/MM/dd HH:mm"
      value={date}
      onChange={d => {
        onChange(d);
      }}
    />
  );
};
