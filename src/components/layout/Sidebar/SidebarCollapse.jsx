import React, { useState, isValidElement } from 'react';
import {
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  alpha,
} from '@mui/material';
import {
  ExpandLess,
  ExpandMore,
  FiberManualRecord,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { Icon } from '@mui/material';

const SidebarCollapse = ({ item, level = 0, open }) => {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = () => {
    setExpanded(!expanded);
  };

  const handleItemClick = (childItem) => {
    navigate(childItem.path);
  };

  const isChildActive = (childItem) => {
    return location.pathname === childItem.path || 
           location.pathname.startsWith(childItem.path + '/');
  };

  const isAnyChildActive = item.children?.some(isChildActive);

  const getIcon = (icon) => {
    if (!icon) return <FiberManualRecord sx={{ fontSize: '0.75rem' }} />;
    if (isValidElement(icon)) return icon;
    if (typeof icon === 'string') {
      return <Icon>{icon}</Icon>;
    }
    const IconComponent = icon;
    return <IconComponent />;
  };

  return (
    <>
      <ListItemButton
        onClick={handleClick}
        sx={{
          minHeight: 48,
          justifyContent: open ? 'initial' : 'center',
          px: 2.5,
          pl: level * 2 + 2.5,
          backgroundColor: isAnyChildActive 
            ? (theme) => alpha(theme.palette.primary.main, 0.1)
            : 'transparent',
          '&:hover': {
            backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.08),
          },
          borderRight: isAnyChildActive ? '3px solid' : 'none',
          borderColor: 'primary.main',
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: 0,
            mr: open ? 3 : 'auto',
            justifyContent: 'center',
            color: isAnyChildActive ? 'primary.main' : 'text.secondary',
          }}
        >
          {getIcon(item.icon)}
        </ListItemIcon>
        <ListItemText 
          primary={item.title} 
          primaryTypographyProps={{
            sx: {
              opacity: open ? 1 : 0,
              color: isAnyChildActive ? 'primary.main' : 'text.primary',
              fontWeight: isAnyChildActive ? 600 : 400,
              fontSize: '0.875rem',
            }
          }}
        />
        {open && (expanded ? <ExpandLess /> : <ExpandMore />)}
      </ListItemButton>

      <Collapse in={expanded && open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {item.children?.map((childItem) => (
            <ListItemButton
              key={childItem.id}
              onClick={() => handleItemClick(childItem)}
              sx={{
                minHeight: 40,
                pl: (level + 1) * 2 + 2.5,
                backgroundColor: isChildActive(childItem)
                  ? (theme) => alpha(theme.palette.primary.main, 0.1)
                  : 'transparent',
                '&:hover': {
                  backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.08),
                },
                borderRight: isChildActive(childItem) ? '3px solid' : 'none',
                borderColor: 'primary.main',
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: 3,
                  justifyContent: 'center',
                  color: isChildActive(childItem) ? 'primary.main' : 'text.secondary',
                }}
              >
                {getIcon(childItem.icon)}
              </ListItemIcon>
              <ListItemText 
                primary={childItem.title} 
                primaryTypographyProps={{
                  sx: {
                    color: isChildActive(childItem) ? 'primary.main' : 'text.primary',
                    fontWeight: isChildActive(childItem) ? 600 : 400,
                    fontSize: '0.875rem',
                  }
                }}
              />
            </ListItemButton>
          ))}
        </List>
      </Collapse>
    </>
  );
};

export default SidebarCollapse;