import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

interface DesktopMenuProps {
  pages: { name: string; link: string }[];
  handleCloseNavMenu: () => void;
}

const DesktopMenu: React.FC<DesktopMenuProps> = ({ pages, handleCloseNavMenu }) => (
  <Box sx={{ display: 'flex', gap: 2 }}>
    {pages.map((page) => (
      <Button
        key={page.name}
        component={Link}
        to={page.link}
        onClick={handleCloseNavMenu}
        sx={{ my: 2, color: 'white', display: 'block' }}
      >
        {page.name}
      </Button>
    ))}
  </Box>
);

export default DesktopMenu;