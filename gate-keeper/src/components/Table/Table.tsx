import * as React from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
// import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import { EnhancedTableHead } from './TableHead';
import { EnhancedTableToolbar } from './Toolbar';
import { Order, getComparator, Data, HeadCell, StyledTableCell, StyledTableRow, StickyTableCell } from './Utils';


export interface EnhancedTableProps {
  rows: Data[];
  headCells: readonly HeadCell[];
  defaultSort: string;
  title: React.ReactNode;
  defaultRows: number;
  stickyColumnIds: string[];
  page: number;
  count: number;
  onPageChange: (newPage: number) => void;
  onRowsPerPageChange: (newItemsPerPage: number) => void;
}
  
export const EnhancedTable: React.FC<EnhancedTableProps> = (
  { rows, headCells, defaultSort, title, defaultRows, stickyColumnIds, page, count, onPageChange, onRowsPerPageChange }
) => {

  const [order, setOrder] = React.useState<Order>('desc');
  const [orderBy, setOrderBy] = React.useState<string>(defaultSort);
  const [selected, setSelected] = React.useState<readonly number[]>([]);
  const [rowsPerPage, setRowsPerPage] = React.useState(defaultRows);
  const [currentPage, setCurrentPage] = React.useState(page);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data,
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property as string);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => Number(n.id));
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, id: number) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: readonly number[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    // setPage(1);
    onRowsPerPageChange(newRowsPerPage);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setCurrentPage(newPage);
    onPageChange(newPage);
  };

  const visibleRows = React.useMemo(() => {
    const sortedRows = [...rows].sort(getComparator(order, orderBy));
    return sortedRows;
  }, [order, orderBy, page, rowsPerPage, rows]);

  const CheckboxCellType = stickyColumnIds.length > 0 ? StickyTableCell : StyledTableCell;

  return (
    <Box 
      sx={{ 
        width: '100%', 
        maxWidth: '85vw'
      }}
    >
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <EnhancedTableToolbar numSelected={selected.length} title={title} />
        <TableContainer
          sx={{ 
            maxHeight: '70vh',
            overflowX: 'auto',
            overflowY: 'auto'
          }}
        >
          <Table
            stickyHeader
            sx={{ minWidth: 750 }}
            aria-label="sticky table"
            aria-labelledby="tableTitle"
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
              headCells={headCells}
              stickyColumnIds={stickyColumnIds}
            />
            <TableBody>
              {visibleRows.map((row, index) => {
                const isItemSelected = selected.includes(Number(row.id));
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <StyledTableRow
                    hover
                    // onClick={(event) => handleClick(event, Number(row.id))}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.id}
                    selected={isItemSelected}
                    sx={{ cursor: 'pointer' }}
                  >
                    <CheckboxCellType 
                      padding="checkbox" 
                      // Ensure left is set to 0 for the first sticky column
                      sx={{ position: 'sticky', left: 0, zIndex: 2 }}
                    >
                      <Checkbox
                        color="primary"
                        onClick={(event) => handleClick(event, Number(row.id))}
                        checked={isItemSelected}
                        inputProps={{
                          'aria-labelledby': labelId,
                        }}
                      />
                    </CheckboxCellType>
                    {headCells.map((headCell, headIndex) => {
                      const stickyQ = stickyColumnIds.includes(headCell.id);
                      const CellComponent = stickyQ ? StickyTableCell : StyledTableCell;
                      const leftPosition = stickyQ ? headIndex + 1 : 0;
                      // const leftPosition = stickyQ 
                      //   ? headCells.slice(0, headIndex).reduce((acc, curr) => {
                      //       const width = typeof curr.width === 'number' ? curr.width : 0; // Ensure width is a number
                      //       return stickyColumnIds.includes(curr.id) ? acc + width : acc;
                      //     }, 0)
                      //   : 'auto';
                      return (
                        <CellComponent
                          key={headCell.id}
                          align='center'
                          component={headCell.id === 'name' ? 'th' : undefined}
                          id={headCell.id === 'name' ? labelId : undefined}
                          scope={headCell.id === 'name' ? 'row' : undefined}
                          // Adjust left for each sticky column
                          sx={stickyQ ? { position: 'sticky', left: leftPosition, zIndex: 1 } : {}} 
                        >
                          {
                            row[headCell.id] === null
                              ? "--"
                              : typeof row[headCell.id] === 'boolean'
                              ? row[headCell.id] ? "True" : "False"
                              : typeof row[headCell.id] === 'object'
                              ? JSON.stringify(row[headCell.id])
                              : row[headCell.id]
                          }
                        </CellComponent>
                      );
                    })}
                  </StyledTableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 20, 50, 75, 100]}
          component="div"
          count={count || -1}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}
