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
} from '@mui/material';
import { Clear, Search } from '@mui/icons-material';

const paymentMethods = [
  'Credit Card',
  'PayPal',
  'Bank Transfer',
  'Cash on Delivery',
];

const OrdersFilter = ({
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
            placeholder="Order #, customer name, email..."
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
            size="small"
            InputProps={{
              startAdornment: <Search sx={{ fontSize: '1rem', mr: 1, color: 'text.secondary' }} />,
            }}
          />
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

        {/* Payment Method */}
        <Box>
          <Typography variant="subtitle2" gutterBottom fontWeight={600}>
            Payment Method
          </Typography>
          <FormControl fullWidth size="small">
            <InputLabel>Select Payment Method</InputLabel>
            <Select
              value={filters.paymentMethod}
              label="Select Payment Method"
              onChange={(e) => onFilterChange('paymentMethod', e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              {paymentMethods.map((method) => (
                <MenuItem key={method} value={method}>
                  {method}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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
            {filters.paymentMethod && (
              <Chip
                label={`Payment: ${filters.paymentMethod}`}
                onDelete={() => onFilterChange('paymentMethod', '')}
                size="small"
              />
            )}
            {!filters.search && !filters.dateRange.start && !filters.dateRange.end && !filters.paymentMethod && (
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

export default OrdersFilter;