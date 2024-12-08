import * as React from 'react';
import Tabs, { tabsClasses } from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { NavLink } from 'react-router-dom';

interface TabItem {
  label: string;
  value: string;
}

interface ScrollableTabsButtonAutoProps {
  tabs: TabItem[];
  onTabChange: (newTab: string) => void;
  initialIndex?: number;
}

export default function ScrollableTabsButtonAuto(
  props: ScrollableTabsButtonAutoProps
) {
  const [value, setValue] = React.useState(props.initialIndex || 0);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    const newIndex = props.tabs.findIndex(tab => tab.value === newValue);
    if (newIndex !== value) {
      setValue(newIndex);
      props.onTabChange(newValue);
    }
  };

  return (
    <Box 
      sx={{
        flexGrow: 1,
        maxWidth: { xs: '100%', md: '800px' },
        width: '100%',
        bgcolor: 'background.paper',
        height: 'auto',
      }}
    >
      <Tabs
        value={props.tabs[value]?.value || ''}
        onChange={handleChange}
        variant="standard" // Change to 'standard' to remove scroll buttons
        aria-label="scrollable auto tabs example"
        sx={{
          justifyContent: 'flex-start', // Align tabs to the left
          [`& .${tabsClasses.scrollButtons}`]: {
            display: 'none', // Hide scroll buttons
          },
        }}
      >
        {props.tabs.map((tab, index) => (
          <Tab 
            key={index} 
            label={
              <NavLink 
                to={`/settings/${tab.value}`} 
                style={{ textDecoration: 'none', color: 'inherit' }}
                className={({ isActive }) => isActive ? 'active-tab' : ''}
              >
                {tab.label}
              </NavLink>
            }
            value={tab.value}
            sx={{ fontWeight: 'Bold' }} 
          />
        ))}
      </Tabs>
    </Box>
  );
}