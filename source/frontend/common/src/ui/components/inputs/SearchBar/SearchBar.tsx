import React, { FC, useEffect, useState } from 'react';
import { BasicTextInput } from '../TextInput';
import { CloseIcon, SearchIcon } from 'frontend/common/src/ui/icons';
import { useDebounceCallback } from 'frontend/common/src/hooks';
import { InlineSpinner } from '../../loading';
import { useTranslation } from 'frontend/common/src/intl';
import { IconButton, InputAdornment } from 'frontend/common/src/ui/components';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  isLoading?: boolean;
  debounceTime?: number;
}

const Spin: FC<{ isLoading: boolean }> = ({ isLoading }) =>
  isLoading ? <InlineSpinner /> : null;

export const SearchBar: FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder,
  isLoading = false,
  debounceTime = 500,
}) => {
  const [buffer, setBuffer] = useState(value);
  const [loading, setLoading] = useState(false);
  const t = useTranslation(['common']);

  // Sync the passed in isLoading state with the internal setLoading state
  //   useEffect(() => {
  //     setLoading(isLoading);
  //   }, [isLoading]);

  useEffect(() => {
    setBuffer(value);
  }, [value]);

  const debouncedOnChange = useDebounceCallback(
    value => {
      onChange(value);
      setLoading(false);
    },
    [onChange],
    debounceTime
  );

  const isClearable = !(isLoading || loading) && buffer.length > 0;

  const clearInputButton = (
    <IconButton
      sx={{ color: 'gray.main' }}
      onClick={() => {
        setBuffer('');
        debouncedOnChange('');
        setLoading(true);
      }}
      icon={<CloseIcon fontSize="small" />}
      label={t('label.clear-search')}
    />
  );

  return (
    <>
      <BasicTextInput
        InputProps={{
          startAdornment: (
            <SearchIcon sx={{ color: 'gray.main' }} fontSize="small" />
          ),
          endAdornment: isClearable ? (
            <InputAdornment position="end">{clearInputButton}</InputAdornment>
          ) : (
            <Spin isLoading={isLoading || loading} />
          ),
          sx: {
            paddingLeft: '6px',
            alignItems: 'center',
            transition: theme => theme.transitions.create('width'),
            height: '38px',
            width: '220px',
            '&.Mui-focused': {
              width: '360px',
            },
          },
        }}
        value={buffer}
        onChange={e => {
          setBuffer(e.target.value);
          debouncedOnChange(e.target.value);
          setLoading(true);
        }}
        placeholder={placeholder}
      />
    </>
  );
};
