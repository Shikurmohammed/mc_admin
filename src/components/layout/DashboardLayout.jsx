import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Box, CssBaseline, Toolbar, useTheme, useMediaQuery } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Header from './Header/Header';
import Sidebar from './Sidebar/Sidebar';
import { drawerWidth } from '../../utils/constants';

const DashboardLayout = () => {
  //
  const location = useLocation();

  // Log all navigation attempts
  React.useEffect(() => {
    console.log('📍 Current location:', location.pathname);
  }, [location]);
  //
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarClose = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      <Header onMenuClick={handleSidebarToggle} />
      <Sidebar open={sidebarOpen} onClose={handleSidebarToggle} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          minWidth: 0, // 🔥 IMPORTANT FIX
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default DashboardLayout;