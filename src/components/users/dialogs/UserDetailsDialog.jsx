import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Avatar,
  Chip,
  Button,
  IconButton,
  Grid,
  Divider,
  Tabs,
  Tab,
  Paper,
  Tooltip
} from '@mui/material';
import {
  Close,
  Edit,
  Phone,
  LocationOn,
  CalendarToday,
  Verified,
  Warning,
  AdminPanelSettings,
  Storefront,
  Person
} from '@mui/icons-material';

const TabPanel = ({ children, value, index }) => (
  <div role="tabpanel" hidden={value !== index}>
    {value === index && <Box sx={{ py: 2 }}>{children}</Box>}
  </div>
);

const UserDetailsDialog = ({ open, onClose, user, onEdit }) => {
  const [tabValue, setTabValue] = useState(0);

  if (!user) return null;

  const roleColors = {
    ADMIN: 'error',
    ARTISAN: 'warning',
    CUSTOMER: 'success',
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { borderRadius: 2 } }}
    >
      <DialogTitle sx={{ py: 1.5, px: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle1" fontWeight={600} sx={{ fontSize: '1rem' }}>
            User Details
          </Typography>
          <IconButton onClick={onClose} size="small" sx={{ p: 0.5 }}>
            <Close sx={{ fontSize: '1.25rem' }} />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Avatar
            src={user.avatar}
            sx={{ width: 56, height: 56 }}
          >
            {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="subtitle1" fontWeight={600} sx={{ fontSize: '1rem' }}>
              {user.firstName} {user.lastName}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
              {user.email}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 1 }}>
          <Tabs 
            value={tabValue} 
            onChange={(e, v) => setTabValue(v)}
            sx={{ 
              minHeight: 36,
              '& .MuiTab-root': { 
                fontSize: '0.75rem', 
                py: 0.5, 
                minHeight: 36,
                textTransform: 'none'
              }
            }}
          >
            <Tab label="Profile" />
            <Tab label="Activity" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.675rem' }}>
                Role
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                <Chip
                  label={user.role}
                  size="small"
                  color={roleColors[user.role]}
                  icon={
                    user.role === 'ADMIN' ? <AdminPanelSettings sx={{ fontSize: '0.875rem' }} /> :
                    user.role === 'ARTISAN' ? <Storefront sx={{ fontSize: '0.875rem' }} /> :
                    <Person sx={{ fontSize: '0.875rem' }} />
                  }
                  sx={{ height: 24, fontSize: '0.75rem' }}
                />
              </Box>
            </Grid>
            
            <Grid item xs={6}>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.675rem' }}>
                Member Since
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                <CalendarToday sx={{ fontSize: '0.875rem', color: 'text.secondary' }} />
                <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                  {formatDate(user.createdAt)}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={6}>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.675rem' }}>
                Status
              </Typography>
              <Box sx={{ mt: 0.5 }}>
                <Chip
                  label={user.isActive ? 'Active' : 'Inactive'}
                  size="small"
                  color={user.isActive ? 'success' : 'default'}
                  sx={{ height: 24, fontSize: '0.75rem', mr: 1 }}
                />
                <Chip
                  label={user.isVerified ? 'Verified' : 'Unverified'}
                  size="small"
                  color={user.isVerified ? 'success' : 'warning'}
                  icon={user.isVerified ? <Verified sx={{ fontSize: '0.875rem' }} /> : <Warning sx={{ fontSize: '0.875rem' }} />}
                  sx={{ height: 24, fontSize: '0.75rem' }}
                />
              </Box>
            </Grid>

            {user.phone && (
              <Grid item xs={12}>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.675rem' }}>
                  Phone
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                  <Phone sx={{ fontSize: '0.875rem', color: 'text.secondary' }} />
                  <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                    {user.phone}
                  </Typography>
                </Box>
              </Grid>
            )}

            {user.address && (
              <Grid item xs={12}>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.675rem' }}>
                  Address
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                  <LocationOn sx={{ fontSize: '0.875rem', color: 'text.secondary' }} />
                  <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                    {user.address}
                    {user.city && `, ${user.city}`}
                    {user.state && `, ${user.state}`}
                    {user.zipCode && ` ${user.zipCode}`}
                    {user.country && `, ${user.country}`}
                  </Typography>
                </Box>
              </Grid>
            )}

            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle2" fontWeight={600} sx={{ fontSize: '0.875rem', mb: 1 }}>
                Statistics
              </Typography>
              <Grid container spacing={1}>
                <Grid item xs={3}>
                  <Paper variant="outlined" sx={{ p: 1, textAlign: 'center' }}>
                    <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600 }}>
                      {user.craftsCount || 0}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.625rem' }}>
                      Crafts
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={3}>
                  <Paper variant="outlined" sx={{ p: 1, textAlign: 'center' }}>
                    <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600 }}>
                      {user.ordersCount || 0}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.625rem' }}>
                      Orders
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={3}>
                  <Paper variant="outlined" sx={{ p: 1, textAlign: 'center' }}>
                    <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600 }}>
                      {user.reviewsCount || 0}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.625rem' }}>
                      Reviews
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={3}>
                  <Paper variant="outlined" sx={{ p: 1, textAlign: 'center' }}>
                    <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600 }}>
                      {user.views || 0}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.625rem' }}>
                      Views
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Typography color="text.secondary" sx={{ fontSize: '0.875rem' }}>
            No recent activity
          </Typography>
        </TabPanel>
      </DialogContent>

      <DialogActions sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
        <Button 
          size="small" 
          onClick={onClose} 
          sx={{ fontSize: '0.75rem', textTransform: 'none' }}
        >
          Close
        </Button>
        <Button
          size="small"
          variant="contained"
          startIcon={<Edit sx={{ fontSize: '1rem' }} />}
          onClick={onEdit}
          sx={{ fontSize: '0.75rem', textTransform: 'none' }}
        >
          Edit User
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserDetailsDialog;