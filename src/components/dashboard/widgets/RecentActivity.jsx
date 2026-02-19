import React from 'react';
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Box,
  Typography,
  Chip,
  IconButton,
  LinearProgress,
} from '@mui/material';
import {
  CheckCircle,
  Error,
  Warning,
  Info,
  Person,
  ShoppingCart,
  Payment,
  TrendingUp,
} from '@mui/icons-material';
import DashboardCard from '../../common/card/DashboardCard';
import { formatDistanceToNow } from 'date-fns';

const RecentActivity = () => {
  const activities = [
    {
      id: 1,
      user: 'John Doe',
      action: 'placed a new order',
      target: 'Order #1234',
      time: new Date(Date.now() - 1000 * 60 * 5),
      type: 'order',
      status: 'success',
    },
    {
      id: 2,
      user: 'Sarah Johnson',
      action: 'completed payment for',
      target: 'Invoice #5678',
      time: new Date(Date.now() - 1000 * 60 * 15),
      type: 'payment',
      status: 'success',
    },
    {
      id: 3,
      user: 'Mike Wilson',
      action: 'reported an issue with',
      target: 'Product #9012',
      time: new Date(Date.now() - 1000 * 60 * 30),
      type: 'issue',
      status: 'warning',
    },
    {
      id: 4,
      user: 'Emily Davis',
      action: 'submitted a review for',
      target: 'Service #3456',
      time: new Date(Date.now() - 1000 * 60 * 45),
      type: 'review',
      status: 'info',
    },
    {
      id: 5,
      user: 'Alex Turner',
      action: 'achieved milestone in',
      target: 'Project Alpha',
      time: new Date(Date.now() - 1000 * 60 * 60),
      type: 'milestone',
      status: 'success',
    },
  ];

  const getIcon = (type, status) => {
    switch (type) {
      case 'order':
        return <ShoppingCart color={status === 'success' ? 'success' : 'inherit'} />;
      case 'payment':
        return <Payment color={status === 'success' ? 'success' : 'inherit'} />;
      case 'issue':
        return <Warning color="warning" />;
      case 'review':
        return <Info color="info" />;
      case 'milestone':
        return <TrendingUp color="success" />;
      default:
        return <Person />;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircle fontSize="small" color="success" />;
      case 'warning':
        return <Warning fontSize="small" color="warning" />;
      case 'error':
        return <Error fontSize="small" color="error" />;
      default:
        return <Info fontSize="small" color="info" />;
    }
  };

  return (
    <DashboardCard
      title="Recent Activity"
      subtitle="Latest user activities and events"
      onRefresh={() => console.log('Refresh activities')}
      onViewDetails={() => console.log('View all activities')}
    >
      <List dense sx={{ pt: 0 }}>
        {activities.map((activity) => (
          <ListItem
            key={activity.id}
            sx={{
              px: 0,
              py: 1.5,
              borderBottom: '1px solid',
              borderColor: 'divider',
              '&:last-child': { borderBottom: 'none' },
            }}
          >
            <ListItemAvatar>
              <Avatar
                sx={{
                  bgcolor: 'background.default',
                  color: 'text.primary',
                  width: 36,
                  height: 36,
                }}
              >
                {getIcon(activity.type, activity.status)}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" fontWeight={600} component="span">
                    {activity.user}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" component="span">
                    {activity.action}
                  </Typography>
                  <Typography variant="body2" fontWeight={600} component="span">
                    {activity.target}
                  </Typography>
                </Box>
              }
              // This line prevents the primary "div inside p" error
              primaryTypographyProps={{ component: 'div' }}
              secondary={
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 0.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    {getStatusIcon(activity.status)}
                    <Typography variant="caption" color="text.secondary" component="span">
                      {formatDistanceToNow(activity.time, { addSuffix: true })}
                    </Typography>
                  </Box>
                  <Chip
                    label={activity.type}
                    size="small"
                    variant="outlined"
                    sx={{ textTransform: 'capitalize', height: 20 }}
                  />
                </Box>
              }
              // This line prevents the secondary "div inside p" error
              secondaryTypographyProps={{ component: 'div' }}
            />

          </ListItem>
        ))}
      </List>

      <Box sx={{ mt: 3 }}>
        <Typography variant="caption" color="text.secondary" gutterBottom>
          Activity trend this week
        </Typography>
        <LinearProgress
          variant="determinate"
          value={75}
          sx={{
            height: 6,
            borderRadius: 3,
            mb: 1,
          }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="caption" color="text.secondary">
            75% increase from last week
          </Typography>
          <Typography variant="caption" fontWeight={600}>
            42 activities
          </Typography>
        </Box>
      </Box>
    </DashboardCard>
  );
};

export default RecentActivity;