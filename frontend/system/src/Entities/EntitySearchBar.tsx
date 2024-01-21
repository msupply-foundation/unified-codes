import React, { FC, useState } from 'react';
import { CloseIcon, NavigateLinkIcon, SearchIcon } from '@common/icons';
import { useDebounceCallback } from '@common/hooks';
import { useTranslation } from '@common/intl';
import {
  AutocompleteList,
  BasicTextInput,
  IconButton,
  InlineSpinner,
  InputAdornment,
  Typography,
} from '@common/components';
import Fuse from 'fuse.js';
import { ListItem, RouteBuilder, useNavigate } from 'frontend/common/src';
import { AppRoute } from 'frontend/config/src';
import { isArray } from 'lodash';

interface EntitySearchBarProps {
  onChange: (value: string) => void;
  products: {
    type: string;
    description: string;
    code: string;
    id: string;
  }[];
  placeholder: string;
  isLoading?: boolean;
  debounceTime?: number;
}

const Spin: FC<{ isLoading: boolean }> = ({ isLoading }) =>
  isLoading ? <InlineSpinner /> : null;

export const EntitySearchBar: FC<EntitySearchBarProps> = ({
  onChange,
  products,
  placeholder,
  isLoading = false,
  debounceTime = 500,
}) => {
  const [buffer, setBuffer] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const t = useTranslation(['common']);
  const navigate = useNavigate();

  const fuse = new Fuse(products ?? [], {
    keys: ['description', 'code'],
  });
  fuse.setCollection(products);

  const debouncedOnChange = useDebounceCallback(
    value => {
      onChange(value);
      setLoading(false);
    },
    [onChange],
    debounceTime
  );

  const debouncedSuggestions = useDebounceCallback(
    b => {
      setShowSuggestions(b);
    },
    [],
    600
  );

  const isClearable = !(isLoading || loading) && buffer.length > 0;

  return (
    <AutocompleteList
      options={products}
      width={360}
      inputValue={buffer}
      filterOptions={(opts, { inputValue }) =>
        fuse
          .search(inputValue)
          .slice(0, 7)
          .map(r => r.item)
      }
      open={showSuggestions}
      onChange={(e, value) =>
        navigate(
          RouteBuilder.create(AppRoute.Browse)
            .addPart((isArray(value) ? value[0]?.code : value?.code) || '')
            .build()
        )
      }
      renderOption={(props, item) => (
        <ListItem {...props}>
          <Typography>{item.description}</Typography>
          <NavigateLinkIcon />
        </ListItem>
      )}
      getOptionLabel={option => option.description}
      renderInput={props => (
        <BasicTextInput
          {...props}
          onBlur={() => setShowSuggestions(false)}
          onFocus={() => debouncedSuggestions(true)}
          InputProps={{
            ...props.InputProps,
            startAdornment: (
              <SearchIcon sx={{ color: 'gray.main' }} fontSize="small" />
            ),
            endAdornment: isClearable ? (
              <InputAdornment
                position="end"
                onMouseDown={() => {
                  setBuffer('');
                  debouncedOnChange('');
                  setLoading(true);
                }}
              >
                <IconButton
                  sx={{ color: 'gray.main' }}
                  icon={<CloseIcon fontSize="small" />}
                  label={t('label.clear-search')}
                  // onClick handled by above `onMouseDown` to prevent race condition with focus shifting away from the input!
                  onClick={() => {}}
                />
              </InputAdornment>
            ) : (
              <Spin isLoading={isLoading || loading} />
            ),
            sx: {
              paddingLeft: '6px',
              alignItems: 'center',
              height: '38px',
              width: '360px',
            },
          }}
          onChange={e => {
            setBuffer(e.target.value);
            setShowSuggestions(true);
            debouncedOnChange(e.target.value);
            setLoading(true);
          }}
          placeholder={placeholder}
        />
      )}
    />
  );
};
