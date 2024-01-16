import React, { FC, useEffect, useState } from 'react';
import { CloseIcon, NavigateLinkIcon, SearchIcon } from '@common/icons';
import { useDebounceCallback } from '@common/hooks';
import { useTranslation } from '@common/intl';
import {
  BasicTextInput,
  IconButton,
  InlineSpinner,
  InputAdornment,
  Typography,
} from '@common/components';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import Fuse from 'fuse.js';
import { RouteBuilder, useNavigate } from 'frontend/common/src';
import { AppRoute } from 'frontend/config/src';

interface EntitySearchBarProps {
  // value: string;
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
  // value,
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
    <>
      <BasicTextInput
        onBlur={() => {
          debouncedSuggestions(false);
        }}
        onFocus={() => {
          debouncedSuggestions(true);
        }}
        InputProps={{
          startAdornment: (
            <SearchIcon sx={{ color: 'gray.main' }} fontSize="small" />
          ),
          endAdornment: isClearable ? (
            <InputAdornment
              tabIndex={-1}
              position="end"
              onMouseDown={() => {
                setBuffer('');
                debouncedOnChange('');
                setLoading(true);
              }}
            >
              <IconButton
                tabIndex={-1}
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
        value={buffer}
        onChange={e => {
          setBuffer(e.target.value);
          setShowSuggestions(true);
          debouncedOnChange(e.target.value);
          setLoading(true);
        }}
        placeholder={placeholder}
      />
      {buffer && showSuggestions && (
        <MenuList
          tabIndex={-1}
          dense
          sx={{
            position: 'absolute',
            zIndex: 9999,
            marginTop: '35px',
            backgroundColor: 'white',
            minWidth: '360px',
          }}
        >
          <Typography variant="h6" sx={{ paddingLeft: '10px' }} tabIndex={-1}>
            {t('label.suggestions')}
          </Typography>

          {fuse
            .search(buffer)
            .slice(0, 3)
            .map((result, index) => (
              <MenuItem
                key={result.item.code}
                onFocus={() => {
                  debouncedSuggestions(true);
                }}
                onBlur={() => {
                  debouncedSuggestions(false);
                }}
                onKeyDown={e => {
                  // translate an tab into a down arrow
                  if (e.key === 'Tab') {
                    e.key = 'ArrowDown';
                  }
                  e.stopPropagation;
                }}
                onClick={e =>
                  navigate(
                    RouteBuilder.create(AppRoute.Browse)
                      .addPart(result.item.code)
                      .build()
                  )
                }
                tabIndex={index}
              >
                {result.item.description} ({result.item.code}){' '}
                <NavigateLinkIcon />
              </MenuItem>
            ))}
        </MenuList>
      )}
    </>
  );
};
