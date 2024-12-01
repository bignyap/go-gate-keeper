import * as React from 'react';
import Tabs, { tabsClasses } from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

interface ScrollableTabsButtonAutoProps {
  tabs: string[];
  onTabChange: (newTab: string) => void;
}

export default function ScrollableTabsButtonAuto(
  props: ScrollableTabsButtonAutoProps
) {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    props.onTabChange(props.tabs[newValue]);
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
        value={value}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons
        aria-label="scrollable auto tabs example"
        allowScrollButtonsMobile
        sx={{
          [`& .${tabsClasses.scrollButtons}`]: {
            '&.Mui-disabled': { opacity: 0.3 },
          },
        }}
      >
        {props.tabs.map((tab, index) => (
          <Tab 
            key={index} 
            label={tab}
            sx = {{ 
              fontWeight: 'Bold'
            }} 
          />
        ))}
      </Tabs>
    </Box>
  );
}
