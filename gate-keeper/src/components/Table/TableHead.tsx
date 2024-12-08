import * as React from 'react';
import Box from '@mui/material/Box';
import TableHead from '@mui/material/TableHead';
import TableSortLabel from '@mui/material/TableSortLabel';
import { visuallyHidden } from '@mui/utils';
import { Order, Data, HeadCell, StyledTableCell, StickyTableCell, StickyTableRow } from './Utils';

interface EnhancedTableProps {
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
    order: Order;
    orderBy: string;
    headCells: readonly HeadCell[];
    stickyColumnIds: string[];
    stickyRight?: boolean;
}
  
export function EnhancedTableHead({
  onRequestSort,
  order,
  orderBy,
  headCells,
  stickyColumnIds = [],
  stickyRight = false,
}: EnhancedTableProps) {
  const createSortHandler =
    (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
  };

  return (
    <TableHead>
      <StickyTableRow>
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
        {
          stickyRight && (
            <StyledTableCell 
              padding="checkbox" 
              align='center'
              sx={{ position: 'sticky', right: 0, zIndex: 1, width: '48px' }}
            >
              {/* Empty cell for alignment with menu */}
            </StyledTableCell>
          )
        }
      </StickyTableRow>
    </TableHead>
  );
}