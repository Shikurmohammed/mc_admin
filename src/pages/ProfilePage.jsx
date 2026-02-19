import React, { useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Box,
  Typography,
  Avatar,
  Button,
  Divider,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Tabs,
  Tab,
  Alert,
} from '@mui/material';
import {
  Edit,
  ShoppingCart,
  Store,
  RateReview,
  Favorite,
  Settings,
  LocationOn,
  Phone,
  Email,
  CalendarToday,
  Work,
  School,
  Link,
  GitHub,
  Twitter,
  LinkedIn,
} from '@mui/icons-material';
import PageHeader from '../components/common/PageHeader';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const tabs = [
    { label: 'Overview', value: 'overview' },
    { label: 'Activity', value: 'activity' },
    { label: 'Orders', value: 'orders' },
    { label: 'Reviews', value: 'reviews' },
    { label: 'Favorites', value: 'favorites' },
  ];

  // Mock data - replace with API calls
  const userStats = {
    totalOrders: 24,
    totalReviews: 8,
    favoriteCrafts: 12,
    totalSpent: 1250,
  };

  const recentActivity = [
    { id: 1, action: 'Placed an order', details: 'Order #ORD-12345', date: '2024-01-15' },
    { id: 2, action: 'Reviewed a craft', details: '5-star review for "Handmade Vase"', date: '2024-01-14' },
    { id: 3, action: 'Added to favorites', details: 'Added "Wooden Sculpture" to favorites', date: '2024-01-13' },
    { id: 4, action: 'Updated profile', details: 'Changed profile picture', date: '2024-01-12' },
  ];

  if (!user) {
    return (
      <Container>
        <Alert severity="warning">
          Please log in to view your profile.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <PageHeader
        title="My Profile"
        subtitle="Manage your personal information and activity"
        breadcrumbs={true}
        actions={[
          {
            label: 'Edit Profile',
            icon: <Edit />,
            onClick: () => console.log('Edit profile'),
            variant: 'contained',
          },
        ]}
      />

      {/* Profile Header */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={3}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Avatar
                src={user.avatar}
                sx={{ width: 120, height: 120, mb: 2 }}
              >
                {user.firstName?.charAt(0)}
              </Avatar>
              <Typography variant="h6" fontWeight={600}>
                {user.firstName} {user.lastName}
              </Typography>
              <Chip
                label={user.role}
                color="primary"
                size="small"
                sx={{ mt: 1 }}
              />
            </Box>
          </Grid>
          
          <Grid item xs={12} md={9}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <Email fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Email
                </Typography>
                <Typography variant="body1">{user.email}</Typography>
              </Grid>
              
              {user.phone && (
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    <Phone fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Phone
                  </Typography>
                  <Typography variant="body1">{user.phone}</Typography>
                </Grid>
              )}
              
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <CalendarToday fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Member Since
                </Typography>
                <Typography variant="body1">
                  {new Date(user.createdAt).toLocaleDateString()}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Status
                </Typography>
                <Chip
                  label={user.isVerified ? 'Verified' : 'Unverified'}
                  color={user.isVerified ? 'success' : 'warning'}
                  size="small"
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>

      {/* Stats Overview */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <ShoppingCart color="primary" sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h5" fontWeight={700}>
              {userStats.totalOrders}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Orders
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={6} sm={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <RateReview color="secondary" sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h5" fontWeight={700}>
              {userStats.totalReviews}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Reviews
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={6} sm={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Favorite color="error" sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h5" fontWeight={700}>
              {userStats.favoriteCrafts}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Favorites
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={6} sm={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Store color="warning" sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h5" fontWeight={700}>
              ${userStats.totalSpent}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Spent
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Tabs Section */}
      <Paper sx={{ mb: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={handleTabChange}>
            {tabs.map((tab, index) => (
              <Tab key={index} label={tab.label} />
            ))}
          </Tabs>
        </Box>
        
        {/* Tab Content */}
        <Box sx={{ p: 3 }}>
          {activeTab === 0 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom fontWeight={600}>
                  Recent Activity
                </Typography>
                <List>
                  {recentActivity.map((activity) => (
                    <ListItem key={activity.id} divider>
                      <ListItemText
                        primary={activity.action}
                        secondary={`${activity.details} • ${activity.date}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom fontWeight={600}>
                  Account Details
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <Email />
                    </ListItemIcon>
                    <ListItemText
                      primary="Email Address"
                      secondary={user.email}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CalendarToday />
                    </ListItemIcon>
                    <ListItemText
                      primary="Member Since"
                      secondary={new Date(user.createdAt).toLocaleDateString()}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Settings />
                    </ListItemIcon>
                    <ListItemText
                      primary="Account Status"
                      secondary={user.isVerified ? 'Verified' : 'Pending Verification'}
                    />
                  </ListItem>
                </List>
              </Grid>
            </Grid>
          )}
          
          {activeTab === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Activity History
              </Typography>
              <Typography color="text.secondary">
                Your complete activity history would be displayed here.
              </Typography>
            </Box>
          )}
          
          {activeTab === 2 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Order History
              </Typography>
              <Typography color="text.secondary">
                Your order history would be displayed here.
              </Typography>
            </Box>
          )}
          
          {activeTab === 3 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                My Reviews
              </Typography>
              <Typography color="text.secondary">
                Your reviews would be displayed here.
              </Typography>
            </Box>
          )}
          
          {activeTab === 4 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Favorite Crafts
              </Typography>
              <Typography color="text.secondary">
                Your favorite crafts would be displayed here.
              </Typography>
            </Box>
          )}
        </Box>
      </Paper>

      {/* Quick Actions */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom fontWeight={600}>
          Quick Actions
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6} sm={3}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Edit />}
              onClick={() => console.log('Edit Profile')}
            >
              Edit Profile
            </Button>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<ShoppingCart />}
              onClick={() => console.log('View Orders')}
            >
              View Orders
            </Button>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Settings />}
              onClick={() => console.log('Settings')}
            >
              Settings
            </Button>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Favorite />}
              onClick={() => console.log('Favorites')}
            >
              Favorites
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default ProfilePage;