import MuiTabPanel from '@mui/lab/TabPanel';
import MuiTab from '@mui/material/Tab';
import MuiTabContext from '@mui/lab/TabContext';
import MuiTabList from '@mui/lab/TabList';
import { styled } from '@mui/material/styles';

export const TabPanel = MuiTabPanel;
export const TabContext = MuiTabContext;

export const TabList = styled(MuiTabList)({
  minHeight: '42px',
  maxHeight: '42px',
  '& .MuiTabs-indicator': {
    borderBottom: '#555770 2px solid',
  },
});

const TAB_HEIGHT_SHORT = '32px';

const tabListStyles = {
  '& .MuiTabs-indicator': {
    borderBottom: '#555770 2px solid',
  },
};

const tabStyles = {
  color: '#8f90a6',
  fontSize: '12px',
  fontWeight: 'bold',
  textTransform: 'none',
  whiteSpace: 'nowrap',
};

export const ShortTabList = styled(MuiTabList)({
  minHeight: TAB_HEIGHT_SHORT,
  maxHeight: TAB_HEIGHT_SHORT,
  '& .MuiTab-root': {
    minHeight: TAB_HEIGHT_SHORT,
    maxHeight: TAB_HEIGHT_SHORT,
    ...tabStyles,
  },
  '& .MuiTabs-flexContainer': {
    '&::before': {
      content: '""',
      margin: 'auto',
    },
    '&::after': {
      content: '""',
      margin: 'auto',
    },
  },
  ...tabListStyles,
});

export const Tab = styled(MuiTab)({
  color: '#8f90a6',
  fontSize: '12px',
  height: 50,
  fontWeight: 'bold',
  textTransform: 'none',
  whiteSpace: 'nowrap',
});
