import React from 'react';
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  List,
  Box,
  alpha,
  useTheme,
  Icon
} from '@mui/material';
import {
  ExpandLess,
  ExpandMore,
  FiberManualRecord
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const SidebarItem = ({ item, level, expandedItems, onToggle, hasChildren, open }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  
  const isActive = item.path && (
    location.pathname === item.path || 
    (item.path !== '/' && location.pathname.startsWith(item.path))
  );

  const expanded = expandedItems ? !!expandedItems[item.id] : false;

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (hasChildren) {
      onToggle(item.id);
    }
    
    if (item.path) {
      navigate(item.path);
    }
  };

  // SIMPLE FIX: Just render the icon component directly
  const renderIcon = () => {
    if (!item.icon) {
      return <FiberManualRecord sx={{ fontSize: '0.75rem' }} />;
    }

    // Handle string icons (if item.icon is a string name like 'Dashboard')
    if (typeof item.icon === 'string') {
      return <Icon sx={{ fontSize: '1.5rem', color: isActive ? theme.palette.primary.main : theme.palette.text.secondary }}>{item.icon}</Icon>;
    }

    // item.icon is a component from @mui/icons-material
    const IconComponent = item.icon;
    return (
      <IconComponent 
        sx={{ 
          fontSize: '1.5rem',
          color: isActive ? theme.palette.primary.main : theme.palette.text.secondary 
        }} 
      />
    );
  };

  return (
    <>
      <ListItem disablePadding sx={{ display: 'block' }}>
        <ListItemButton
          onClick={handleClick}
          sx={{
            minHeight: 48,
            justifyContent: open ? 'initial' : 'center',
            px: 2.5,
            pl: level * 2 + 2.5,
            backgroundColor: isActive 
              ? alpha(theme.palette.primary.main, 0.1)
              : 'transparent',
            '&:hover': {
              backgroundColor: isActive 
                ? alpha(theme.palette.primary.main, 0.15)
                : alpha(theme.palette.action.hover, 0.1),
            },
            borderRight: isActive ? `3px solid ${theme.palette.primary.main}` : 'none',
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: open ? 3 : 'auto',
              justifyContent: 'center',
            }}
          >
            {renderIcon()}
          </ListItemIcon>
          <ListItemText 
            primary={item.title} 
            primaryTypographyProps={{
              sx: {
                opacity: open ? 1 : 0,
                color: isActive ? theme.palette.primary.main : theme.palette.text.primary,
                fontWeight: isActive ? 600 : 400,
                fontSize: '0.875rem',
              }
            }}
          />
          {hasChildren && open && (
            expanded ? 
              <ExpandLess sx={{ color: theme.palette.text.secondary }} /> : 
              <ExpandMore sx={{ color: theme.palette.text.secondary }} />
          )}
        </ListItemButton>
      </ListItem>
      {hasChildren && (
        <Collapse in={expanded && open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding sx={{ bgcolor: alpha(theme.palette.primary.main, 0.02) }}>
            {item.children.map((child) => (
              <SidebarItem
                key={child.id}
                item={child}
                level={level + 1}
                expandedItems={expandedItems}
                onToggle={onToggle}
                hasChildren={!!child.children}
                open={open}
              />
            ))}
          </List>
        </Collapse>
      )}
    </>
  );
};

export default SidebarItem;