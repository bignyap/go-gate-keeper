import { alpha } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';

interface EnhancedTableToolbarProps {
    numSelected: number;
    title: React.ReactNode;
}
  
export function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
    const { numSelected, title } = props;
    return (
        <Toolbar
            sx={[
                {
                    pl: { sm: 2 },
                    pr: { xs: 1, sm: 1 },
                },
                numSelected > 0 && {
                    bgcolor: (theme) =>
                      alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                  }
            ]}
        >
            <Typography
                sx={{ flex: '1 1 100%', textAlign: 'left', fontWeight: '600' }}
                variant="h6"
                id="tableTitle"
                component="div"
            >
                {title}
            </Typography>
            {numSelected > 0 ? (
                <Tooltip title="Delete">
                <IconButton>
                    <DeleteIcon />
                </IconButton>
                </Tooltip>
            ) : (
                <Tooltip title="Filter list">
                <IconButton>
                    <FilterListIcon />
                </IconButton>
                </Tooltip>
            )}
        </Toolbar>
    );
}