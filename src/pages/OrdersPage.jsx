import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Tabs,
  Tab,
  Badge,
  Paper,
  useTheme,
  alpha,
  Fab,
  Zoom,
  Button,
  Drawer,
  IconButton,
  Typography,
  Chip
} from '@mui/material';
import {
  FilterList,
  Refresh,
  Download,
  Add,
  Close
} from '@mui/icons-material';
import PageHeader from '../components/common/PageHeader';
import OrdersTable from '../components/orders/OrdersTable';
import OrderStats from '../components/orders/OrderStats';
import OrdersFilter from '../components/orders/OrdersFilter';
import { useAuth } from '../context/AuthContext';
import { ordersAPI } from '../services/ordersService';
import notificationService from '../services/notificationService';

const OrdersPage = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({});
  const [filters, setFilters] = useState({
    status: '',
    search: '',
    dateRange: { start: '', end: '' },
    paymentMethod: '',
  });
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [pagination, setPagination] = useState({
    page: 0,
    rowsPerPage: 10,
    total: 0
  });

  const tabs = [
    { label: 'All Orders', value: '', count: stats.total || 0 },
    { label: 'Pending', value: 'PENDING', count: stats.pending || 0, color: 'warning' },
    { label: 'Processing', value: 'PROCESSING', count: stats.processing || 0, color: 'info' },
    { label: 'Shipped', value: 'SHIPPED', count: stats.shipped || 0, color: 'primary' },
    { label: 'Delivered', value: 'DELIVERED', count: stats.delivered || 0, color: 'success' },
    { label: 'Cancelled', value: 'CANCELLED', count: stats.cancelled || 0, color: 'error' },
  ];

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const rawParams = {
        page: pagination.page + 1,
        limit: pagination.rowsPerPage,
        // Only set status if it's not the "All" tab (index 0)
        status: activeTab === 0 ? undefined : tabs[activeTab].value,
        search: filters.search || undefined,
      };

      // Filter out undefined/empty keys so they aren't sent in the URL
      const cleanParams = Object.fromEntries(
        Object.entries(rawParams).filter(([_, v]) => v != null && v !== '')
      );

      let response;
      if (user?.role === 'ADMIN') {
        response = await ordersAPI.getOrders(cleanParams);
      } else if (user?.role === 'ARTISAN') {
        response = await ordersAPI.getArtisanOrders(cleanParams);
      } else {
        response = await ordersAPI.getUserOrders(cleanParams);
      }

      // Handle response structure
      const ordersData = response.data || response.orders || response || [];
      const total = response.total || response.meta?.total || response.pagination?.total || ordersData.length;

      setOrders(Array.isArray(ordersData) ? ordersData : []);
      setPagination(prev => ({ ...prev, total }));
    } catch (err) {
      notificationService.error(err.response?.data?.message || err.message || err || 'Failed to load orders');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await ordersAPI.getOrderStatistics();
      setStats(response.data || response || {});
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchStats();
  }, [pagination.page, pagination.rowsPerPage, activeTab, filters]);

  useEffect(() => {
    setPagination(prev => ({ ...prev, page: 0 }));
  }, [filters, activeTab]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setFilters(prev => ({ ...prev, status: tabs[newValue].value }));
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleRowsPerPageChange = (value) => {
    setPagination({ page: 0, rowsPerPage: value, total: pagination.total });
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleDateRangeChange = (range) => {
    setFilters(prev => ({ ...prev, dateRange: range }));
  };

  const handleClearFilters = () => {
    setFilters({
      status: '',
      search: '',
      dateRange: { start: '', end: '' },
      paymentMethod: '',
    });
    setActiveTab(0);
    notificationService.success('Filters cleared');
  };

  const handleExportOrders = async () => {
    try {
      const response = await ordersAPI.exportOrders(filters);
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `orders_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      notificationService.success('Orders exported successfully');
    } catch (err) {
      notificationService.error('Failed to export orders');
    }
  };

  return (
    <Container maxWidth="xl">
      <PageHeader
        title="Orders Management"
        subtitle="Manage and track all orders efficiently"
        breadcrumbs={true}
        actions={[
          {
            label: 'Export',
            icon: <Download />,
            onClick: handleExportOrders,
            variant: 'outlined',
          },
          {
            label: 'Refresh',
            icon: <Refresh />,
            onClick: fetchOrders,
            variant: 'outlined',
          },
        ]}
      />

      {/* Stats Cards */}
      <OrderStats stats={stats} />

      {/* Tabs with Counts */}
      <Paper sx={{ mb: 3, borderRadius: 2 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root': { minHeight: 56 },
              '& .MuiTab-label': { display: 'flex', alignItems: 'center', gap: 1 }
            }}
          >
            {tabs.map((tab, index) => (
              <Tab
                key={index}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {tab.label}
                    {tab.count > 0 && (
                      <Badge
                        badgeContent={tab.count}
                        color={tab.color || 'primary'}
                        sx={{
                          '& .MuiBadge-badge': {
                            fontSize: '0.7rem',
                            height: 18,
                            minWidth: 18,
                          }
                        }}
                      />
                    )}
                  </Box>
                }
              />
            ))}
          </Tabs>
        </Box>

        {/* Quick Filter Bar */}
        <Box sx={{ p: 2, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            startIcon={<FilterList />}
            onClick={() => setFilterDrawerOpen(true)}
            size="small"
          >
            Advanced Filters
          </Button>
          {filters.search && (
            <Chip
              label={`Search: ${filters.search}`}
              onDelete={() => handleFilterChange('search', '')}
              size="small"
            />
          )}
          {filters.dateRange.start && (
            <Chip
              label={`From: ${filters.dateRange.start}`}
              onDelete={() => handleDateRangeChange({ start: '', end: filters.dateRange.end })}
              size="small"
            />
          )}
          {filters.dateRange.end && (
            <Chip
              label={`To: ${filters.dateRange.end}`}
              onDelete={() => handleDateRangeChange({ start: filters.dateRange.start, end: '' })}
              size="small"
            />
          )}
          {filters.paymentMethod && (
            <Chip
              label={`Payment: ${filters.paymentMethod}`}
              onDelete={() => handleFilterChange('paymentMethod', '')}
              size="small"
            />
          )}
          <Box sx={{ flexGrow: 1 }} />
          <Typography variant="body2" color="text.secondary">
            {pagination.total} orders found
          </Typography>
        </Box>
      </Paper>

      {/* Orders Table */}
      <OrdersTable
        orders={orders}
        loading={loading}
        userRole={user?.role}
        pagination={pagination}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        onRefresh={fetchOrders}
      />

      {/* Filter Drawer */}
      <Drawer
        anchor="right"
        open={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: { xs: '100%', sm: 400 },
            p: 3,
            bgcolor: 'background.paper',
          }
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" fontWeight={600}>
            Advanced Filters
          </Typography>
          <IconButton onClick={() => setFilterDrawerOpen(false)} size="small">
            <Close />
          </IconButton>
        </Box>

        <OrdersFilter
          filters={filters}
          onFilterChange={handleFilterChange}
          onDateRangeChange={handleDateRangeChange}
          onClearFilters={() => {
            handleClearFilters();
            setFilterDrawerOpen(false);
          }}
        />
      </Drawer>

      {/* Floating Action Button for Quick Actions */}
      <Zoom in={true}>
        <Fab
          color="primary"
          sx={{ position: 'fixed', bottom: 24, right: 24 }}
          onClick={() => console.log('Quick actions')}
        >
          <Add />
        </Fab>
      </Zoom>
    </Container>
  );
};

export default OrdersPage;