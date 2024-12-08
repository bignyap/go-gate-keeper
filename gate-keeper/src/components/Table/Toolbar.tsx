import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

interface EnhancedTableToolbarProps {
    title: React.ReactNode;
}
  
export function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
    const { title } = props;
    return (
        <Toolbar
            sx={[
                {
                    pl: { sm: 2 },
                    pr: { xs: 1, sm: 1 },
                },
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
        </Toolbar>
    );
}