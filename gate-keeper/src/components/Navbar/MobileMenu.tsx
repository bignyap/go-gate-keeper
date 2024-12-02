import React from 'react';
import { Link } from 'react-router-dom';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Typography from '@mui/material/Typography';

interface MobileMenuProps {
  anchorElNav: HTMLElement | null;
  handleOpenNavMenu: (event: React.MouseEvent<HTMLElement>) => void;
  handleCloseNavMenu: () => void;
  pages: { name: string; link: string }[];
  selectedPage: string; // Add selectedPage prop
  onMenuItemClick: (pageName: string) => void; // Add click handler prop
}

const MobileMenu: React.FC<MobileMenuProps> = ({ anchorElNav, handleOpenNavMenu, handleCloseNavMenu, pages, selectedPage, onMenuItemClick }) => (
  <div>
    <IconButton
      size="large"
      aria-label="account of current user"
      aria-controls="menu-appbar"
      aria-haspopup="true"
      onClick={handleOpenNavMenu}
      color="inherit"
    >
      <MenuIcon />
    </IconButton>
    <Menu
      id="menu-appbar"
      anchorEl={anchorElNav}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      open={Boolean(anchorElNav)}
      onClose={handleCloseNavMenu}
      sx={{
        display: { xs: 'block', md: 'none' },
      }}
    >
      {pages.map((page) => (
        <MenuItem
          key={page.name}
          component={Link}
          to={page.link}
          onClick={() => {
            onMenuItemClick(page.name);
            handleCloseNavMenu();
          }}
          sx={{
            backgroundColor: selectedPage === page.name ? 'primary.light' : 'inherit',
          }}
        >
          <Typography textAlign="center">{page.name}</Typography>
        </MenuItem>
      ))}
    </Menu>
  </div>
);

export default MobileMenu;