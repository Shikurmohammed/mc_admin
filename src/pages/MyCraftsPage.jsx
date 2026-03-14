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
  Pagination,
  Snackbar,
  ListItemText,
} from '@mui/material';
import {
  Add,
  MoreVert,
  Edit,
  Delete,
  Visibility,
  Inventory,
  Refresh,
  CheckCircle,
  Warning,
  Error,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';
import { craftsAPI } from '../services/craftsService';
import { useAuth } from '../context/AuthContext';
import { useTheme, alpha } from '@mui/material/styles';

// Ethiopian colors
const ethiopianColors = {
  green: '#078930',
  yellow: '#FCDD09',
  red: '#DA121A',
  gold: '#B8860B',
};

const MyCraftsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  
  // State management
  const [crafts, setCrafts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCraft, setSelectedCraft] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [updatingStock, setUpdatingStock] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    drafts: 0,
    outOfStock: 0,
    totalViews: 0,
    averageRating: 0,
  });

  // Fetch crafts on component mount and page change
  useEffect(() => {
    fetchMyCrafts();
  }, [user, page]);

  const fetchMyCrafts = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await craftsAPI.getArtisanCrafts(user.id, { 
        page, 
        limit: 12,
        sortBy: 'createdAt',
        sortOrder: 'DESC'
      });
      
      // Handle different response structures
      const craftsData = response?.crafts || response?.data || response || [];
      setCrafts(Array.isArray(craftsData) ? craftsData : []);
      
      // Handle pagination
      if (response?.totalPages) {
        setTotalPages(response.totalPages);
      } else if (response?.total) {
        setTotalPages(Math.ceil(response.total / 12));
      }
      
      // Calculate stats
      const total = Array.isArray(craftsData) ? craftsData.length : 0;
      const published = craftsData.filter(c => c.isAvailable).length;
      const drafts = craftsData.filter(c => !c.isAvailable).length;
      const outOfStock = craftsData.filter(c => c.stock === 0).length;
      const totalViews = craftsData.reduce((sum, c) => sum + (c.views || 0), 0);
      const avgRating = craftsData.reduce((sum, c) => sum + (c.averageRating || 0), 0) / (total || 1);
      
      setStats({ 
        total, 
        published, 
        drafts, 
        outOfStock, 
        totalViews,
        averageRating: avgRating.toFixed(1) 
      });
      
    } catch (err) {
      console.error('Error fetching crafts:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load your crafts');
    } finally {
      setLoading(false);
    }
  };

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
      navigate(`/dashboard/my-crafts/edit/${selectedCraft.id}`);
    }
    handleMenuClose();
  };

  const handleView = () => {
    if (selectedCraft) {
      navigate(`/dashboard/crafts/${selectedCraft.id}`);
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
      setSuccess(`"${selectedCraft.title}" has been deleted successfully`);
      fetchMyCrafts();
      setDeleteDialogOpen(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to delete craft');
    }
  };

  const handleAddNew = () => {
    navigate('/dashboard/my-crafts/add');
  };

  const handleUpdateStock = async (craftId, newStock) => {
    if (newStock < 0) return;
    
    setUpdatingStock(craftId);
    try {
      // Only send the stock update, not the entire craft object
      await craftsAPI.updateCraft(craftId, { stock: newStock });
      
      setSuccess('Stock updated successfully');
      fetchMyCrafts(); // Refresh the list
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update stock');
    } finally {
      setUpdatingStock(null);
    }
  };

  const handleToggleAvailability = async (craftId, currentAvailability) => {
    try {
      await craftsAPI.updateCraft(craftId, { isAvailable: !currentAvailability });
      setSuccess(`Craft ${!currentAvailability ? 'published' : 'unpublished'} successfully`);
      fetchMyCrafts();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update availability');
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Loading skeleton
  if (loading && crafts.length === 0) {
    return (
      <Container maxWidth="xl">
        <PageHeader
          title="My Crafts"
          subtitle="Manage your handmade crafts"
          breadcrumbs={true}
        />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
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

      {/* Success Message */}
      <Snackbar
        open={!!success}
        autoHideDuration={3000}
        onClose={() => setSuccess('')}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setSuccess('')}>
          {success}
        </Alert>
      </Snackbar>

      {/* Error Message */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper 
            sx={{ 
              p: 3, 
              textAlign: 'center',
              transition: 'transform 0.3s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: theme.shadows[4],
              },
            }}
          >
            <Inventory sx={{ fontSize: 40, color: ethiopianColors.green, mb: 1 }} />
            <Typography variant="h4" fontWeight={700} color={ethiopianColors.green}>
              {stats.total}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Crafts
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper 
            sx={{ 
              p: 3, 
              textAlign: 'center',
              transition: 'transform 0.3s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: theme.shadows[4],
              },
            }}
          >
            <CheckCircle sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
            <Typography variant="h4" fontWeight={700} color="success.main">
              {stats.published}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Published
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper 
            sx={{ 
              p: 3, 
              textAlign: 'center',
              transition: 'transform 0.3s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: theme.shadows[4],
              },
            }}
          >
            <Warning sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
            <Typography variant="h4" fontWeight={700} color="warning.main">
              {stats.drafts}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Drafts
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper 
            sx={{ 
              p: 3, 
              textAlign: 'center',
              transition: 'transform 0.3s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: theme.shadows[4],
              },
            }}
          >
            <Error sx={{ fontSize: 40, color: 'error.main', mb: 1 }} />
            <Typography variant="h4" fontWeight={700} color="error.main">
              {stats.outOfStock}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Out of Stock
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Additional Stats Row */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6}>
          <Paper sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="body2" color="text.secondary">Total Views</Typography>
              <Typography variant="h5" fontWeight={700}>{stats.totalViews}</Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              across all crafts
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Paper sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="body2" color="text.secondary">Average Rating</Typography>
              <Typography variant="h5" fontWeight={700}>{stats.averageRating} ⭐</Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              from customer reviews
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Crafts Grid */}
      {crafts.length === 0 ? (
        <Paper sx={{ p: 8, textAlign: 'center' }}>
          <Inventory sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" fontWeight={600} color="text.secondary" gutterBottom>
            You haven't created any crafts yet
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph sx={{ maxWidth: 400, mx: 'auto' }}>
            Start sharing your handmade creations with the world. Add your first craft to your collection.
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<Add />}
            onClick={handleAddNew}
            sx={{
              mt: 2,
              bgcolor: ethiopianColors.green,
              '&:hover': { bgcolor: ethiopianColors.green },
            }}
          >
            Add Your First Craft
          </Button>
        </Paper>
      ) : (
        <>
          <Grid container spacing={3}>
            {crafts.map((craft) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={craft.id}>
                <Paper 
                  sx={{ 
                    p: 2, 
                    position: 'relative',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.3s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: theme.shadows[8],
                    },
                  }}
                >
                  {/* Status Badges */}
                  <Box sx={{ position: 'absolute', top: 16, right: 16, zIndex: 1, display: 'flex', gap: 0.5 }}>
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
                      />
                    )}
                    {craft.stock > 0 && craft.stock <= 5 && craft.isAvailable && (
                      <Chip
                        label={`${craft.stock} left`}
                        color="warning"
                        size="small"
                      />
                    )}
                  </Box>

                  {/* Craft Image */}
                  <Box
                    sx={{
                      height: 160,
                      mb: 2,
                      borderRadius: 1,
                      overflow: 'hidden',
                      cursor: 'pointer',
                    }}
                    onClick={() => navigate(`/dashboard/crafts/${craft.id}`)}
                  >
                    <img
                      src={craft.images?.[0] || 'https://via.placeholder.com/300x200?text=No+Image'}
                      alt={craft.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.3s',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    />
                  </Box>

                  {/* Craft Info */}
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" fontWeight={600} noWrap>
                          {craft.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          ETB {craft.price ? parseFloat(craft.price).toLocaleString() : '0'}
                        </Typography>
                      </Box>
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, craft)}
                      >
                        <MoreVert />
                      </IconButton>
                    </Box>

                    {/* Categories */}
                    {craft.categories?.length > 0 && (
                      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 2 }}>
                        {craft.categories.slice(0, 2).map((cat) => (
                          <Chip
                            key={cat.id}
                            label={cat.name}
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: '0.6rem', height: 20 }}
                          />
                        ))}
                        {craft.categories.length > 2 && (
                          <Chip
                            label={`+${craft.categories.length - 2}`}
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: '0.6rem', height: 20 }}
                          />
                        )}
                      </Box>
                    )}

                    {/* Stats */}
                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                      <Typography variant="caption" color="text.secondary">
                        👁️ {craft.views || 0} views
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ⭐ {craft.averageRating?.toFixed(1) || '0.0'}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Quick Actions */}
                  <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                    <Button
                      fullWidth
                      variant="outlined"
                      size="small"
                      startIcon={<Edit />}
                      onClick={() => navigate(`/dashboard/my-crafts/edit/${craft.id}`)}
                    >
                      Edit
                    </Button>
                    <Button
                      fullWidth
                      variant="outlined"
                      size="small"
                      startIcon={<Visibility />}
                      onClick={() => navigate(`/dashboard/crafts/${craft.id}`)}
                    >
                      View
                    </Button>
                  </Box>

                  {/* Stock Management */}
                  <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ minWidth: 40 }}>
                      Stock:
                    </Typography>
                    <TextField
                      size="small"
                      type="number"
                      value={craft.stock}
                      onChange={(e) => handleUpdateStock(craft.id, parseInt(e.target.value) || 0)}
                      disabled={updatingStock === craft.id}
                      inputProps={{ min: 0, max: 999 }}
                      sx={{ width: 80 }}
                    />
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => handleToggleAvailability(craft.id, craft.isAvailable)}
                      color={craft.isAvailable ? 'warning' : 'success'}
                      sx={{ flex: 1 }}
                    >
                      {craft.isAvailable ? 'Unpublish' : 'Publish'}
                    </Button>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                size="large"
                showFirstButton
                showLastButton
              />
            </Box>
          )}
        </>
      )}

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: { minWidth: 200, borderRadius: 2 },
        }}
      >
        <MenuItem onClick={handleView}>
          <Visibility sx={{ mr: 2, fontSize: 20 }} />
          <ListItemText>View Details</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleEdit}>
          <Edit sx={{ mr: 2, fontSize: 20 }} />
          <ListItemText>Edit Craft</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
          <Delete sx={{ mr: 2, fontSize: 20 }} />
          <ListItemText>Delete Craft</ListItemText>
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 },
        }}
      >
        <DialogTitle sx={{ color: 'error.main' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Delete />
            <Typography variant="h6">Delete Craft</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography paragraph>
            Are you sure you want to delete "{selectedCraft?.title}"?
          </Typography>
          <Alert severity="warning">
            This action cannot be undone. The craft will be permanently removed from your inventory.
          </Alert>
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