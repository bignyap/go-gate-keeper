import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

interface DesktopMenuProps {
  pages: { name: string; link: string }[];
  handleCloseNavMenu: () => void;
  selectedPage: string; // Add selectedPage prop
  onMenuItemClick: (pageName: string) => void; // Add click handler prop
}

const DesktopMenu: React.FC<DesktopMenuProps> = ({ pages, handleCloseNavMenu, selectedPage, onMenuItemClick }) => (
  <Box sx={{ display: 'flex', gap: 2 }}>
    {pages.map((page) => (
      <Button
        key={page.name}
        component={Link}
        to={page.link}
        onClick={() => {
          onMenuItemClick(page.name);
          handleCloseNavMenu();
        }}
        sx={{
          my: 2,
          color: 'white',
          display: 'block',
          boxShadow: selectedPage === page.name ? 1 : 0,
        }}
      >
        {page.name}
      </Button>
    ))}
  </Box>
);

export default DesktopMenu;