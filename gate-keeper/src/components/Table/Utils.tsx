import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

export function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

export type Order = 'asc' | 'desc';

export function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string },
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

export interface Data {
    [key: string]: any;
}
  
export interface HeadCell {
    // disablePadding: boolean;
    id: string;
    label: string;
    // numeric: boolean;
}

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.grey[200],
      color: theme.palette.primary,
      position: 'relative',
      '&::after': {
        content: '""',
        position: 'absolute',
        right: 0,
        top: '25%',
        height: '50%',
        width: '1px',
        backgroundColor: theme.palette.divider,
        opacity: 0.5,
      },
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      maxWidth: '200px',
      position: 'relative',
      '&:hover::after': {
        content: 'attr(data-full-text)',
        position: 'absolute',
        backgroundColor: theme.palette.background.paper,
        padding: '10px',
        borderRadius: '4px',
        boxShadow: theme.shadows[1],
        whiteSpace: 'normal',
        zIndex: 1,
        top: '100%',
        left: 0,
        transform: 'translateY(5px)'
      },
    },
  }));


  export const StickyTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      position: "sticky",
      backgroundColor: theme.palette.grey[200],
      boxShadow: "5px 2px 5px grey",
      zIndex: 1,
      color: theme.palette.primary,
      '&::after': {
        content: '""',
        position: 'absolute',
        right: 0,
        top: '25%',
        height: '50%',
        width: '1px',
        backgroundColor: theme.palette.divider,
        opacity: 0.5,
      },
    },
    [`&.${tableCellClasses.body}`]: {
      position: "sticky",
      backgroundColor: "white",
      boxShadow: "5px 2px 5px grey",
      fontSize: 14,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      maxWidth: '200px',
      zIndex: 1,
      '&:hover::after': {
        content: 'attr(data-full-text)',
        position: 'absolute',
        backgroundColor: theme.palette.background.paper,
        padding: '10px',
        borderRadius: '4px',
        boxShadow: theme.shadows[1],
        whiteSpace: 'normal',
        zIndex: 1,
        top: '100%',
        left: 0,
        transform: 'translateY(5px)',
      },
    },
  }));
  
export const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));

export const StickyTableRow = styled(TableRow)(({ theme }) => ({
    position: 'sticky',
    top: 0,
    zIndex: 2, // Ensure it stays above other rows
    backgroundColor: theme.palette.background.default, // Ensure the background is consistent
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));