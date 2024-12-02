import * as React from 'react';
import Box from '@mui/material/Box';
// import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
// import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Checkbox from '@mui/material/Checkbox';
import { visuallyHidden } from '@mui/utils';
import { Order, Data, HeadCell, StyledTableCell, StyledTableRow, StickyTableCell, StickyTableRow } from './Utils';

interface EnhancedTableProps {
    numSelected: number;
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
    onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
    order: Order;
    orderBy: string;
    rowCount: number;
    headCells: readonly HeadCell[];
    stickyColumnIds: string[];
}
  
export function EnhancedTableHead({
  numSelected,
  onRequestSort,
  onSelectAllClick,
  order,
  orderBy,
  rowCount,
  headCells,
  stickyColumnIds = [],
}: EnhancedTableProps) {
  const createSortHandler =
    (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
  };

  const CheckboxCellType = stickyColumnIds.length > 0 ? StickyTableCell : StyledTableCell;

  return (
    <TableHead>
      <StickyTableRow>
        <CheckboxCellType 
          padding="checkbox" 
          align='center'
          sx={{ position: 'sticky', left: 0, zIndex: 1 }} // Ensure sticky positioning
        >
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all',
            }}
          />
        </CheckboxCellType>
        {headCells.map((headCell, index) => {
          const TableCellComponent = stickyColumnIds.includes(headCell.id) ? StickyTableCell : StyledTableCell;
          return (
            <TableCellComponent
              key={headCell.id}
              align='center'
              sortDirection={orderBy === headCell.id ? order : false}
              sx={{ 
                padding: '8px', 
                position: stickyColumnIds.includes(headCell.id) ? 'sticky' : 'static', 
                left: stickyColumnIds.includes(headCell.id) ? index + 1 : 'auto', 
                zIndex: stickyColumnIds.includes(headCell.id) ? 1 : 'auto' 
              }}
            >
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
                sx={{ fontWeight: '550' }}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </Box>
                ) : null}
              </TableSortLabel>
            </TableCellComponent>
          );
        })}
      </StickyTableRow>
    </TableHead>
  );
}