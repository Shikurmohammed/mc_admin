import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Divider,
  CircularProgress,
  InputAdornment
} from '@mui/material';
import {
  Close,
  Save,
  Email,
  Phone
} from '@mui/icons-material';

const UserFormDialog = ({ 
  open, 
  onClose, 
  mode, 
  initialData, 
  errors = {}, 
  onSubmit, 
  loading 
}) => {
  const [formData, setFormData] = useState(initialData || {});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <Dialog
      open={open}
      onClose={() => !loading && onClose()}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: 2 } }}
    >
      <DialogTitle sx={{ py: 1.5, px: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle1" fontWeight={600} sx={{ fontSize: '1rem' }}>
            {mode === 'add' ? 'Add New User' : 'Edit User'}
          </Typography>
          <IconButton onClick={onClose} disabled={loading} size="small" sx={{ p: 0.5 }}>
            <Close sx={{ fontSize: '1.25rem' }} />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 2 }}>
        <Grid container spacing={1.5}>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="First Name"
              name="firstName"
              value={formData.firstName || ''}
              onChange={handleChange}
              error={!!errors.firstName}
              helperText={errors.firstName}
              required
              size="small"
              disabled={loading}
              sx={{ '& .MuiInputBase-root': { fontSize: '0.875rem' } }}
            />
          </Grid>
          
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Last Name"
              name="lastName"
              value={formData.lastName || ''}
              onChange={handleChange}
              error={!!errors.lastName}
              helperText={errors.lastName}
              required
              size="small"
              disabled={loading}
              sx={{ '& .MuiInputBase-root': { fontSize: '0.875rem' } }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email || ''}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              required
              size="small"
              disabled={loading}
              sx={{ '& .MuiInputBase-root': { fontSize: '0.875rem' } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email sx={{ fontSize: '1rem' }} />
                  </InputAdornment>
                )
              }}
            />
          </Grid>

          <Grid item xs={6}>
            <FormControl fullWidth size="small" disabled={loading}>
              <InputLabel sx={{ fontSize: '0.875rem' }}>Role</InputLabel>
              <Select
                name="role"
                value={formData.role || 'CUSTOMER'}
                label="Role"
                onChange={handleChange}
                sx={{ fontSize: '0.875rem' }}
              >
                <MenuItem value="CUSTOMER" sx={{ fontSize: '0.875rem' }}>Customer</MenuItem>
                <MenuItem value="ARTISAN" sx={{ fontSize: '0.875rem' }}>Artisan</MenuItem>
                <MenuItem value="ADMIN" sx={{ fontSize: '0.875rem' }}>Admin</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Phone"
              name="phone"
              value={formData.phone || ''}
              onChange={handleChange}
              size="small"
              disabled={loading}
              sx={{ '& .MuiInputBase-root': { fontSize: '0.875rem' } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Phone sx={{ fontSize: '1rem' }} />
                  </InputAdornment>
                )
              }}
            />
          </Grid>

          {mode === 'add' && (
            <>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password || ''}
                  onChange={handleChange}
                  error={!!errors.password}
                  helperText={errors.password}
                  required
                  size="small"
                  disabled={loading}
                  sx={{ '& .MuiInputBase-root': { fontSize: '0.875rem' } }}
                />
              </Grid>
              
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword || ''}
                  onChange={handleChange}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword}
                  required
                  size="small"
                  disabled={loading}
                  sx={{ '& .MuiInputBase-root': { fontSize: '0.875rem' } }}
                />
              </Grid>
            </>
          )}

          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Address"
              name="address"
              value={formData.address || ''}
              onChange={handleChange}
              size="small"
              disabled={loading}
              sx={{ '& .MuiInputBase-root': { fontSize: '0.875rem' } }}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              label="City"
              name="city"
              value={formData.city || ''}
              onChange={handleChange}
              size="small"
              disabled={loading}
              sx={{ '& .MuiInputBase-root': { fontSize: '0.875rem' } }}
            />
          </Grid>

          <Grid item xs={3}>
            <TextField
              fullWidth
              label="State"
              name="state"
              value={formData.state || ''}
              onChange={handleChange}
              size="small"
              disabled={loading}
              sx={{ '& .MuiInputBase-root': { fontSize: '0.875rem' } }}
            />
          </Grid>

          <Grid item xs={3}>
            <TextField
              fullWidth
              label="ZIP"
              name="zipCode"
              value={formData.zipCode || ''}
              onChange={handleChange}
              size="small"
              disabled={loading}
              sx={{ '& .MuiInputBase-root': { fontSize: '0.875rem' } }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Country"
              name="country"
              value={formData.country || ''}
              onChange={handleChange}
              size="small"
              disabled={loading}
              sx={{ '& .MuiInputBase-root': { fontSize: '0.875rem' } }}
            />
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isActive ?? true}
                    onChange={handleChange}
                    name="isActive"
                    size="small"
                    disabled={loading}
                    sx={{ '& .MuiSwitch-switchBase': { p: 0.75 } }}
                  />
                }
                label={<Typography sx={{ fontSize: '0.875rem' }}>Active</Typography>}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isVerified ?? true}
                    onChange={handleChange}
                    name="isVerified"
                    size="small"
                    disabled={loading}
                    sx={{ '& .MuiSwitch-switchBase': { p: 0.75 } }}
                  />
                }
                label={<Typography sx={{ fontSize: '0.875rem' }}>Verified</Typography>}
              />
            </Box>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider', gap: 1 }}>
        <Button 
          size="small"
          onClick={onClose} 
          disabled={loading}
          sx={{ fontSize: '0.75rem', textTransform: 'none' }}
        >
          Cancel
        </Button>
        <Button
          size="small"
          onClick={handleSubmit}
          disabled={loading}
          variant="contained"
          startIcon={loading ? <CircularProgress size={16} /> : <Save sx={{ fontSize: '1rem' }} />}
          sx={{ fontSize: '0.75rem', textTransform: 'none' }}
        >
          {loading ? 'Saving...' : mode === 'add' ? 'Create' : 'Update'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserFormDialog;