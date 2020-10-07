// import * as React from 'react';
// import { makeStyles, TablePagination } from '@material-ui/core';

// import { EntityBrowser } from './EntityBrowser';
// import { EntityTable, EntityTableHeader, EntityTableRow } from '../molecules';
// import { SearchBar } from '../../inputs';

// import { IEntity, EEntityType } from '@unified-codes/data';

// export default {
//   component: EntityBrowser,
//   title: 'EntityBrowser',
// };

// const useSearchBarStyles = makeStyles({
//   root: { 
//     paddingLeft: 15,
//   },
//   button: { 
//     marginTop: 15
//   },
//   text: {
//     '& > :first-letter': { textTransform: 'capitalize' }
//   },
// })

// const useHeaderStyles = makeStyles({
//   root: {},
//   row: {
//     borderBottom: '1px solid rgba(102,102,102,0.52)',
//   },
//   cell: {
//     background: '#D4EEF7',
//     borderRight: '1px solid rgba(102,102,102,0.52)',
//     fontWeight: 700,
//     cursor: 'pointer', 
//     padding: '3px 16px',
//     '&:last-child': { borderRight: 0 },
//     '&:first-letter': { textTransform: 'capitalize' }
//   },
// })

// const useTableStyles = makeStyles({
//   root: { 
//     marginTop: 5,
//     maxHeight: `calc(100vh - 370px)`,
//     overflowY: 'scroll',
//   },
//   head: {},
//   body: {},
//   rowPrimary: { 
//     background: 'white'
//   },
//   rowSecondary: { 
//     background: '#f5f5f5'
//   },
//   cell: {
//     borderRight: '1px solid rgba(102,102,102,0.52)',
//     borderBottom: 0,
//     '&:first-child': { fontWeight: 700 },
//     '&:last-child': { borderRight: 0 },
//   },
// })

// const useToggleBarStyles = makeStyles({
//   root: {},
//   buttonContainer: {},
//   buttonActive: {
//     borderRadius: '16px',
//     paddingRight: '12px',
//     color: 'rgba(255,255,255,0.87)',
//     background: '#5CCDF4',
//     '&:hover': { background: '#2B83A1' }
//   },
//   buttonInactive: {
//     borderRadius: '16px',
//     paddingRight: '12px',
//     color: 'rgba(255,255,255,0.87)',
//     background: '#2B83A1',
//     '&:hover': { background: '#5CCDF4' }
//   },
// })

// const useBrowserStyles = makeStyles({
//   root: { 
//     background: 'white',
//     maxHeight: '100%',
//     maxWidth: 900 
//   },
//   tableContainer: {
//     background: 'white',
//     maxHeight: '100%',
//     maxWidth: 900,
//     borderRadius: 5,
//   },
//   tablePaginationContainer: {},
//   typeFilterContainer: {},
//   searchBarContainer: {},
// })

// const useTablePaginationStyles = makeStyles({
//   root: { background: '#D4EEF7' }
// })

// const useStyles = () => {
//   const searchBarStyles = useSearchBarStyles();
//   const headerStyles = useHeaderStyles();
//   const tableStyles = useTableStyles();
//   const toggleBarStyles = useToggleBarStyles();
//   const browserStyles = useBrowserStyles();
//   const tablePaginationStyles = useTablePaginationStyles();

//   return {
//     searchBar: searchBarStyles,
//     header: headerStyles,
//     table: tableStyles,
//     toggleBar: toggleBarStyles,
//     browser: browserStyles,
//     tablePagination: tablePaginationStyles,
//   }
// }

// const useEntities = () => ([
//     { code: 'A', description: 'Drug A', type: 'medicinal_product' },
//     { code: 'B', description: 'Drug B', type: 'medicinal_product' },
//     { code: 'C', description: 'Drug C', type: 'medicinal_product' },
//     { code: 'D', description: 'Drug D', type: 'medicinal_product' },
//     { code: 'E', description: 'Drug E', type: 'medicinal_product' },
//     { code: 'F', description: 'Drug F', type: 'medicinal_product' },
//     { code: 'G', description: 'Drug G', type: 'medicinal_product' },
//     { code: 'H', description: 'Drug H', type: 'medicinal_product' },
//     { code: 'I', description: 'Drug I', type: 'medicinal_product' },
//     { code: 'J', description: 'Drug J', type: 'medicinal_product' },
//     { code: 'K', description: 'Drug K', type: 'medicinal_product' },
//     { code: 'L', description: 'Drug L', type: 'medicinal_product' },
//     { code: 'M', description: 'Drug M', type: 'medicinal_product' },
//     { code: 'N', description: 'Drug N', type: 'medicinal_product' },
//     { code: 'O', description: 'Drug O', type: 'medicinal_product' },
//     { code: 'P', description: 'Drug P', type: 'medicinal_product' },
//     { code: 'Q', description: 'Drug Q', type: 'medicinal_product' },
//     { code: 'R', description: 'Drug R', type: 'medicinal_product' },
//     { code: 'S', description: 'Drug S', type: 'medicinal_product' },
//     { code: 'T', description: 'Drug T', type: 'medicinal_product' }
//   ]);

// const useTablePaginationState = () => {
//   const [page, setPage] = React.useState(0);
//   const [rowsPerPage, setRowsPerPage] = React.useState(10);
//   const [rowsPerPageOptions, setRowsPerPageOptions] = React.useState([10, 25, 100]);
//   return { page, rowsPerPage, rowsPerPageOptions, setPage, setRowsPerPage, setRowsPerPageOptions };
// } 

// const useSearchBarState = () => {
//   const [input, setInput] = React.useState('');
//   const [label, setLabel] = React.useState('search description');
//   return { input, label, setInput, setLabel };
// }

// const useTableState = () => {
//   const entities = useEntities();
//   const count = React.useMemo(() => entities.length, [entities]);

//   const [columns, setColumns] = React.useState(['code', 'description', 'type']);
//   const [filterBy, setFilterBy] = React.useState('');
//   const [orderBy, setOrderBy] = React.useState('description');
//   const [orderDesc, setOrderDesc] = React.useState(false);

//   return {
//     entities,
//     count,
//     columns,
//     filterBy,
//     orderBy,
//     orderDesc,
//     setColumns,
//     setFilterBy,
//     setOrderBy,
//     setOrderDesc,
//   };
// }

// const useToggleBarState = () => {
//   const [filterByDrug, setFilterByDrug] = React.useState(true);
//   const [filterByUnitOfUse, setFilterByUnitOfUse] = React.useState(false);
//   const [filterByOther, setFilterByOther] = React.useState(false);

//   return { filterByDrug, setFilterByDrug, filterByUnitOfUse, setFilterByUnitOfUse, filterByOther, setFilterByOther };
// }

// export const withProps = () => {
//   const classes = useStyles();

//   // Table.

//   const {
//     entities,
//     count,
//     columns,
//     filterBy,
//     orderBy,
//     orderDesc,
//     setFilterBy,
//     setOrderDesc,
//   } = useTableState();

//   const {
//     page,
//     rowsPerPage,
//     rowsPerPageOptions,
//     setRowsPerPage,
//     setPage,
//   } = useTablePaginationState();

//   const data = React.useMemo(() => {
//     const start = rowsPerPage * page;
//     const end = rowsPerPage * (page + 1);
//     const filteredEntities = filterBy.length === 0 ? entities : entities.filter((entity: IEntity) => entity.description.includes(filterBy));
//     return filteredEntities.slice(start, end).sort((a: IEntity, b: IEntity) => {
//       if (a[orderBy] > b[orderBy]) return orderDesc ? -1 : 1;
//       if (b[orderBy] > a[orderBy]) return orderDesc ? 1 : -1;
//       return 0;
//     })
//    }, [entities, orderBy, orderDesc, rowsPerPage, page]);

//   const onSort = React.useCallback((_: string) => setOrderDesc(!orderDesc), [orderDesc, setOrderDesc]);

//   const onChangePage = React.useCallback((_: React.MouseEvent<HTMLButtonElement> | null, page: number) => 
//     setPage(page), [setPage]);

//   const onChangeRowsPerPage = React.useCallback((event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => 
//     setRowsPerPage(+event.target.value), [setRowsPerPage]);

//   const EntityBrowserTableHeader = React.useCallback(() => (
//     <EntityTableHeader
//       classes={classes?.header}
//       columns={columns}
//       onSort={onSort}
//       orderDesc={orderDesc}
//       orderBy={orderBy}
//     />
//   ), [classes, columns, onSort, orderDesc, orderBy]);

//   const EntityTableRows = React.useCallback(() => (
//     <React.Fragment>
//       {
//         data.map((entity: IEntity, index: number) => (
//           <EntityTableRow
//             classes={{
//               root: index % 2 ? classes?.table?.rowPrimary : classes?.table?.rowSecondary,
//               cell: classes?.table?.cell
//             }}
//             columns={columns}
//             entity={entity}
//             key={entity.code}
//           ></EntityTableRow>
//         ))
//       }
//     </React.Fragment>
//   ), [classes, columns, data]);
  
