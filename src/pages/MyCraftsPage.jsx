import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Box,
  Typography,
  Button,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import {
  Add,
  MoreVert,
  Edit,
  Delete,
  Visibility,
  Inventory,
  Refresh,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';
import CraftCard from '../components/crafts/CraftCard';
import { craftsAPI } from '../services/craftsService';
import { useAuth } from '../context/AuthContext';

const MyCraftsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [crafts, setCrafts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCraft, setSelectedCraft] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    drafts: 0,
    outOfStock: 0,
  });

  const fetchMyCrafts = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    setError('');
    try {
      const response = await craftsAPI.getArtisanCrafts(user.id);
      setCrafts(response);
      
      // Calculate stats
      const total = response.length;
      const published = response.filter(c => c.isAvailable).length;
      const drafts = response.filter(c => !c.isAvailable).length;
      const outOfStock = response.filter(c => c.stock === 0).length;
      
      setStats({ total, published, drafts, outOfStock });
    } catch (err) {
      setError(err.message || 'Failed to load your crafts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyCrafts();
  }, [user]);

  const handleMenuOpen = (event, craft) => {
    setAnchorEl(event.currentTarget);
    setSelectedCraft(craft);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedCraft(null);
  };

  const handleEdit = () => {
    if (selectedCraft) {
      navigate(`/my-crafts/edit/${selectedCraft.id}`);
    }
    handleMenuClose();
  };

  const handleView = () => {
    if (selectedCraft) {
      navigate(`/crafts/${selectedCraft.id}`);
    }
    handleMenuClose();
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteConfirm = async () => {
    if (!selectedCraft) return;
    
    try {
      await craftsAPI.deleteCraft(selectedCraft.id);
      fetchMyCrafts();
      setDeleteDialogOpen(false);
    } catch (err) {
      setError(err.message || 'Failed to delete craft');
    }
  };

  const handleAddNew = () => {
    navigate('/my-crafts/add');
  };

  const handleUpdateStock = async (craftId, newStock) => {
    try {
      await craftsAPI.updateCraftStock(craftId, newStock);
      fetchMyCrafts();
    } catch (err) {
      setError(err.message || 'Failed to update stock');
    }
  };

  const handleToggleAvailability = async (craftId, currentAvailability) => {
    try {
      await craftsAPI.updateCraft(craftId, { isAvailable: !currentAvailability });
      fetchMyCrafts();
    } catch (err) {
      setError(err.message || 'Failed to update availability');
    }
  };

  if (loading && crafts.length === 0) {
    return (
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl">
      <PageHeader
        title="My Crafts"
        subtitle="Manage your handmade crafts"
        breadcrumbs={true}
        actions={[
          {
            label: 'Add New Craft',
            icon: <Add />,
            onClick: handleAddNew,
            variant: 'contained',
          },
          {
            label: 'Refresh',
            icon: <Refresh />,
            onClick: fetchMyCrafts,
            variant: 'outlined',
          },
        ]}
      />

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={6} sm={3}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Inventory color="primary" sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h4" fontWeight={700}>
              {stats.total}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Crafts
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={6} sm={3}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h4" fontWeight={700} color="success.main">
              {stats.published}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Published
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={6} sm={3}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h4" fontWeight={700} color="warning.main">
              {stats.drafts}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Drafts
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={6} sm={3}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h4" fontWeight={700} color="error.main">
              {stats.outOfStock}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Out of Stock
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Crafts Grid */}
      {crafts.length === 0 ? (
        <Paper sx={{ p: 8, textAlign: 'center' }}>
          <Inventory sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            You haven't created any crafts yet
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Start by adding your first handmade craft to your collection
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAddNew}
            sx={{ mt: 2 }}
          >
            Add Your First Craft
          </Button>
        </Paper>
      ) : (
        <>
          <Grid container spacing={3}>
            {crafts.map((craft) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={craft.id}>
                <Paper sx={{ p: 2, position: 'relative' }}>
                  {/* Status Badge */}
                  <Box sx={{ position: 'absolute', top: 16, right: 16, zIndex: 1 }}>
                    {!craft.isAvailable && (
                      <Chip
                        label="Draft"
                        color="warning"
                        size="small"
                      />
                    )}
                    {craft.stock === 0 && (
                      <Chip
                        label="Out of Stock"
                        color="error"
                        size="small"
                        sx={{ ml: 0.5 }}
                      />
                    )}
                    {craft.stock > 0 && craft.stock <= 5 && (
                      <Chip
                        label={`${craft.stock} left`}
                        color="warning"
                        size="small"
                        sx={{ ml: 0.5 }}
                      />
                    )}
                  </Box>

                  {/* Craft Info */}
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" fontWeight={600} noWrap>
                        {craft.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ${parseFloat(craft.price).toFixed(2)}
                      </Typography>
                    </Box>
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuOpen(e, craft)}
                    >
                      <MoreVert />
                    </IconButton>
                  </Box>

                  {/* Quick Actions */}
                  <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                    <Button
                      fullWidth
                      variant="outlined"
                      size="small"
                      startIcon={<Edit />}
                      onClick={() => navigate(`/my-crafts/edit/${craft.id}`)}
                    >
                      Edit
                    </Button>
                    <Button
                      fullWidth
                      variant="outlined"
                      size="small"
                      startIcon={<Visibility />}
                      onClick={() => navigate(`/crafts/${craft.id}`)}
                    >
                      View
                    </Button>
                  </Box>

                  {/* Stock Management */}
                  <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Stock:
                    </Typography>
                    <TextField
                      size="small"
                      type="number"
                      value={craft.stock}
                      onChange={(e) => handleUpdateStock(craft.id, parseInt(e.target.value) || 0)}
                      sx={{ width: 80 }}
                    />
                    <Button
                      size="small"
                      onClick={() => handleToggleAvailability(craft.id, craft.isAvailable)}
                      color={craft.isAvailable ? 'warning' : 'success'}
                    >
                      {craft.isAvailable ? 'Unpublish' : 'Publish'}
                    </Button>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleView}>
          <Visibility sx={{ mr: 2 }} />
          View Details
        </MenuItem>
        <MenuItem onClick={handleEdit}>
          <Edit sx={{ mr: 2 }} />
          Edit Craft
        </MenuItem>
        <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
          <Delete sx={{ mr: 2 }} />
          Delete Craft
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Craft</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{selectedCraft?.title}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MyCraftsPage;