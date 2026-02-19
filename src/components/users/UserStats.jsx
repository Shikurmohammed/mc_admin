import React from 'react';
import { Grid, Card, CardContent, Typography } from '@mui/material';

const UserStats = ({ stats }) => {
  const statCards = [
    { label: 'Total', value: stats.total, color: 'primary.main' },
    { label: 'Active', value: stats.active, color: 'success.main' },
    { label: 'Artisans', value: stats.artisan, color: 'warning.main' },
    { label: 'Verified', value: stats.verified, color: 'info.main' }
  ];

  return (
    <Grid container spacing={1.5} sx={{ mb: 2 }}>
      {statCards.map((stat, index) => (
        <Grid item xs={6} sm={3} key={index}>
          <Card sx={{ bgcolor: stat.color, color: 'white', borderRadius: 1.5 }}>
            <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
              <Typography variant="caption" sx={{ fontSize: '0.75rem', opacity: 0.9 }}>
                {stat.label}
              </Typography>
              <Typography variant="h6" fontWeight={600} sx={{ fontSize: '1.25rem', lineHeight: 1.2 }}>
                {stat.value}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default UserStats;