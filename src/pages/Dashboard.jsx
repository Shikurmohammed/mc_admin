import React from 'react';

import { useState, useEffect } from 'react';
import {
  Grid,
  Box,
  Typography,
  Card,
  CardContent,
  LinearProgress,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  TrendingUp,
  ShoppingCart,
  People,
  Store,
  MonetizationOn,
  Inventory,
  RateReview,
  LocalShipping,
} from '@mui/icons-material';
import PageHeader from '../components/common/PageHeader';
import StatCard from '../components/common/card/StatCard';
import ChartWidget from '../components/dashboard/widgets/ChartWidget';
import RecentActivity from '../components/dashboard/widgets/RecentActivity';
import { useAuth } from '../context/AuthContext';
import { dashboardAPI, ordersAPI, craftsAPI } from '../services/apiService';

const Dashboard = () => {
  const { user, isAdmin, isArtisan, isCustomer } = useAuth();
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');
    try {
      let statsData;
      
      if (isAdmin) {
        statsData = await dashboardAPI.getAdminStats();
      } else if (isArtisan) {
        statsData = await dashboardAPI.getArtisanStats(user.id);
      } else {
        statsData = await dashboardAPI.getCustomerStats(user.id);
      }

      setStats(statsData);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const chartData = [
    { name: 'Jan', sales: 4000, orders: 2400 },
    { name: 'Feb', sales: 3000, orders: 1398 },
    { name: 'Mar', sales: 9800, orders: 2000 },
    { name: 'Apr', sales: 3908, orders: 2780 },
    { name: 'May', sales: 4800, orders: 1890 },
    { name: 'Jun', sales: 3800, orders: 2390 },
    { name: 'Jul', sales: 4300, orders: 3490 },
  ];

  const getWelcomeMessage = () => {
    if (isAdmin) return "Welcome back, Administrator! Here's your overview.";
    if (isArtisan) return `Welcome back, ${user?.firstName}! Manage your crafts and orders.`;
    return `Welcome back, ${user?.firstName}! Browse our handmade crafts.`;
  };

  const getDashboardTitle = () => {
    if (isAdmin) return "Admin Dashboard";
    if (isArtisan) return "Artisan Dashboard";
    return "My Dashboard";
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <PageHeader 
        title={getDashboardTitle()}
        subtitle={getWelcomeMessage()}
      />

      {/* Stats Cards - Role Specific */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Common Stats for all roles */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Orders"
            value={stats.totalOrders || "0"}
            change="+12.5%"
            icon={<ShoppingCart />}
            color="primary"
          />
        </Grid>

        {isAdmin && (
          <>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Total Revenue"
                value={`$${(stats.totalRevenue || 0).toLocaleString()}`}
                change="+8.2%"
                icon={<MonetizationOn />}
                color="success"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Total Users"
                value={stats.totalUsers || "0"}
                change="+5.7%"
                icon={<People />}
                color="info"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Total Crafts"
                value={stats.totalCrafts || "0"}
                change="+3.4%"
                icon={<Store />}
                color="warning"
              />
            </Grid>
          </>
        )}

        {isArtisan && (
          <>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="My Crafts"
                value={stats.myCrafts || "0"}
                change={stats.craftsChange || "+0%"}
                icon={<Inventory />}
                color="info"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Average Rating"
                value={stats.averageRating ? stats.averageRating.toFixed(1) : "0.0"}
                change="+0.2"
                icon={<RateReview />}
                color="warning"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Pending Orders"
                value={stats.pendingOrders || "0"}
                change="-2"
                icon={<LocalShipping />}
                color="error"
              />
            </Grid>
          </>
        )}

        {isCustomer && (
          <>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="My Reviews"
                value={stats.myReviews || "0"}
                change="+1"
                icon={<RateReview />}
                color="info"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Favorite Crafts"
                value={stats.favoriteCrafts || "0"}
                change="+3"
                icon={<TrendingUp />}
                color="warning"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Total Spent"
                value={`$${(stats.totalSpent || 0).toLocaleString()}`}
                change="+$120"
                icon={<MonetizationOn />}
                color="success"
              />
            </Grid>
          </>
        )}
      </Grid>

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Sales Chart - Admin/Artisan */}
        {(isAdmin || isArtisan) && (
          <Grid item xs={12} lg={8}>
            <ChartWidget
              title="Sales Overview"
              data={chartData}
              chartType="area"
              height={400}
            />
          </Grid>
        )}

        {/* Recent Activity - All roles */}
        <Grid item xs={12} lg={isAdmin || isArtisan ? 4 : 8}>
          <RecentActivity
            role={user?.role}
            userId={user?.id}
          />
        </Grid>

        {/* Additional Widgets based on role */}
        {isAdmin && (
          <>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Top Performing Artisans
                  </Typography>
                  {/* Add top artisans list */}
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Popular Categories
                  </Typography>
                  {/* Add categories chart */}
                </CardContent>
              </Card>
            </Grid>
          </>
        )}

        {isArtisan && (
          <>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Craft Performance
                  </Typography>
                  {/* Add craft performance chart */}
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Order Status Distribution
                  </Typography>
                  {/* Add order status chart */}
                </CardContent>
              </Card>
            </Grid>
          </>
        )}

        {isCustomer && (
          <>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Recommended Crafts
                  </Typography>
                  {/* Add recommended crafts */}
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Order History
                  </Typography>
                  {/* Add recent orders */}
                </CardContent>
              </Card>
            </Grid>
          </>
        )}
      </Grid>
    </Box>
  );
};

export default Dashboard;
