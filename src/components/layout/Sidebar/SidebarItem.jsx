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
  Tooltip
} from '@mui/material';
import {
  ExpandLess,
  ExpandMore,
  FiberManualRecord
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const SidebarItem = ({
  item,
  level,
  expandedItems,
  onToggle,
  hasChildren,
  open,
  onClose
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  // More precise active state detection
  const isActive = React.useMemo(() => {
    if (!item.path) return false;

    // Exact match
    if (location.pathname === item.path) return true;

    // Check if it's a parent route (e.g., /dashboard/orders matches /dashboard/orders/pending)
    if (item.path !== '/' && location.pathname.startsWith(item.path + '/')) return true;

    // Special case for dashboard home
    if (item.path === '/dashboard' && location.pathname === '/dashboard') return true;

    return false;
  }, [location.pathname, item.path]);

  const expanded = expandedItems ? !!expandedItems[item.id] : false;

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (hasChildren) {
      onToggle(item.id);
    }

    if (item.path) {
      console.log(`Navigating to: ${item.path}`);
      navigate(item.path);

      // Close sidebar on mobile after navigation
      if (onClose) {
        onClose();
      }
    }
  };

  const renderIcon = () => {
    if (!item.icon) {
      return <FiberManualRecord sx={{ fontSize: '0.75rem' }} />;
    }

    // Handle icon component
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

  // For closed sidebar, show tooltip on hover
  const renderListItem = () => {
    const content = (
      <ListItemButton
        onClick={handleClick}
        sx={{
          minHeight: 48,
          justifyContent: open ? 'initial' : 'center',
          px: 2.5,
          pl: open ? level * 3 + 2.5 : 2.5,
          backgroundColor: isActive
            ? alpha(theme.palette.primary.main, 0.1)
            : 'transparent',
          '&:hover': {
            backgroundColor: isActive
              ? alpha(theme.palette.primary.main, 0.15)
              : alpha(theme.palette.action.hover, 0.1),
          },
          borderRight: isActive ? `3px solid ${theme.palette.primary.main}` : 'none',
          transition: 'all 0.2s',
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
            component: 'div', // 🔥 prevents nested <p> issues
            sx: {
              opacity: open ? 1 : 0,
              color: isActive ? theme.palette.primary.main : theme.palette.text.primary,
              fontWeight: isActive ? 600 : 400,
              fontSize: '0.875rem',
              whiteSpace: 'nowrap',
            },
          }}
        />

        {hasChildren && open && (
          expanded ?
            <ExpandLess sx={{ color: theme.palette.text.secondary }} /> :
            <ExpandMore sx={{ color: theme.palette.text.secondary }} />
        )}
      </ListItemButton>
    );

    // Wrap with Tooltip when sidebar is closed
    if (!open) {
      return (
        <Tooltip title={item.title} placement="right">
          {content}
        </Tooltip>
      );
    }

    return content;
  };

  return (
    <>
      <ListItem disablePadding sx={{ display: 'block' }}>
        {renderListItem()}
      </ListItem>

      {hasChildren && (
        <Collapse in={expanded && open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {item.children.map((child) => (
              <SidebarItem
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

export default SidebarItem;