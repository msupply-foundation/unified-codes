import * as React from 'react';

import { Entity, IExplorerVariables, IPaginatedResults } from '@unified-codes/data';
import { TableProps } from '../../data';

import EntityTable from '../molecules/EntityTable';
import { EntityTableRowProps } from '../molecules/EntityTableRow';
import Grid from '../../layout/atoms/Grid';
import SearchBar from '../../inputs/molecules/SearchBar';
import Alert from '../../feedback/atoms/Alert';
import TablePagination from '@material-ui/core/TablePagination';

export interface IEntityBrowserClasses {
  pagination?: string;
  root?: string;
  searchBar?: string;
  table?: string;
}

export type IChildProperties = {
  tableProps?: TableProps;
  rowProps?: EntityTableRowProps;
};
export interface EntityBrowserProps {
  childProps?: IChildProperties;
  classes?: IEntityBrowserClasses;
  entities: IPaginatedResults<Entity>;
  noResultsMessage?: string;
  variables?: IExplorerVariables;

  onChange?: (value: string) => void;
  onChangePage?: (page: number) => void;
  onChangeRowsPerPage?: (rowsPerPage: number) => void;
  onClear?: () => void;
  onSearch?: (value: string) => void;
}

export type EntityBrowser = React.FunctionComponent<EntityBrowserProps>;
type RowsPerPageEvent = React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>;
type MouseEvent = React.MouseEvent<HTMLButtonElement> | null;

export const EntityBrowser: EntityBrowser = ({
  childProps,
  entities,
  noResultsMessage = 'No results found',
  onChange,
  onChangePage,
  onChangeRowsPerPage,
  onClear,
  onSearch,
  classes,
  variables,
}) => {
  const [input, setInput] = React.useState('');

  const onChangeInput = React.useCallback(
    (input: string) => {
      setInput(input);
      onChange && onChange(input);
    },
    [setInput]
  );

  const handleChangePage = (_: MouseEvent, newPage: number) => {
    onChangePage && onChangePage(newPage);
  };

  const handleChangeRowsPerPage = (event: RowsPerPageEvent) => {
    const rowsPerPage = +event.target.value;
    onChangePage && onChangePage(0);
    onChangeRowsPerPage && onChangeRowsPerPage(rowsPerPage);
  };

  const handleClear = () => {
    setInput('');
    onClear && onClear();
  };

  const { page = 1, rowsPerPage = 10 } = variables || {};
  return (
    <Grid container direction="column" className={classes?.root}>
      <Grid item className={classes?.searchBar}>
        <SearchBar
          input={input}
          label="Search description"
          onChange={onChangeInput}
          onClear={handleClear}
          onSearch={onSearch}
        />
      </Grid>
      {entities.totalResults ? (
        <>
          <Grid item className={classes?.table}>
            <EntityTable data={entities.data} {...childProps} />
          </Grid>
          <Grid item className={classes?.pagination}>
            {entities.totalResults && (
              <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={entities.totalResults}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
              />
            )}{' '}
          </Grid>
        </>
      ) : (
        <Grid item>
          <Alert severity="warning">{noResultsMessage}</Alert>
        </Grid>
      )}
    </Grid>
  );
};

export default EntityBrowser;
