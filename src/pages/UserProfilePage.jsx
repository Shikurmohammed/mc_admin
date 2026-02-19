import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Box,
  Typography,
  Avatar,
  Grid,
  Chip,
  Button,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Store,
  RateReview,
  ShoppingCart,
  Message,
  Edit,
  Block,
  CheckCircle,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';
import { userAPI } from '../services/usersService';
import {craftsAPI} from '../services/craftsService';
import {reviewsAPI} from '../services/reviewsService';

import { useAuth } from '../context/AuthContext';

const UserProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState(null);
  const [crafts, setCrafts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        // Fetch user data
        const userData = await userAPI.getUser(id);
        setUser(userData);
        
        // Fetch user's crafts if they are an artisan
        if (userData.role === 'ARTISAN') {
          const craftsData = await craftsAPI.getArtisanCrafts(id);
          setCrafts(craftsData);
        }
        
        // Fetch user's reviews
        const reviewsData = await reviewsAPI.getUserReviews(id);
        setReviews(reviewsData);
        
      } catch (err) {
        setError(err.message || 'Failed to load user data');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchUserData();
    }
  }, [id]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleToggleStatus = async () => {
    try {
      const newStatus = !user.isActive;
      await userAPI.updateUser(id, { isActive: newStatus });
      setUser(prev => ({ ...prev, isActive: newStatus }));
    } catch (err) {
      setError(err.message || 'Failed to update user status');
    }
  };

  if (loading) {
    return (
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container>
        <Alert severity="warning" sx={{ mt: 2 }}>
          User not found
        </Alert>
      </Container>
    );
  }

  const tabs = [
    { label: 'Overview', value: 'overview' },
    { label: 'Crafts', value: 'crafts', show: user.role === 'ARTISAN' },
    { label: 'Reviews', value: 'reviews' },
    { label: 'Activity', value: 'activity' },
  ].filter(tab => tab.show !== false);

  return (
    <Container maxWidth="lg">
      <PageHeader
        title={`${user.firstName} ${user.lastName}`}
        subtitle={`${user.role} Profile`}
        breadcrumbs={true}
        actions={currentUser?.role === 'ADMIN' && [
          {
            label: user.isActive ? 'Deactivate' : 'Activate',
            icon: user.isActive ? <Block /> : <CheckCircle />,
            onClick: handleToggleStatus,
            variant: 'outlined',
            color: user.isActive ? 'warning' : 'success',
          },
          {
            label: 'Edit User',
            icon: <Edit />,
            onClick: () => navigate(`/users/edit/${id}`),
            variant: 'contained',
          },
        ]}
      />

      {/* User Info Card */}
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
              <Chip
                label={user.role}
                color={
                  user.role === 'ADMIN' ? 'error' :
                  user.role === 'ARTISAN' ? 'warning' : 'success'
                }
                sx={{ mb: 1 }}
              />
              <Chip
                label={user.isActive ? 'Active' : 'Inactive'}
                color={user.isActive ? 'success' : 'error'}
                size="small"
              />
            </Box>
          </Grid>
          
          <Grid item xs={12} md={9}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h5" fontWeight={600}>
                  {user.firstName} {user.lastName}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {user.email}
                </Typography>
              </Grid>
              
              <Grid item xs={6} sm={3}>
                <Typography variant="body2" color="text.secondary">
                  Member Since
                </Typography>
                <Typography variant="body1">
                  {new Date(user.createdAt).toLocaleDateString()}
                </Typography>
              </Grid>
              
              {user.phone && (
                <Grid item xs={6} sm={3}>
                  <Typography variant="body2" color="text.secondary">
                    Phone
                  </Typography>
                  <Typography variant="body1">{user.phone}</Typography>
                </Grid>
              )}
              
              <Grid item xs={6} sm={3}>
                <Typography variant="body2" color="text.secondary">
                  Status
                </Typography>
                <Chip
                  label={user.isVerified ? 'Verified' : 'Unverified'}
                  color={user.isVerified ? 'success' : 'warning'}
                  size="small"
                />
              </Grid>
              
              <Grid item xs={6} sm={3}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Message />}
                  onClick={() => console.log('Message user')}
                >
                  Message
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>

      {/* Tabs Section */}
      <Paper sx={{ mb: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={handleTabChange}>
            {tabs.map((tab, index) => (
              <Tab key={index} label={tab.label} />
            ))}
          </Tabs>
        </Box>
        
        <Box sx={{ p: 3 }}>
          {activeTab === 0 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom fontWeight={600}>
                  User Information
                </Typography>
                {/* Add detailed user info here */}
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom fontWeight={600}>
                  Statistics
                </Typography>
                {/* Add user statistics here */}
              </Grid>
            </Grid>
          )}
          
          {activeTab === 1 && user.role === 'ARTISAN' && (
            <Box>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                Crafts by {user.firstName}
              </Typography>
              {crafts.length === 0 ? (
                <Typography color="text.secondary">
                  No crafts found
                </Typography>
              ) : (
                <Typography>
                  {crafts.length} craft{crafts.length !== 1 ? 's' : ''} found
                </Typography>
              )}
            </Box>
          )}
          
          {activeTab === 2 && (
            <Box>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                Reviews by {user.firstName}
              </Typography>
              {reviews.length === 0 ? (
                <Typography color="text.secondary">
                  No reviews found
                </Typography>
              ) : (
                <Typography>
                  {reviews.length} review{reviews.length !== 1 ? 's' : ''} found
                </Typography>
              )}
            </Box>
          )}
          
          {activeTab === 3 && (
            <Box>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                User Activity
              </Typography>
              <Typography color="text.secondary">
                Activity history would be displayed here
              </Typography>
            </Box>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default UserProfilePage;