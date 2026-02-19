import React from 'react';
import { Grid, Paper, Box, Typography, useTheme } from '@mui/material';
import {
  ShoppingBag,
  Pending,
  LocalShipping,
  CheckCircle,
  Cancel,
  AttachMoney,
} from '@mui/icons-material';

const StatCard = ({ title, value, icon, color, trend }) => {
  const theme = useTheme();

  return (
    <Paper
      sx={{
        p: 2,
        borderRadius: 2,
        bgcolor: color,
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        transition: 'transform 0.3s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[8],
        },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="body2" sx={{ opacity: 0.8, mb: 1 }}>
            {title}
          </Typography>
          <Typography variant="h4" fontWeight={700}>
            {value}
          </Typography>
          {trend && (
            <Typography variant="caption" sx={{ opacity: 0.8, mt: 1, display: 'block' }}>
              {trend}
            </Typography>
          )}
        </Box>
        <Box
          sx={{
            bgcolor: 'rgba(255,255,255,0.2)',
            borderRadius: '50%',
            p: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {icon}
        </Box>
      </Box>
    </Paper>
  );
};

const OrderStats = ({ stats }) => {
  const statCards = [
    {
      title: 'Total Orders',
      value: stats.total || 0,
      icon: <ShoppingBag sx={{ fontSize: 32 }} />,
      color: '#3b82f6',
    },
    {
      title: 'Pending',
      value: stats.pending || 0,
      icon: <Pending sx={{ fontSize: 32 }} />,
      color: '#f59e0b',
    },
    {
      title: 'Shipped',
      value: stats.shipped || 0,
      icon: <LocalShipping sx={{ fontSize: 32 }} />,
      color: '#8b5cf6',
    },
    {
      title: 'Delivered',
      value: stats.delivered || 0,
      icon: <CheckCircle sx={{ fontSize: 32 }} />,
      color: '#10b981',
    },
    {
      title: 'Cancelled',
      value: stats.cancelled || 0,
      icon: <Cancel sx={{ fontSize: 32 }} />,
      color: '#ef4444',
    },
    {
      title: 'Revenue',
      value: `$${stats.revenue?.toLocaleString() || 0}`,
      icon: <AttachMoney sx={{ fontSize: 32 }} />,
      color: '#ec4899',
    },
  ];

  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      {statCards.map((stat, index) => (
        <Grid item xs={12} sm={6} md={4} lg={2} key={index}>
          <StatCard {...stat} />
        </Grid>
      ))}
    </Grid>
  );
};

export default OrderStats;