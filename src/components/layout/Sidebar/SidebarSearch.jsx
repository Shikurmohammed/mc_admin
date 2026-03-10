import React, { useState, useEffect, useRef } from 'react';
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
  Fade,
  ListItemButton,
} from '@mui/material';
import {
  Search,
  Close,
  History,
  TrendingUp,
  ArrowRight,
  OpenInNew,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { menuService } from '../../../services/menuService';

const SidebarSearch = ({ onSearchSelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [recent, setRecent] = useState([]);
  const [popular, setPopular] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const navigate = useNavigate();
  const containerRef = useRef(null);

  /* ---------------- Load initial data ---------------- */

  useEffect(() => {
    setRecent(menuService.getRecentSearches());
    setPopular(menuService.getPopularSearches());
  }, []);

  /* ---------------- Click outside ---------------- */

  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
        setQuery('');
        setResults([]);
        setActiveIndex(-1);
      }
    };

    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  /* ---------------- Debounced Search ---------------- */

  useEffect(() => {
    const delay = setTimeout(() => {
      if (!query.trim()) {
        setResults([]);
        setActiveIndex(-1);
        return;
      }

      performSearch(query);
    }, 300);

    return () => clearTimeout(delay);
  }, [query]);

  const performSearch = async (text) => {
    setLoading(true);
    setActiveIndex(-1);

    // simulate async (replace with API if needed)
    const data = menuService.search(text);
    setResults(data.menuItems.slice(0, 10));
    setLoading(false);
  };

  /* ---------------- Handlers ---------------- */

  const handleSelect = (item) => {
    navigate(item.path);
    menuService.addRecentSearch(item.title);
    setRecent(menuService.getRecentSearches());

    setQuery('');
    setResults([]);
    setOpen(false);
    setActiveIndex(-1);

    onSearchSelect?.();
  };

  const handleRecentClick = (text) => {
    setQuery(text);
  };

  const clearRecent = () => {
    menuService.clearRecentSearches();
    setRecent([]);
  };

  /* ---------------- Keyboard Navigation ---------------- */

  const handleKeyDown = (e) => {
    if (!open) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev < results.length - 1 ? prev + 1 : prev
      );
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : 0));
    }

    if (e.key === 'Enter') {
      if (results[activeIndex]) {
        handleSelect(results[activeIndex]);
      }
    }

    if (e.key === 'Escape') {
      setOpen(false);
      setQuery('');
      setResults([]);
    }
  };

  /* ---------------- Highlight ---------------- */

  const highlight = (text, value) => {
    if (!value) return text;

    const escaped = value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const parts = text.split(new RegExp(`(${escaped})`, 'gi'));

    return parts.map((part, i) =>
      part.toLowerCase() === value.toLowerCase() ? (
        <span key={i} style={{ fontWeight: 600, background: '#ffe58f' }}>
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  /* ===================== UI ===================== */

  return (
    <Box ref={containerRef} sx={{ position: 'relative', mb: 2 }}>
      <TextField
        fullWidth
        size="small"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search fontSize="small" />
            </InputAdornment>
          ),
          endAdornment: query && (
            <InputAdornment position="end">
              {loading ? (
                <CircularProgress size={16} />
              ) : (
                <IconButton
                  size="small"
                  onClick={() => {
                    setQuery('');
                    setResults([]);
                  }}
                >
                  <Close fontSize="small" />
                </IconButton>
              )}
            </InputAdornment>
          ),
          sx: {
            borderRadius: 2,
            backgroundColor: (theme) =>
              alpha(theme.palette.action.hover, 0.1),
          },
        }}
      />

      <Fade in={open}>
        <Paper
          elevation={8}
          sx={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            mt: 1,
            maxHeight: 450,
            overflowY: 'auto',
            borderRadius: 2,
            zIndex: 1300,
          }}
        >
          {/* ========== SEARCH RESULTS ========== */}
          {query ? (
            loading ? (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <CircularProgress size={24} />
              </Box>
            ) : results.length > 0 ? (
              <List dense disablePadding>
                {results.map((item, index) => (
                  <React.Fragment key={item.id}>
                    <ListItem disablePadding>
                      <ListItemButton
                        selected={index === activeIndex}
                        onClick={() => handleSelect(item)}
                        sx={{
                          py: 1,
                          '&.Mui-selected': {
                            backgroundColor: (theme) =>
                              alpha(theme.palette.primary.main, 0.15),
                          },
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <ArrowRight fontSize="small" />
                        </ListItemIcon>

                        <ListItemText
                          primary={highlight(item.title, query)}
                          secondary={item.path}
                          primaryTypographyProps={{
                            variant: 'body2',
                            component: 'div', // 🔥 prevents nested <p>
                          }}
                          secondaryTypographyProps={{
                            variant: 'caption',
                            component: 'div', // 🔥 prevents nested <p>
                          }}
                        />
                        <OpenInNew fontSize="small" />
                      </ListItemButton>
                    </ListItem>
                    {index < results.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  No results found
                </Typography>
              </Box>
            )
          ) : (
            <>
              {/* ========== RECENT ========== */}
              {recent.length > 0 && (
                <>
                  <Box sx={{ p: 2, pb: 1 }}>
                    <Typography variant="subtitle2">
                      Recent Searches
                    </Typography>
                  </Box>
                  <List dense disablePadding>
                    {recent.map((item, i) => (
                      <ListItem key={i} disablePadding>
                        <ListItemButton
                          onClick={() => handleRecentClick(item)}
                        >
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            <History fontSize="small" />
                          </ListItemIcon>
                          <ListItemText primary={item} />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>

                  <Box sx={{ px: 2, pb: 2 }}>
                    <Typography
                      variant="caption"
                      sx={{ cursor: 'pointer' }}
                      onClick={clearRecent}
                    >
                      Clear all
                    </Typography>
                  </Box>
                </>
              )}

              {/* ========== POPULAR ========== */}
              <Box sx={{ p: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Popular
                </Typography>

                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {popular.map((item, i) => (
                    <Chip
                      key={i}
                      size="small"
                      icon={<TrendingUp fontSize="small" />}
                      label={item}
                      onClick={() => handleRecentClick(item)}
                    />
                  ))}
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