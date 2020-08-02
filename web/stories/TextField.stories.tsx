import * as React from "react";
import {
  ClearIcon,
  InputAdornment,
  SearchIcon,
  TextField,
} from "../src/components";

export default { title: "TextField" };

export const withClearIcon = () => (
  <TextField
    InputProps={{
      endAdornment: (
        <InputAdornment position="end">
          <ClearIcon />
        </InputAdornment>
      ),
    }}
  />
);
export const withSearchIcon = () => (
  <TextField
    InputProps={{
      endAdornment: (
        <InputAdornment position="end">
          <SearchIcon />
        </InputAdornment>
      ),
    }}
  />
);
