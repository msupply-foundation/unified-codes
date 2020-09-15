import * as React from 'react';

import { IEntityCollection, IExplorerVariables } from '@unified-codes/data';
import { TableProps } from '../../data';

import EntityTable from '../molecules/EntityTable';
import EntityTypeFilter from '../molecules/EntityTypeFilter';
import { EntityTableRowProps } from '../molecules/EntityTableRow';
import Grid from '../../layout/atoms/Grid';
import SearchBar from '../../inputs/molecules/SearchBar';
import Alert from '../../feedback/atoms/Alert';
import TablePagination from '@material-ui/core/TablePagination';

export interface IEntityBrowserClasses {
  pagination?: string;
  searchBar?: string;
  table?: string;
  tableContainer?: string;
  typeFilter?: string;
}

export type IChildProperties = {
  rowProps?: EntityTableRowProps;
  tableProps?: TableProps;
};
export interface EntityBrowserProps {
  childProps?: IChildProperties;
  classes?: IEntityBrowserClasses;
  entities: IEntityCollection;
  noResultsMessage?: string;
  variables?: IExplorerVariables;

  onChange?: (value: string) => void;
  onChangePage?: (page: number) => void;
  onChangeRowsPerPage?: (rowsPerPage: number) => void;
  onClear?: () => void;
  onSearch?: (value: string) => void;
  onSort?: (value: string) => void;
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
  onSort,
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
  const entityTypes = [
    { name: 'Drugs', active: true },
    { name: 'Unit of Use', active: false },
    { name: 'Other', active: false },
  ];

  return (
    <>
      <EntityTypeFilter types={entityTypes} className={classes?.typeFilter} />
      <Grid container direction="column" className={classes?.tableContainer}>
        <Grid item className={classes?.searchBar}>
          <SearchBar
            input={input}
            label="Search description"
            onChange={onChangeInput}
            onClear={handleClear}
            onSearch={onSearch}
          />
        </Grid>
        {entities.totalLength ? (
          <>
            <Grid item className={classes?.table}>
              <EntityTable
                data={entities.data}
                {...childProps}
                onSort={onSort}
                variables={variables}
              />
            </Grid>
            <Grid item className={classes?.pagination}>
              {entities.totalLength && (
                <TablePagination
                  rowsPerPageOptions={[10, 25, 100]}
                  component="div"
                  count={entities.totalLength}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onChangePage={handleChangePage}
                  onChangeRowsPerPage={handleChangeRowsPerPage}
                />
              )}
            </Grid>
          </>
        ) : (
          <Grid item>
            <Alert severity="warning">{noResultsMessage}</Alert>
          </Grid>
        )}
      </Grid>
    </>
  );
};

export default EntityBrowser;
