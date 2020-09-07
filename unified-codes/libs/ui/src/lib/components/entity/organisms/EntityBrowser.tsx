import * as React from 'react';

import { Entity, IPaginatedResults } from '@unified-codes/data';

import EntityTable from '../molecules/EntityTable';
import Grid from '../../layout/atoms/Grid';
import SearchBar from '../../inputs/molecules/SearchBar';
import TablePagination from '@material-ui/core/TablePagination';

export interface EntityBrowserProps {
  data: IPaginatedResults<Entity>;
  onChange?: (value: string) => void;
  onClear?: () => void;
  onSearch?: (value: string) => void;
}

export type EntityBrowser = React.FunctionComponent<EntityBrowserProps>;
type RowsPerPageEvent = React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>;
type MouseEvent = React.MouseEvent<HTMLButtonElement> | null;

export const EntityBrowser: EntityBrowser = ({ data, onChange, onClear, onSearch }) => {
  const [input, setInput] = React.useState('');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(25);

  const onChangeInput = React.useCallback(
    (input: string) => {
      setInput(input);
      onChange && onChange(input);
    },
    [setInput]
  );

  const handleChangePage = (_: MouseEvent, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: RowsPerPageEvent) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Grid container direction="column">
      <Grid item>
        <SearchBar input={input} onChange={onChangeInput} onClear={onClear} onSearch={onSearch} />
      </Grid>
      <Grid item>
        <EntityTable data={data.entities} />
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={data.totalResults}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Grid>
    </Grid>
  );
};

export default EntityBrowser;