//   const EntityTablePagination = React.useCallback(() => (
//     <TablePagination
//       classes={{ root: classes?.tablePagination?.root }}
//       rowsPerPageOptions={rowsPerPageOptions}
//       component="div"
//       count={count}
//       rowsPerPage={rowsPerPage}
//       page={page}
//       onChangePage={onChangePage}
//       onChangeRowsPerPage={onChangeRowsPerPage}
//     />
//   ), [classes, rowsPerPageOptions, count, rowsPerPage, page, onChangePage, onChangeRowsPerPage]);

//   const EntityBrowserTable = React.useCallback(() => (
//     <EntityTable 
//       classes={classes?.table}
//       header={<EntityBrowserTableHeader/>}
//       rows={<EntityTableRows/>}
//       pagination={<EntityTablePagination/>}
//     />
//   ), [classes, EntityBrowserTableHeader, EntityTableRows, EntityTablePagination]);

//   // Search bar.

//   const { 
//     input,
//     label,
//     setInput,
//   } = useSearchBarState();

//   const onChange = React.useCallback((input: string) => setInput(input), [setInput]);
//   const onSearch = React.useCallback((term: string) => setFilterBy(term), [setFilterBy]);
//   const onClear = React.useCallback(() => { setInput(''); setFilterBy(''); }, [setInput, setFilterBy]);

//   const EntityBrowserSearchBar = React.useCallback(() => (
//     <SearchBar 
//       classes={classes.searchBar}
//       input={input}
//       label={label} 
//       onChange={onChange}
//       onClear={onClear}
//       onSearch={onSearch}
//     />
//   ), [classes, input, label, onChange, onClear, onSearch]);

//   // Toggle bar.

//   const { 
//     filterByDrug,
//     filterByUnitOfUse, 
//     filterByOther,
//     setFilterByDrug, 
//     setFilterByUnitOfUse, 
//     setFilterByOther
//   } = useToggleBarState();

//   const onToggle = React.useCallback((type: EEntityType) => {
//     switch(type) {
//       case EEntityType.DRUG: {
//         setFilterByDrug(!filterByDrug);
//         break;
//       }
//       case EEntityType.UNIT_OF_USE: {
//         setFilterByUnitOfUse(!filterByUnitOfUse);
//         break;
//       }
//       case EEntityType.OTHER: {
//         setFilterByOther(!filterByOther);
//         break;
//       }
//     }
//   }, [filterByDrug, filterByUnitOfUse, filterByOther, setFilterByDrug, setFilterByUnitOfUse, setFilterByOther]);

//   const EntityBrowserToggleBar = React.useCallback(() => (
//     <EntityToggleBar 
//       classes={{ 
//         root: classes?.toggleBar?.root, 
//         buttonContainer: classes?.toggleBar?.buttonContainer,
//         buttonActive: classes?.toggleBar?.buttonActive,
//         buttonInactive: classes?.toggleBar?.buttonInactive,
//       }}
//       buttonTypes={[
//         EEntityType.DRUG,
//         EEntityType.UNIT_OF_USE,
//         EEntityType.OTHER
//       ]}
//       buttonStates={{
//         [EEntityType.DRUG]: filterByDrug,
//         [EEntityType.UNIT_OF_USE]: filterByUnitOfUse,
//         [EEntityType.OTHER]: filterByOther
//       }}
//       buttonLabels={{
//         [EEntityType.DRUG]: 'Drug',
//         [EEntityType.UNIT_OF_USE]: 'Unit of use',
//         [EEntityType.OTHER]: 'Other'
//       }}
//       onToggle={onToggle}
//     />
//   ), [classes, filterByDrug, filterByUnitOfUse, filterByOther]);

//   // Browser.

//   return (
//     <EntityBrowser 
//       classes={{ 
//         root: classes?.browser?.root,
//         tableContainer: classes?.browser?.tableContainer, 
//         toggleBarContainer: classes?.browser?.typeFilterContainer,
//         searchBarContainer: classes?.browser?.searchBarContainer,
//       }}
//       table={<EntityBrowserTable/>}
//       toggleBar={<EntityBrowserToggleBar/>}
//       searchBar={<EntityBrowserSearchBar/>}        
//     />
//   );
// };
