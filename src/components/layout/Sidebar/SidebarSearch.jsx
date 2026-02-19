import React, { useState, useEffect, useRef, isValidElement } from 'react';
import {
  TextField,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Divider,
  IconButton,
  InputAdornment,
  alpha,
  Paper,
  Chip,
  CircularProgress,
  Collapse,
  Fade,
  Badge,
  Icon,
} from '@mui/material';
import {
  Search,
  Close,
  History,
  TrendingUp,
  ArrowRight,
  OpenInNew,
  Star,
  Schedule,
  Launch,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { menuService } from '../../../services/menuService';

const SidebarSearch = ({ onSearchSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [popularSearches, setPopularSearches] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showRecent, setShowRecent] = useState(true);
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Load recent and popular searches
  useEffect(() => {
    setRecentSearches(menuService.getRecentSearches());
    setPopularSearches(menuService.getPopularSearches());
  }, []);

  // Handle click outside to close search
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
        setSearchQuery('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Perform search with debounce
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim()) {
        performSearch(searchQuery);
      } else {
        setSearchResults([]);
        setShowRecent(true);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const performSearch = (query) => {
    setIsLoading(true);
    setShowRecent(false);
    
    // Simulate API delay
    setTimeout(() => {
      const results = menuService.search(query);
      setSearchResults(results.menuItems.slice(0, 10)); // Limit to 10 results
      setIsLoading(false);
    }, 200);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim()) {
      menuService.addRecentSearch(query);
      setRecentSearches(menuService.getRecentSearches());
    }
  };

  const handleResultClick = (item) => {
    navigate(item.path);
    setSearchQuery('');
    setSearchResults([]);
    setIsSearchOpen(false);
    onSearchSelect?.();
    
    // Add to recent searches
    menuService.addRecentSearch(item.title);
    setRecentSearches(menuService.getRecentSearches());
  };

  const handleRecentSearchClick = (query) => {
    setSearchQuery(query);
    performSearch(query);
  };

  const clearRecentSearches = () => {
    menuService.clearRecentSearches();
    setRecentSearches([]);
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

  const highlightText = (text, highlight) => {
    if (!highlight || !text) return text;
    
    // Escape special regex characters to prevent crashes
    const escapedHighlight = highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const parts = text.split(new RegExp(`(${escapedHighlight})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === highlight.toLowerCase() ? 
      <span key={i} style={{ backgroundColor: 'yellow', fontWeight: 'bold' }}>{part}</span> : 
      part
    );
  };

  return (
    <Box ref={searchRef} sx={{ position: 'relative', mb: 2, zIndex: 1300 }}>
      <TextField
        fullWidth
        placeholder="Search menu, pages, features..."
        value={searchQuery}
        onChange={(e) => handleSearch(e.target.value)}
        onFocus={() => setIsSearchOpen(true)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search fontSize="small" />
            </InputAdornment>
          ),
          endAdornment: searchQuery && (
            <InputAdornment position="end">
              {isLoading ? (
                <CircularProgress size={16} />
              ) : (
                <IconButton
                  size="small"
                  onClick={() => {
                    setSearchQuery('');
                    setSearchResults([]);
                    setShowRecent(true);
                  }}
                >
                  <Close fontSize="small" />
                </IconButton>
              )}
            </InputAdornment>
          ),
          sx: {
            borderRadius: 2,
            backgroundColor: (theme) => alpha(theme.palette.action.hover, 0.1),
            '&:hover': {
              backgroundColor: (theme) => alpha(theme.palette.action.hover, 0.2),
            },
          },
        }}
        size="small"
      />

      {/* Search Results Dropdown */}
      <Fade in={isSearchOpen}>
        <Paper
          elevation={8}
          sx={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            mt: 1,
            maxHeight: 500,
            overflow: 'auto',
            borderRadius: 2,
            zIndex: 1300,
            display: isSearchOpen ? 'block' : 'none',
            boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
          }}
        >
          {searchQuery ? (
            <>
              {/* Search Results Header */}
              <Box sx={{ p: 2, pb: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Search Results
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'}
                  </Typography>
                </Box>
                <Typography variant="caption" color="text.secondary">
                  Searching for "{searchQuery}"
                </Typography>
              </Box>

              {/* Search Results */}
              {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                  <CircularProgress size={24} />
                </Box>
              ) : searchResults.length > 0 ? (
                <List dense sx={{ py: 0 }}>
                  {searchResults.map((item, index) => (
                    <React.Fragment key={item.id}>
                      <ListItem
                        button
                        onClick={() => handleResultClick(item)}
                        sx={{
                          py: 1.5,
                          '&:hover': {
                            backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.1),
                          },
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          {getIcon(item.icon)}
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Box>
                              <Typography variant="body2" fontWeight={600}>
                                {highlightText(item.title, searchQuery)}
                              </Typography>
                              {item.parentTitle && (
                                <Typography variant="caption" color="text.secondary">
                                  {item.parentTitle} › {item.title}
                                </Typography>
                              )}
                            </Box>
                          }
                          secondary={
                            <Typography variant="caption" color="text.secondary" noWrap>
                              {item.path}
                            </Typography>
                          }
                        />
                        <OpenInNew fontSize="small" sx={{ color: 'text.secondary' }} />
                      </ListItem>
                      {index < searchResults.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Box sx={{ p: 4, textAlign: 'center' }}>
                  <Search sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    No results found for "{searchQuery}"
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Try different keywords or check for typos
                  </Typography>
                </Box>
              )}
            </>
          ) : showRecent && (
            <>
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <>
                  <Box sx={{ p: 2, pb: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="subtitle2" fontWeight={600}>
                        Recent Searches
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={clearRecentSearches}
                        sx={{ fontSize: '0.75rem' }}
                      >
                        Clear all
                      </IconButton>
                    </Box>
                  </Box>
                  <List dense sx={{ py: 0 }}>
                    {recentSearches.map((search, index) => (
                      <React.Fragment key={index}>
                        <ListItem
                          button
                          onClick={() => handleRecentSearchClick(search)}
                          sx={{
                            py: 1.5,
                            '&:hover': {
                              backgroundColor: (theme) => alpha(theme.palette.action.hover, 0.1),
                            },
                          }}
                        >
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            <History fontSize="small" />
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Typography variant="body2">
                                {search}
                              </Typography>
                            }
                          />
                          <ArrowRight fontSize="small" sx={{ color: 'text.secondary' }} />
                        </ListItem>
                        {index < recentSearches.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                </>
              )}

              {/* Popular Searches */}
              <Box sx={{ p: 2, borderTop: recentSearches.length > 0 ? '1px solid' : 'none', borderColor: 'divider' }}>
                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                  Popular Searches
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {popularSearches.map((search, index) => (
                    <Chip
                      key={index}
                      label={search}
                      size="small"
                      icon={<TrendingUp fontSize="small" />}
                      onClick={() => handleRecentSearchClick(search)}
                      sx={{
                        borderRadius: 1,
                        '&:hover': {
                          backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.1),
                        },
                      }}
                    />
                  ))}
                </Box>
              </Box>

              {/* Quick Actions */}
              <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                  Quick Actions
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip
                    label="Go to Dashboard"
                    size="small"
                    onClick={() => navigate('/')}
                    sx={{ borderRadius: 1 }}
                  />
                  <Chip
                    label="Create Event"
                    size="small"
                    onClick={() => navigate('/calendar')}
                    sx={{ borderRadius: 1 }}
                  />
                  <Chip
                    label="View Reports"
                    size="small"
                    onClick={() => navigate('/analytics/reports')}
                    sx={{ borderRadius: 1 }}
                  />
                </Box>
              </Box>
            </>
          )}
        </Paper>
      </Fade>
    </Box>
  );
};

export default SidebarSearch;