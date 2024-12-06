import * as React from 'react';
import { useLocation } from 'react-router-dom';
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
  { name: 'Subscriptions', link: '/subscriptions' },
  { name: 'Pricings', link: '/pricings' },
  { name: 'Usage', link: '/usage' },
  { name: 'Settings', link: '/settings' }
];

interface NavbarProps {
  title: string;
}

export default function Navbar({ title }: NavbarProps) {
  const location = useLocation();
  const [anchorElNav, setAnchorElNav] = React.useState<HTMLElement | null>(null);
  const [selectedPage, setSelectedPage] = React.useState<string>(() => {
    const currentPath = location.pathname;
    const currentPage = pages.find(page => page.link === currentPath);
    return currentPage ? currentPage.name : "";
  });

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget as HTMLElement);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleMenuItemClick = (pageName: string) => {
    setSelectedPage(pageName);
    handleCloseNavMenu();
  };

  const handleLogoClick = () => {
    setSelectedPage("");
  };

  return (
    <div className='main--content'>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Container component="div" maxWidth={false} sx={{ minHeight: "100%" }}>
          <Toolbar disableGutters>
            <Logo title={title} onClick={handleLogoClick} />
            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <MobileMenu
                anchorElNav={anchorElNav}
                handleOpenNavMenu={handleOpenNavMenu}
                handleCloseNavMenu={handleCloseNavMenu}
                pages={pages}
                selectedPage={selectedPage} // Pass selected page
                onMenuItemClick={handleMenuItemClick} // Pass click handler
              />
            </Box>
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'flex-end' }}>
              <DesktopMenu
                pages={pages}
                handleCloseNavMenu={handleCloseNavMenu}
                selectedPage={selectedPage} // Pass selected page
                onMenuItemClick={handleMenuItemClick} // Pass click handler
              />
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <Outlet />
    </div>
  );
}