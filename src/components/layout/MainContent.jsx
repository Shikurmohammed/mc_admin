import React from 'react';
import { Box, Toolbar } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { useSidebar } from '../../hooks/useSidebar';

const MainContent = ({ children }) => {
  const { sidebarWidth } = useSidebar();

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        p: 3,
        width: { sm: `calc(100% - ${sidebarWidth}px)` },
        transition: (theme) => theme.transitions.create(['width', 'margin'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        ml: { sm: `${sidebarWidth}px` },
      }}
    >
      <Toolbar />
      {children || <Outlet />}
    </Box>
  );
};

export default MainContent;