import React from 'react';
import { Grid, Box } from '@mui/material';
import StatWidget from './StatWidget';

const StatsRow = ({ stats, userRole }) => {
  // Define stat cards based on role
  const getStatsForRole = () => {
    const commonStats = [
      { id: 'total-orders', title: 'Total Orders', value: stats.totalOrders || '0', icon: 'ShoppingCart', color: 'primary' },
    ];

    const roleStats = {
      ADMIN: [
        { id: 'total-revenue', title: 'Total Revenue', value: `$${(stats.totalRevenue || 0).toLocaleString()}`, icon: 'MonetizationOn', color: 'success' },
        { id: 'total-users', title: 'Total Users', value: stats.totalUsers || '0', icon: 'People', color: 'info' },
        { id: 'total-crafts', title: 'Total Crafts', value: stats.totalCrafts || '0', icon: 'Store', color: 'warning' },
      ],
      ARTISAN: [
        { id: 'my-crafts', title: 'My Crafts', value: stats.myCrafts || '0', icon: 'Inventory', color: 'info' },
        { id: 'avg-rating', title: 'Average Rating', value: (stats.averageRating || 0).toFixed(1), icon: 'RateReview', color: 'warning' },
        { id: 'pending-orders', title: 'Pending Orders', value: stats.pendingOrders || '0', icon: 'LocalShipping', color: 'error' },
        { id: 'monthly-earnings', title: 'Monthly Earnings', value: `$${(stats.monthlyEarnings || 0).toLocaleString()}`, icon: 'MonetizationOn', color: 'success' },
      ],
      CUSTOMER: [
        { id: 'my-reviews', title: 'My Reviews', value: stats.myReviews || '0', icon: 'RateReview', color: 'info' },
        { id: 'favorite-crafts', title: 'Favorite Crafts', value: stats.favoriteCrafts || '0', icon: 'TrendingUp', color: 'warning' },
        { id: 'total-spent', title: 'Total Spent', value: `$${(stats.totalSpent || 0).toLocaleString()}`, icon: 'MonetizationOn', color: 'success' },
        { id: 'wishlist', title: 'Wishlist', value: stats.wishlist || '0', icon: 'Favorite', color: 'error' },
      ],
    };

    return [...commonStats, ...(roleStats[userRole] || [])];
  };

  const statsList = getStatsForRole();

  return (
    <Grid container spacing={2} sx={{ mb: 2 }}>
      {statsList.map((stat) => (
        <Grid item xs={12} sm={6} md={3} key={stat.id}>
          <StatWidget {...stat} size="small" />
        </Grid>
      ))}
    </Grid>
  );
};

export default StatsRow;