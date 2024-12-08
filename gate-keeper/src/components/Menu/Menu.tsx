import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';

interface LongMenuProps {
    options?: string[];
    onOptionSelect?: (option: string) => void;
  }
  
const defaultOptions = [
    'View',
    'Edit',
    'Delete',
    'Archive'
];

const ITEM_HEIGHT = 48;
  
export default function LongMenu({ options = defaultOptions, onOptionSelect }: LongMenuProps) {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = (option?: string) => {
    setAnchorEl(null);
    if (option && onOptionSelect) {
        onOptionSelect(option);
    }
    };

    return (
    <div>
        <IconButton
            aria-label="more"
            id="long-button"
            aria-controls={open ? 'long-menu' : undefined}
            aria-expanded={open ? 'true' : undefined}
            aria-haspopup="true"
            onClick={handleClick}
        >
            <MoreVertIcon />
        </IconButton>
        <Menu
            id="long-menu"
            MenuListProps={{
                'aria-labelledby': 'long-button',
            }}
            anchorEl={anchorEl}
            open={open}
            onClose={() => handleClose()}
            slotProps={{
                paper: {
                style: {
                    maxHeight: ITEM_HEIGHT * 4.5,
                    width: '20ch',
                },
                },
            }}
        >
            {options.map((option) => (
                <MenuItem key={option} onClick={() => handleClose(option)}>
                {option}
                </MenuItem>
            ))}
        </Menu>
    </div>
    );
}
