import React, { useState } from 'react';
import {
  Paper,
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Grid,
} from '@mui/material';
import {
  MoreVert,
  Refresh,
  Download,
  FilterList,
  Timeline,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
} from '@mui/icons-material';
import ExportMenu from '../../dashboard/widgets/ExportMenu';
import LoadingSpinner from '../../common/LoadingSpinner';


const ChartContainer = ({
  title,
  subtitle,
  children,
  filters = [],
  onFilterChange,
  onRefresh,
  exportable = false,
  exportId,
  exportData,
  chartType,
  loading = false,
  sx = {},
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [activeFilters, setActiveFilters] = useState({});

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleFilterChange = (filterKey, value) => {
    const newFilters = { ...activeFilters, [filterKey]: value };
    setActiveFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  return (
    <Paper
      elevation={1}
      sx={{
        p: 3,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        ...sx,
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          {onRefresh && (
            <IconButton size="small" onClick={onRefresh} disabled={loading}>
              <Refresh fontSize="small" />
            </IconButton>
          )}
          
          {exportable && exportId && (
            <ExportMenu
              targetId={exportId}
              data={exportData}
              chartType={chartType}
              fileName={title.toLowerCase().replace(/\s+/g, '-')}
            />
          )}
          
          <IconButton size="small" onClick={handleMenuClick}>
            <MoreVert fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {/* Filters */}
      {filters.length > 0 && (
        <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          {filters.map((filter) => (
            <FormControl key={filter.key} size="small" sx={{ minWidth: 120 }}>
              <InputLabel>{filter.label}</InputLabel>
              <Select
                value={activeFilters[filter.key] || filter.defaultValue || ''}
                label={filter.label}
                onChange={(e) => handleFilterChange(filter.key, e.target.value)}
              >
                {filter.options.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ))}
        </Box>
      )}

      {/* Chart Content */}
      <Box sx={{ flexGrow: 1, position: 'relative' }}>
        {loading ? (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              zIndex: 1,
            }}
          >
            <LoadingSpinner size={40} />
          </Box>
        ) : null}
        {children}
      </Box>

      {/* Footer */}
      <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs>
            <Typography variant="caption" color="text.secondary">
              Last updated: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Typography>
          </Grid>
          <Grid item>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton size="small">
                <Timeline fontSize="small" />
              </IconButton>
              <IconButton size="small">
                <BarChartIcon fontSize="small" />
              </IconButton>
              <IconButton size="small">
                <PieChartIcon fontSize="small" />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Options Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>
          <FilterList sx={{ mr: 2, fontSize: 20 }} />
          Advanced Filters
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Download sx={{ mr: 2, fontSize: 20 }} />
          Export Data
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Refresh sx={{ mr: 2, fontSize: 20 }} />
          Refresh Data
        </MenuItem>
      </Menu>
    </Paper>
  );
};

export default ChartContainer;