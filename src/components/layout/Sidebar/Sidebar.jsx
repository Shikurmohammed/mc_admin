import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  Drawer,
  List,
  Divider,
  IconButton,
  useTheme,
  useMediaQuery,
  Box,
} from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import SidebarItem from './SidebarItem';
import SidebarHeader from './SidebarHeader';
import SidebarSearch from './SidebarSearch';
import { drawerWidth, collapsedWidth } from '../../../utils/constants';
import { menuService } from '../../../services/menuService';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = ({ open, onClose }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [expandedItems, setExpandedItems] = useState({});
  const { user } = useAuth();

  // 1. Hooks must always be called at the top level
  const menuItems = useMemo(() => {
    if (!user) return [];
    return menuService.getMenuItems(user?.role || 'CUSTOMER');
  }, [user?.role, user]);

  const handleToggle = useCallback((itemId) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  }, []);

  useEffect(() => {
    // Conditional logic INSIDE the hook is fine
    if (!user || !menuItems.length) return;

    const findParentIds = (items, targetPath, parents = []) => {
      for (const item of items) {
        if (item.path === targetPath) {
          return parents;
        }
        if (item.children) {
          const result = findParentIds(item.children, targetPath, [...parents, item.id]);
          if (result.length > 0) return result;
        }
      }
      return [];
    };

    const parentIds = findParentIds(menuItems, location.pathname);
    if (parentIds.length > 0) {
      setExpandedItems(prev => {
        const newExpanded = { ...prev };
        parentIds.forEach(id => {
          newExpanded[id] = true;
        });
        return newExpanded;
      });
    }
  }, [location.pathname, menuItems, user]);

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
        onClose={isMobile ? onClose : undefined}
      />
    ));
  };

  const handleCloseDrawer = () => {
    if (isMobile) {
      onClose();
    }
  };

  // 2. Early return moved AFTER all hook calls
  if (!user) return null;

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'permanent'}
      open={open}
      onClose={handleCloseDrawer}
      sx={{
        width: open ? drawerWidth : collapsedWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          position: 'relative',
          width: open ? drawerWidth : collapsedWidth,
          boxSizing: 'border-box',
          borderRight: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          overflowX: 'hidden',
        },
      }}
    >
      <SidebarHeader onClose={isMobile ? onClose : undefined} />

      {open && (
        <Box sx={{ px: 2, pt: 2 }}>
          <SidebarSearch onSearchSelect={isMobile ? onClose : undefined} />
        </Box>
      )}

      <Divider sx={{ backgroundColor: theme.palette.divider }} />

      <Box sx={{
        overflow: 'auto',
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
      }}>
        <List component="nav" disablePadding>
          {renderMenuItems(menuItems)}
        </List>
      </Box>

      {!isMobile && (
        <>
          <Divider sx={{ backgroundColor: theme.palette.divider }} />
          <Box sx={{
            p: 2,
            display: 'flex',
            justifyContent: 'flex-end',
            backgroundColor: theme.palette.background.paper,
          }}>
            <IconButton
              onClick={onClose}
              size="small"
              sx={{ color: theme.palette.text.secondary }}
            >
              {theme.direction === 'rtl' ? <ChevronRight /> : <ChevronLeft />}
            </IconButton>
          </Box>
        </>
      )}
    </Drawer>
  );
};

export default Sidebar;
