import React from 'react';
import {
  Paper,
  Box,
  TextField,
  IconButton,
  Tooltip,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Search,
  Close,
  Refresh,
  FilterList
} from '@mui/icons-material';

const UserFilters = ({ 
  filters, 
  onFilterChange, 
  onDateRangeChange, 
  onClearFilters, 
  onRefresh, 
  loading 
}) => {
  return (
    <Paper sx={{ p: 1.5, mb: 2, borderRadius: 1.5 }}>
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          placeholder="Search users..."
          value={filters.search}
          onChange={(e) => onFilterChange('search', e.target.value)}
          size="small"
          sx={{ 
            minWidth: 200,
            '& .MuiInputBase-root': { fontSize: '0.875rem', py: 0 },
            '& .MuiOutlinedInput-input': { py: 0.75 }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ fontSize: '1rem' }} />
              </InputAdornment>
            ),
            endAdornment: filters.search && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => onFilterChange('search', '')}>
                  <Close sx={{ fontSize: '1rem' }} />
                </IconButton>
              </InputAdornment>
            )
          }}
        />

        <FormControl size="small" sx={{ minWidth: 100 }}>
          <InputLabel sx={{ fontSize: '0.875rem' }}>Role</InputLabel>
          <Select
            value={filters.role}
            label="Role"
            onChange={(e) => onFilterChange('role', e.target.value)}
            sx={{ fontSize: '0.875rem', py: 0 }}
          >
            <MenuItem value="" sx={{ fontSize: '0.875rem' }}>All</MenuItem>
            <MenuItem value="ADMIN" sx={{ fontSize: '0.875rem' }}>Admin</MenuItem>
            <MenuItem value="ARTISAN" sx={{ fontSize: '0.875rem' }}>Artisan</MenuItem>
            <MenuItem value="CUSTOMER" sx={{ fontSize: '0.875rem' }}>Customer</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 100 }}>
          <InputLabel sx={{ fontSize: '0.875rem' }}>Status</InputLabel>
          <Select
            value={filters.status}
            label="Status"
            onChange={(e) => onFilterChange('status', e.target.value)}
            sx={{ fontSize: '0.875rem', py: 0 }}
          >
            <MenuItem value="" sx={{ fontSize: '0.875rem' }}>All</MenuItem>
            <MenuItem value="active" sx={{ fontSize: '0.875rem' }}>Active</MenuItem>
            <MenuItem value="inactive" sx={{ fontSize: '0.875rem' }}>Inactive</MenuItem>
          </Select>
        </FormControl>

        <TextField
          type="date"
          label="From"
          size="small"
          value={filters.dateRange.start}
          onChange={(e) => onDateRangeChange({ ...filters.dateRange, start: e.target.value })}
          InputLabelProps={{ shrink: true }}
          sx={{ 
            minWidth: 120,
            '& .MuiInputBase-root': { fontSize: '0.875rem', py: 0 },
            '& .MuiOutlinedInput-input': { py: 0.75 }
          }}
        />

        <TextField
          type="date"
          label="To"
          size="small"
          value={filters.dateRange.end}
          onChange={(e) => onDateRangeChange({ ...filters.dateRange, end: e.target.value })}
          InputLabelProps={{ shrink: true }}
          sx={{ 
            minWidth: 120,
            '& .MuiInputBase-root': { fontSize: '0.875rem', py: 0 },
            '& .MuiOutlinedInput-input': { py: 0.75 }
          }}
        />

        <Box sx={{ flexGrow: 1 }} />

        <Tooltip title="Refresh" arrow>
          <IconButton size="small" onClick={onRefresh} disabled={loading}>
            <Refresh sx={{ fontSize: '1.25rem' }} />
          </IconButton>
        </Tooltip>

        <Tooltip title="Clear filters" arrow>
          <span>
            <IconButton
              size="small"
              onClick={onClearFilters}
              disabled={!filters.search && !filters.role && !filters.status && !filters.dateRange.start && !filters.dateRange.end}
            >
              <FilterList sx={{ fontSize: '1.25rem' }} />
            </IconButton>
          </span>
        </Tooltip>
      </Box>
    </Paper>
  );
};

export default UserFilters;