import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Tabs,
  Tab,
  Badge,
  Paper,
  Fab,
  Zoom,
  Drawer,
  IconButton,
  Typography,
  useTheme,
  alpha,
  Chip,
  Button
} from '@mui/material';
import {
  Refresh,
  Download,
  FilterList,
  Close,
  BarChart,
  RateReview,
} from '@mui/icons-material';
import PageHeader from '../components/common/PageHeader';
import ReviewsList from '../components/reviews/ReviewsList';
import ReviewStats from '../components/reviews/ReviewStats';
import ReviewFilters from '../components/reviews/ReviewFilters';
import { reviewsAPI } from '../services/reviewsService';
import { useAuth } from '../context/AuthContext';
import notificationService from '../services/notificationService';

const ReviewsPage = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({});
  const [activeTab, setActiveTab] = useState(0);
  const [filters, setFilters] = useState({
    search: '',
    rating: '',
    craftId: '',
    status: '',
    dateRange: { start: '', end: '' },
  });
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1
  });

  const tabs = [
    { label: 'All Reviews', value: '', count: stats.total || 0 },
    { label: 'Pending', value: 'PENDING', count: stats.pending || 0, color: 'warning' },
    { label: 'Approved', value: 'APPROVED', count: stats.approved || 0, color: 'success' },
    { label: 'Rejected', value: 'REJECTED', count: stats.rejected || 0, color: 'error' },
  ];

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        status: tabs[activeTab].value || filters.status,
        ...(filters.search && { search: filters.search }),
        ...(filters.rating && { rating: filters.rating }),
        ...(filters.craftId && { craftId: filters.craftId }),
        ...(filters.dateRange.start && { startDate: filters.dateRange.start }),
        ...(filters.dateRange.end && { endDate: filters.dateRange.end }),
      };

      const response = await reviewsAPI.getReviews(params);
      
      // Handle different response structures
      const reviewsData = response.data || response.reviews || response || [];
      const total = response.total || response.meta?.total || reviewsData.length;
      const totalPages = response.totalPages || response.meta?.totalPages || Math.ceil(total / pagination.limit);

      setReviews(Array.isArray(reviewsData) ? reviewsData : []);
      setPagination(prev => ({
        ...prev,
        total,
        totalPages
      }));
    } catch (err) {
      notificationService.error(err.response?.data?.message || 'Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await reviewsAPI.getReviewStats();
      setStats(response.data || response || {});
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  useEffect(() => {
    fetchReviews();
    fetchStats();
  }, [pagination.page, pagination.limit, activeTab, filters]);

  useEffect(() => {
    setPagination(prev => ({ ...prev, page: 1 }));
  }, [filters, activeTab]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setFilters(prev => ({ ...prev, status: tabs[newValue].value }));
  };

  const handlePageChange = (event, value) => {
    setPagination(prev => ({ ...prev, page: value }));
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleDateRangeChange = (range) => {
    setFilters(prev => ({ ...prev, dateRange: range }));
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      rating: '',
      craftId: '',
      status: '',
      dateRange: { start: '', end: '' },
    });
    setActiveTab(0);
    notificationService.success('Filters cleared');
  };

  const handleExportReviews = async () => {
    try {
      const response = await reviewsAPI.exportReviews(filters);
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `reviews_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      notificationService.success('Reviews exported successfully');
    } catch (err) {
      notificationService.error('Failed to export reviews');
    }
  };

  const handleReviewAction = async (action, reviewId, data = {}) => {
    try {
      switch (action) {
        case 'approve':
          await reviewsAPI.approveReview(reviewId);
          notificationService.success('Review approved');
          break;
        case 'reject':
          await reviewsAPI.rejectReview(reviewId);
          notificationService.success('Review rejected');
          break;
        case 'delete':
          await reviewsAPI.deleteReview(reviewId);
          notificationService.success('Review deleted');
          break;
        case 'respond':
          await reviewsAPI.respondToReview(reviewId, data);
          notificationService.success('Response added');
          break;
        default:
          break;
      }
      fetchReviews();
      fetchStats();
    } catch (err) {
      notificationService.error(err.response?.data?.message || `Failed to ${action} review`);
    }
  };

  return (
    <Container maxWidth="xl">
      <PageHeader
        title="Reviews Management"
        subtitle="Manage and moderate customer reviews"
        breadcrumbs={true}
        actions={[
          {
            label: 'Export',
            icon: <Download />,
            onClick: handleExportReviews,
            variant: 'outlined',
          },
          {
            label: 'Refresh',
            icon: <Refresh />,
            onClick: fetchReviews,
            variant: 'outlined',
          },
        ]}
      />

      {/* Stats Cards */}
      <ReviewStats stats={stats} />

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
          {filters.rating && (
            <Chip
              label={`${filters.rating} Stars`}
              onDelete={() => handleFilterChange('rating', '')}
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
          <Box sx={{ flexGrow: 1 }} />
          <Typography variant="body2" color="text.secondary">
            {pagination.total} reviews found
          </Typography>
        </Box>
      </Paper>

      {/* Reviews List */}
      <ReviewsList
        reviews={reviews}
        loading={loading}
        userRole={user?.role}
        pagination={pagination}
        onPageChange={handlePageChange}
        onReviewAction={handleReviewAction}
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

        <ReviewFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onDateRangeChange={handleDateRangeChange}
          onClearFilters={() => {
            handleClearFilters();
            setFilterDrawerOpen(false);
          }}
        />
      </Drawer>

      {/* Floating Action Button */}
      <Zoom in={true}>
        <Fab
          color="primary"
          sx={{ position: 'fixed', bottom: 24, right: 24 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <BarChart />
        </Fab>
      </Zoom>
    </Container>
  );
};

export default ReviewsPage;