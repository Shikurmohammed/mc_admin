import React from 'react';
import { Paper, Box, Typography, Icon, useTheme, alpha } from '@mui/material';
import {
  TrendingUp,
  ShoppingCart,
  People,
  Store,
  MonetizationOn,
  Inventory,
  RateReview,
  LocalShipping,
  Favorite,
} from '@mui/icons-material';

const iconMap = {
  TrendingUp,
  ShoppingCart,
  People,
  Store,
  MonetizationOn,
  Inventory,
  RateReview,
  LocalShipping,
  Favorite,
};

const StatWidget = ({ title, value, icon, color = 'primary', change }) => {
  const theme = useTheme();
  const IconComponent = iconMap[icon] || TrendingUp;

  return (
    <Paper
      sx={{
        p: 2,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: alpha(theme.palette[color].main, 0.05),
        border: `1px solid ${alpha(theme.palette[color].main, 0.2)}`,
        borderRadius: 2,
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          {title}
        </Typography>
        <Box
          sx={{
            p: 1,
            borderRadius: '50%',
            bgcolor: alpha(theme.palette[color].main, 0.1),
            color: theme.palette[color].main,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <IconComponent fontSize="small" />
        </Box>
      </Box>

      <Typography variant="h5" fontWeight={700} color={theme.palette[color].main}>
        {value}
      </Typography>

      {change && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
          <TrendingUp
            sx={{
              fontSize: 14,
              color: change.startsWith('+') ? 'success.main' : 'error.main',
            }}
          />
          <Typography
            variant="caption"
            color={change.startsWith('+') ? 'success.main' : 'error.main'}
          >
            {change}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            vs last month
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default StatWidget;