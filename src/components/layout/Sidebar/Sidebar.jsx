import React, { useState, useMemo } from 'react';
import {
  Drawer,
  List,
  Divider,
  IconButton,
  useTheme,
  useMediaQuery,
  Box
} from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import SidebarItem from './SidebarItem';
import SidebarHeader from './SidebarHeader';
import SidebarSearch from './SidebarSearch';
import { drawerWidth } from '../../../utils/constants';
import { menuService } from '../../../services/menuService';
import { useAuth } from '../../../context/AuthContext';

const Sidebar = ({ open, onClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [expandedItems, setExpandedItems] = useState({});
  const { user } = useAuth();

  const menuItems = useMemo(() => {
    return menuService.getMenuItems(user?.role || 'CUSTOMER');
  }, [user?.role]);

  if (!user) return null;

  const handleToggle = (itemId) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const renderMenuItems = (items, level = 0) => {
    return items.map((item) => (
      <SidebarItem
        key={item.id}
        item={item}
        level={level}
        expandedItems={expandedItems}
        onToggle={handleToggle}
        hasChildren={!!item.children}
        open={open}
      />
    ));
  };

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'persistent'}
      open={open}
      onClose={onClose}
      sx={{
        width: open ? drawerWidth : 0,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          borderRight: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        },
      }}
    >
      <SidebarHeader onClose={onClose} />
      {open && (
        <Box sx={{ px: 2, pt: 2 }}>
          <SidebarSearch onSearchSelect={isMobile ? onClose : undefined} />
        </Box>
      )}
      <Divider sx={{ backgroundColor: theme.palette.divider }} />
      <Box sx={{ 
        overflow: 'auto',
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
      }}>
        <List component="nav" disablePadding>
          {renderMenuItems(menuItems)}
        </List>
      </Box>
      <Box sx={{ flexGrow: 1 }} />
      <Box sx={{ 
        p: 2, 
        display: 'flex', 
        justifyContent: 'flex-end',
        borderTop: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.paper,
      }}>
        <IconButton onClick={onClose} size="small" sx={{ color: theme.palette.text.secondary }}>
          {theme.direction === 'rtl' ? <ChevronRight /> : <ChevronLeft />}
        </IconButton>
      </Box>
    </Drawer>
  );
};

export default Sidebar;