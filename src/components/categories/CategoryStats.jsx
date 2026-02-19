import React from 'react';
import { Grid, Paper, Box, Typography, useTheme, alpha } from '@mui/material';
import {
  Category as CategoryIcon,
  Inventory,
  TrendingUp,
  NewReleases,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

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

const CategoryStats = ({ stats }) => {
  const { t } = useTranslation();

  const statCards = [
    {
      title: t('categories.totalCategories'),
      value: stats.total,
      icon: <CategoryIcon sx={{ fontSize: 32 }} />,
      color: '#3b82f6',
    },
    {
      title: t('categories.activeCategories'),
      value: stats.active,
      icon: <TrendingUp sx={{ fontSize: 32 }} />,
      color: '#10b981',
    },
    {
      title: t('categories.totalCrafts'),
      value: stats.crafts,
      icon: <Inventory sx={{ fontSize: 32 }} />,
      color: '#f59e0b',
    },
    {
      title: t('categories.popularCategories'),
      value: stats.popular.length,
      icon: <NewReleases sx={{ fontSize: 32 }} />,
      color: '#8b5cf6',
      trend: stats.popular.map(c => c.name).join(', '),
    },
  ];

  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      {statCards.map((stat, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <StatCard {...stat} />
        </Grid>
      ))}
    </Grid>
  );
};

export default CategoryStats;