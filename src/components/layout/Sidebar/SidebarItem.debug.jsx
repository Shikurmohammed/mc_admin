import React from 'react';
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  List,
  Box,
  Typography
} from '@mui/material';
import {
  ExpandLess,
  ExpandMore,
  FiberManualRecord
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const SidebarItemDebug = ({ item, level, expandedItems, onToggle, hasChildren, open, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Debug info
  console.log('=== SidebarItem Debug ===');
  console.log('Item:', item);
  console.log('Current path:', location.pathname);
  console.log('Item path:', item.path);
  console.log('Is match?', location.pathname === item.path);
  console.log('Starts with?', item.path && location.pathname.startsWith(item.path));
  console.log('=======================');

  const isActive = item.path && (
    location.pathname === item.path || 
    (item.path !== '/' && location.pathname.startsWith(item.path))
  );

  const expanded = expandedItems ? !!expandedItems[item.id] : false;

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('🔍 Clicked item:', item.title);
    console.log('🔍 Navigating to:', item.path);
    console.log('🔍 Current location before navigation:', location.pathname);
    
    if (hasChildren) {
      onToggle(item.id);
    }
    
    if (item.path) {
      navigate(item.path);
      console.log('✅ Navigation triggered to:', item.path);
      
      if (onClose) {
        onClose();
      }
    }
  };

  const renderIcon = () => {
    if (!item.icon) {
      return <FiberManualRecord sx={{ fontSize: '0.75rem' }} />;
    }
    const IconComponent = item.icon;
    return <IconComponent />;
  };

  return (
    <>
      <ListItem disablePadding>
        <ListItemButton
          onClick={handleClick}
          sx={{
            minHeight: 48,
            pl: level * 3 + 2,
            backgroundColor: isActive ? 'action.selected' : 'transparent',
            borderLeft: isActive ? 3 : 0,
            borderColor: 'primary.main',
          }}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>
            {renderIcon()}
          </ListItemIcon>
          
          <ListItemText 
            primary={
              <Box>
                <Typography variant="body2">{item.title}</Typography>
                <Typography variant="caption" color="text.secondary">
                  Path: {item.path}
                </Typography>
              </Box>
            }
          />
          
          {hasChildren && (expanded ? <ExpandLess /> : <ExpandMore />)}
        </ListItemButton>
      </ListItem>

      {hasChildren && (
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {item.children.map((child) => (
              <SidebarItemDebug
                key={child.id}
                item={child}
                level={level + 1}
                expandedItems={expandedItems}
                onToggle={onToggle}
                hasChildren={!!child.children}
                open={open}
                onClose={onClose}
              />
            ))}
          </List>
        </Collapse>
      )}
    </>
  );
};

export default SidebarItemDebug;