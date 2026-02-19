import React from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Divider,
  Typography,
  Chip,
  Stack,
  Rating,
} from '@mui/material';
import { Clear, Search } from '@mui/icons-material';

const ratingOptions = [5, 4, 3, 2, 1];

const ReviewFilters = ({
  filters,
  onFilterChange,
  onDateRangeChange,
  onClearFilters,
}) => {
  return (
    <Box>
      <Stack spacing={3}>
        {/* Search */}
        <Box>
          <Typography variant="subtitle2" gutterBottom fontWeight={600}>
            Search
          </Typography>
          <TextField
            fullWidth
            placeholder="Search by customer name, review content..."
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
            size="small"
            InputProps={{
              startAdornment: <Search sx={{ fontSize: '1rem', mr: 1, color: 'text.secondary' }} />,
            }}
          />
        </Box>

        <Divider />

        {/* Rating Filter */}
        <Box>
          <Typography variant="subtitle2" gutterBottom fontWeight={600}>
            Rating
          </Typography>
          <FormControl fullWidth size="small">
            <InputLabel>Select Rating</InputLabel>
            <Select
              value={filters.rating}
              label="Select Rating"
              onChange={(e) => onFilterChange('rating', e.target.value)}
            >
              <MenuItem value="">All Ratings</MenuItem>
              {ratingOptions.map((rating) => (
                <MenuItem key={rating} value={rating}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Rating value={rating} readOnly size="small" />
                    <Typography variant="body2">{rating} Stars</Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Divider />

        {/* Date Range */}
        <Box>
          <Typography variant="subtitle2" gutterBottom fontWeight={600}>
            Date Range
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              type="date"
              label="From"
              size="small"
              value={filters.dateRange.start}
              onChange={(e) => onDateRangeChange({ ...filters.dateRange, start: e.target.value })}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <TextField
              type="date"
              label="To"
              size="small"
              value={filters.dateRange.end}
              onChange={(e) => onDateRangeChange({ ...filters.dateRange, end: e.target.value })}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Box>
        </Box>

        <Divider />

        {/* Active Filters */}
        <Box>
          <Typography variant="subtitle2" gutterBottom fontWeight={600}>
            Active Filters
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {filters.search && (
              <Chip
                label={`Search: ${filters.search}`}
                onDelete={() => onFilterChange('search', '')}
                size="small"
              />
            )}
            {filters.rating && (
              <Chip
                label={`${filters.rating} Stars`}
                onDelete={() => onFilterChange('rating', '')}
                size="small"
              />
            )}
            {filters.dateRange.start && (
              <Chip
                label={`From: ${filters.dateRange.start}`}
                onDelete={() => onDateRangeChange({ ...filters.dateRange, start: '' })}
                size="small"
              />
            )}
            {filters.dateRange.end && (
              <Chip
                label={`To: ${filters.dateRange.end}`}
                onDelete={() => onDateRangeChange({ ...filters.dateRange, end: '' })}
                size="small"
              />
            )}
            {!filters.search && !filters.rating && !filters.dateRange.start && !filters.dateRange.end && (
              <Typography variant="caption" color="text.secondary">
                No active filters
              </Typography>
            )}
          </Box>
        </Box>

        <Divider />

        {/* Actions */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            fullWidth
            variant="outlined"
            onClick={onClearFilters}
            startIcon={<Clear />}
          >
            Clear All
          </Button>
        </Box>
      </Stack>
    </Box>
  );
};

export default ReviewFilters;