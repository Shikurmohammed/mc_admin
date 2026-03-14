import React, { useState, useEffect, useRef, isValidElement } from 'react';
import LanguageSwitcher from '../../common/LanguageSwitcher';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  InputBase,
  alpha,
  Tooltip,
  ClickAwayListener,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  CircularProgress,
  Fade,
  Icon,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  Brightness4,
  Brightness7,
  Person,
  Settings,
  Logout,
  Close,
  ArrowRight,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useThemeMode } from '../../../context/ThemeContext';
import { useMessages } from '../../../context/MessageContext'; // Import useMessages
import NotificationBell from './NotificationBell';
import { menuService } from '../../../services/menuService';
import MessagesDropdown from './MessagesDropdown';
import { Chat as ChatIcon } from '@mui/icons-material';

const Header = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const { mode, toggleTheme } = useThemeMode();
  const navigate = useNavigate();
  
  // Get unreadCount from MessageContext
  const { unreadCount, connectionStatus } = useMessages(); // Add connectionStatus for debugging

  const [anchorEl, setAnchorEl] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);

  useEffect(() => {
    setRecentSearches(menuService.getRecentSearches());
  }, []);

  const handleProfileMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleProfileMenuClose = () => setAnchorEl(null);

  const [messagesAnchorEl, setMessagesAnchorEl] = useState(null);

  // Add handlers:
  const handleMessagesClick = (event) => {
    setMessagesAnchorEl(event.currentTarget);
    // Navigate to messages page on click (optional)
    // navigate('/dashboard/messages');
  };

  const handleMessagesClose = () => {
    setMessagesAnchorEl(null);
  };

  // Debounce search to prevent race conditions and improve performance
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchValue.trim()) {
        setIsSearching(true);
        const results = menuService.search(searchValue);
        setSearchResults(results.menuItems.slice(0, 5));
        setIsSearching(false);
      } else {
        setSearchResults([]);
        setIsSearching(false);
      }
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchValue]);

  const handleSearchResultClick = (item) => {
    navigate(item.path);
    setSearchValue('');
    setShowSearchResults(false);
    menuService.addRecentSearch(item.title);
    setRecentSearches(menuService.getRecentSearches());
  };

  const handleLogout = () => {
    logout();
    handleProfileMenuClose();
  };

  const getIcon = (icon) => {
    if (!icon) return <ArrowRight fontSize="small" />;
    if (isValidElement(icon)) return icon;
    if (typeof icon === 'string') {
      return <Icon fontSize="small">{icon}</Icon>;
    }
    const IconComponent = icon;
    return <IconComponent fontSize="small" />;
  };

  const handleMenuClick = (path) => {
    handleProfileMenuClose();
    navigate(path);
  };

  // Debug log to see unread count updates
  useEffect(() => {
    console.log('🔔 Header unreadCount updated:', unreadCount);
  }, [unreadCount]);

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backdropFilter: 'blur(8px)',
        borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
        boxShadow: 'none',
        backgroundColor: (theme) => alpha(theme.palette.background.paper, 0.9),
        color: 'text.primary'
      }}
    >
      <Toolbar>
        <IconButton color="inherit" edge="start" onClick={onMenuClick} sx={{ mr: 2 }}>
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" noWrap sx={{ display: { xs: 'none', sm: 'block' }, mr: 4 }}>
          Dashboard
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        
        {/* Global Search */}
        <ClickAwayListener onClickAway={() => setShowSearchResults(false)}>
          <Box sx={{ position: 'relative', flexGrow: 1, maxWidth: 600, mr: 2 }}>
            <Box sx={{
              position: 'relative',
              borderRadius: 2,
              backgroundColor: (theme) => alpha(theme.palette.action.hover, 0.05),
              border: '1px solid transparent',
              display: 'flex',
              alignItems: 'center',
              px: 2,
              ...(showSearchResults && { borderColor: 'primary.main', bgcolor: 'background.paper' })
            }}>
              <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
              <InputBase
                placeholder="Search anything..."
                fullWidth
                value={searchValue}
                onChange={(e) => {
                  setSearchValue(e.target.value);
                  if (e.target.value.trim()) setShowSearchResults(true);
                }}
                onFocus={() => searchValue.trim() && setShowSearchResults(true)}
              />
              {isSearching && <CircularProgress size={16} />}
            </Box>

            <Fade in={showSearchResults}>
              <Paper sx={{ position: 'absolute', top: '100%', left: 0, right: 0, mt: 1, zIndex: 10 }}>
                <List dense>
                  {searchResults.map((item) => (
                    <ListItem button key={item.id} onClick={() => handleSearchResultClick(item)}>
                      <ListItemIcon>{getIcon(item.icon)}</ListItemIcon>
                      <ListItemText primary={item.title} secondary={item.path} />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Fade>
          </Box>
        </ClickAwayListener>

        {/* Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={toggleTheme} color="inherit">
            {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
          </IconButton>

          {/* Messages Icon with Real-time Unread Count */}
          <Tooltip title="Messages">
            <IconButton 
              onClick={handleMessagesClick} 
              color="inherit"
              sx={{ position: 'relative' }}
            >
              <Badge 
                badgeContent={unreadCount} 
                color="error"
                max={99}
                sx={{
                  '& .MuiBadge-badge': {
                    animation: unreadCount > 0 ? 'pulse 2s infinite' : 'none',
                  }
                }}
              >
                <ChatIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* Connection Status Indicator (Optional - for debugging) */}
          {connectionStatus !== 'connected' && (
            <Tooltip title={`Connection: ${connectionStatus}`}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: connectionStatus === 'connected' ? 'success.main' : 
                          connectionStatus === 'connecting' ? 'warning.main' : 'error.main',
                  ml: 0.5
                }}
              />
            </Tooltip>
          )}

          <MessagesDropdown
            anchorEl={messagesAnchorEl}
            open={Boolean(messagesAnchorEl)}
            onClose={handleMessagesClose}
          />

          {/* Notification Bell */}
          <NotificationBell />

          <Tooltip title="Account settings">
            <IconButton onClick={handleProfileMenuOpen} sx={{ ml: 1 }}>
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                {user?.firstName?.charAt(0) || user?.email?.charAt(0) || 'U'}
              </Avatar>
            </IconButton>
          </Tooltip>
        </Box>

        {/* Profile Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleProfileMenuClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem onClick={() => handleMenuClick('/dashboard/profile')}>
            <ListItemIcon><Person fontSize="small" /></ListItemIcon> Profile
          </MenuItem>
          <MenuItem onClick={() => handleMenuClick('/dashboard/settings')}>
            <ListItemIcon><Settings fontSize="small" /></ListItemIcon> Settings
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout}>
            <ListItemIcon><Logout fontSize="small" color="error" /></ListItemIcon>
            <Typography color="error">Logout</Typography>
          </MenuItem>
        </Menu>
        <LanguageSwitcher variant="icon" size="small" />
      </Toolbar>

      {/* Add pulse animation for unread count */}
      <style>
        {`
          @keyframes pulse {
            0% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.1);
            }
            100% {
              transform: scale(1);
            }
          }
        `}
      </style>
    </AppBar>
  );
};

export default Header;