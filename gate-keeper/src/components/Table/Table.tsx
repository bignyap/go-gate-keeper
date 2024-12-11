import * as React from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import Paper from '@mui/material/Paper';
import { EnhancedTableHead } from './TableHead';
import { EnhancedTableToolbar } from './Toolbar';
import { Order, getComparator, Data, HeadCell, StyledTableCell, StyledTableRow, StickyTableCell } from './Utils';
import LongMenu from '../Menu/Menu';


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
  stickyRight?: boolean;
  menuOptions?: string[];  
  onOptionSelect?: (action: string, row: Data) => void;
  tableContainerSx?: object;
}
  
export const EnhancedTable: React.FC<EnhancedTableProps & { renderCell?: (key: string, value: any, row: Data) => React.ReactNode }> = (
  { 
    rows, headCells, defaultSort, 
    title, defaultRows, stickyColumnIds, 
    page, count, onPageChange, onRowsPerPageChange,   
    stickyRight, menuOptions, onOptionSelect,
    tableContainerSx, renderCell
  }
) => {

  const [order, setOrder] = React.useState<Order>('desc');
  const [orderBy, setOrderBy] = React.useState<string>(defaultSort);
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

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
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

  return (
    <Box 
      sx={{ 
        width: '100%', 
        maxWidth: '85vw'
      }}
    >
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <EnhancedTableToolbar title={title} />
        <TableContainer
          sx={tableContainerSx || {
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
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              headCells={headCells}
              stickyColumnIds={stickyColumnIds}
              stickyRight={stickyRight}
            />
            <TableBody>
              {visibleRows.map((row, index) => {
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <StyledTableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={row.id}
                    sx={{ cursor: 'pointer' }}
                  >
                    {headCells.map((headCell, headIndex) => {
                      const stickyQ = stickyColumnIds.includes(headCell.id);
                      const CellComponent = stickyQ ? StickyTableCell : StyledTableCell;
                      const leftPosition = stickyQ ? headIndex + 1 : 0;
                      const cellValue = row[headCell.id];
                      
                      return (
                        <CellComponent
                          key={headCell.id}
                          align='center'
                          component={headCell.id === 'name' ? 'th' : undefined}
                          id={headCell.id === 'name' ? labelId : undefined}
                          scope={headCell.id === 'name' ? 'row' : undefined}
                          sx={stickyQ ? { position: 'sticky', left: leftPosition, zIndex: 1 } : {}} 
                        >
                          {renderCell ? renderCell(headCell.id, cellValue, row) : cellValue}
                        </CellComponent>
                      );
                    })}
                    {stickyRight && (
                      <StickyTableCell 
                        padding="checkbox" 
                        sx={{ position: 'sticky', right: 0, zIndex: 2 }}
                      >
                        <LongMenu
                          options={menuOptions}
                          onOptionSelect={(option) => onOptionSelect && onOptionSelect(option, row)}
                        />
                      </StickyTableCell>
                    )}
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
