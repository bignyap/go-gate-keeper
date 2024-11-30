import React from 'react';
import { Link } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import AdbIcon from '@mui/icons-material/Adb';

interface LogoProps {
  title: string;
}

const Logo: React.FC<LogoProps> = ({ title }) => (
  <>
    <AdbIcon sx={{ display: { xs: 'flex', md: 'flex' }, mr: 1 }} />
    <Typography
      variant="h6"
      noWrap
      component={Link}
      to="/"
      sx={{
        mr: 2,
        display: { xs: 'flex', md: 'flex' },
        fontFamily: 'monospace',
        fontWeight: 700,
        letterSpacing: '.3rem',
        color: 'inherit',
        textDecoration: 'none',
      }}
    >
      {title}
    </Typography>
  </>
);

export default Logo;