import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import { Outlet } from 'react-router-dom';
import Logo from './Logo';
import MobileMenu from './MobileMenu';
import DesktopMenu from './DesktopMenu';

import "../../styles/main.css"

const pages = [
  { name: 'Organizations', link: '/organizations' },
  { name: 'Sub Tiers', link: '/tiers' },
  { name: 'Endpoints', link: '/endpoints' },
  { name: 'Resources', link: '/resources' }
];

interface NavbarProps {
  title: string;
}

export default function Navbar({ title }: NavbarProps) {
  const [anchorElNav, setAnchorElNav] = React.useState<HTMLElement | null>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget as HTMLElement);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <div className='main--content'>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Container component="div" maxWidth={false} sx={{ minHeight: "100%" }}>
          <Toolbar disableGutters>
            <Logo title={title} />
            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <MobileMenu
                anchorElNav={anchorElNav}
                handleOpenNavMenu={handleOpenNavMenu}
                handleCloseNavMenu={handleCloseNavMenu}
                pages={pages}
              />
            </Box>
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'flex-end' }}>
              <DesktopMenu
                pages={pages}
                handleCloseNavMenu={handleCloseNavMenu}
              />
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <Outlet />
    </div>
  );
}