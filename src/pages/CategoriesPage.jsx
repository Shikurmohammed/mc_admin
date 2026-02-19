import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  IconButton,
  Tooltip,
  Alert,
  CircularProgress,
  Fab,
  Zoom,
  Drawer,
  Chip,
  Grid,
  Paper,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
  alpha,
  Tabs,
  Tab,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Add,
  Refresh,
  GridView,
  ViewList,
  Search,
  FilterList,
  Close,
  Category as CategoryIcon,
  Dashboard,
  ViewModule,
  ViewAgenda,
  SortByAlpha,
  TrendingUp,
  NewReleases,
} from '@mui/icons-material';
import PageHeader from '../components/common/PageHeader';
import CategoriesTable from '../components/categories/CategoriesTable';
import CategoryCard from '../components/categories/CategoryCard';
import CategoryStats from '../components/categories/CategoryStats';
import CategoryFormDialog from '../components/categories/CategoryFormDialog';
import CategoryCraftsDialog from '../components/categories/CategoryCraftsDialog';
import { categoriesAPI } from '../services/categoriesService';
import { useAuth } from '../context/AuthContext';
import notificationService from '../services/notificationService';
import { useTranslation } from 'react-i18next';

const CategoriesPage = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  // Data states
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState(() => {
    return localStorage.getItem('categoriesViewMode') || 'grid';
  });

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    crafts: 0,
    popular: [],
  });

  // Filters and search
  const [filters, setFilters] = useState({
    search: '',
    sortBy: 'name',
    sortOrder: 'asc',
  });

  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  // Dialogs
  const [formDialog, setFormDialog] = useState({
    open: false,
    mode: 'add', // 'add' or 'edit'
    category: null,
  });

  const [craftsDialog, setCraftsDialog] = useState({
    open: false,
    category: null,
  });

  // Delete confirmation
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    category: null,
  });

  // Tabs for filtering
  const [activeTab, setActiveTab] = useState(0);
  const tabs = [
    { label: t('categories.all'), value: 'all', icon: <CategoryIcon /> },
    { label: t('categories.popular'), value: 'popular', icon: <TrendingUp /> },
    { label: t('categories.recent'), value: 'recent', icon: <NewReleases /> },
  ];

  // Fetch categories
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const params = {
        ...(filters.search && { search: filters.search }),
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
      };

      const response = await categoriesAPI.getCategories(params);
      
      // Handle different response structures
      const categoriesData = response.data || response || [];
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
      
      // Calculate stats
      calculateStats(categoriesData);
      
    } catch (err) {
      notificationService.error(err.response?.data?.message || t('errors.failedToLoadCategories'));
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const calculateStats = (data) => {
    const total = data.length;
    const active = data.filter(c => c.isActive !== false).length;
    const crafts = data.reduce((sum, cat) => sum + (cat.crafts?.length || 0), 0);
    const popular = [...data]
      .sort((a, b) => (b.crafts?.length || 0) - (a.crafts?.length || 0))
      .slice(0, 5);

    setStats({ total, active, crafts, popular });
  };

  useEffect(() => {
    fetchCategories();
  }, [filters.sortBy, filters.sortOrder]);

  // Debounced search
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (filters.search !== undefined) {
        fetchCategories();
      }
    }, 500);
    return () => clearTimeout(timeout);
  }, [filters.search]);

  // Save view mode to localStorage
  useEffect(() => {
    localStorage.setItem('categoriesViewMode', viewMode);
  }, [viewMode]);

  // Handlers
  const handleAddCategory = () => {
    setFormDialog({
      open: true,
      mode: 'add',
      category: null,
    });
  };

  const handleEditCategory = (category) => {
    setFormDialog({
      open: true,
      mode: 'edit',
      category,
    });
  };

  const handleViewCrafts = (category) => {
    setCraftsDialog({
      open: true,
      category,
    });
  };

  const handleDeleteClick = (category) => {
    setDeleteDialog({
      open: true,
      category,
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.category) return;

    try {
      await categoriesAPI.deleteCategory(deleteDialog.category.id);
      notificationService.success(t('categories.deleteSuccess'));
      fetchCategories();
      setDeleteDialog({ open: false, category: null });
    } catch (err) {
      notificationService.error(err.response?.data?.message || t('errors.failedToDeleteCategory'));
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      sortBy: 'name',
      sortOrder: 'asc',
    });
    setActiveTab(0);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    if (newValue === 0) {
      handleFilterChange('sortBy', 'name');
    } else if (newValue === 1) {
      handleFilterChange('sortBy', 'popular');
    } else if (newValue === 2) {
      handleFilterChange('sortBy', 'createdAt');
      handleFilterChange('sortOrder', 'desc');
    }
  };

  // Filter categories based on active tab
  const getFilteredCategories = () => {
    let filtered = [...categories];

    if (activeTab === 1) {
      filtered = filtered.sort((a, b) => (b.crafts?.length || 0) - (a.crafts?.length || 0));
    } else if (activeTab === 2) {
      filtered = filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return filtered;
  };

  const displayedCategories = getFilteredCategories();

  return (
    <Container maxWidth="xl">
      <PageHeader
        title={t('categories.title')}
        subtitle={t('categories.subtitle')}
        breadcrumbs={true}
        actions={isAdmin ? [
          {
            label: t('categories.addNew'),
            icon: <Add />,
            onClick: handleAddCategory,
            variant: 'contained',
            color: 'primary',
          },
          {
            label: t('common.refresh'),
            icon: <Refresh />,
            onClick: fetchCategories,
            variant: 'outlined',
          },
        ] : [
          {
            label: t('common.refresh'),
            icon: <Refresh />,
            onClick: fetchCategories,
            variant: 'outlined',
          },
        ]}
      />

      {/* Stats Cards */}
      <CategoryStats stats={stats} />

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          {tabs.map((tab, index) => (
            <Tab
              key={index}
              icon={tab.icon}
              label={tab.label}
              iconPosition="start"
            />
          ))}
        </Tabs>
      </Box>

      {/* Toolbar */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <TextField
            placeholder={t('categories.searchPlaceholder')}
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            size="small"
            sx={{
              minWidth: 250,
              '& .MuiInputBase-root': { fontSize: '0.875rem' },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ fontSize: '1rem' }} />
                </InputAdornment>
              ),
              endAdornment: filters.search && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => handleFilterChange('search', '')}>
                    <Close sx={{ fontSize: '1rem' }} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>{t('categories.sortBy')}</InputLabel>
            <Select
              value={filters.sortBy}
              label={t('categories.sortBy')}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            >
              <MenuItem value="name">{t('categories.sortByName')}</MenuItem>
              <MenuItem value="crafts">{t('categories.sortByCrafts')}</MenuItem>
              <MenuItem value="createdAt">{t('categories.sortByNewest')}</MenuItem>
              <MenuItem value="updatedAt">{t('categories.sortByUpdated')}</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>{t('categories.sortOrder')}</InputLabel>
            <Select
              value={filters.sortOrder}
              label={t('categories.sortOrder')}
              onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
            >
              <MenuItem value="asc">{t('categories.ascending')}</MenuItem>
              <MenuItem value="desc">{t('categories.descending')}</MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ flexGrow: 1 }} />

          <Tooltip title={t('categories.filter')}>
            <IconButton onClick={() => setFilterDrawerOpen(true)}>
              <Badge
                color="primary"
                variant="dot"
                invisible={!filters.search}
              >
                <FilterList />
              </Badge>
            </IconButton>
          </Tooltip>

          <Tooltip title={t('categories.gridView')}>
            <IconButton
              color={viewMode === 'grid' ? 'primary' : 'default'}
              onClick={() => setViewMode('grid')}
            >
              <GridView />
            </IconButton>
          </Tooltip>

          <Tooltip title={t('categories.listView')}>
            <IconButton
              color={viewMode === 'list' ? 'primary' : 'default'}
              onClick={() => setViewMode('list')}
            >
              <ViewList />
            </IconButton>
          </Tooltip>
        </Box>
      </Paper>

      {/* Results Count */}
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          {displayedCategories.length} {t('categories.resultsFound')}
        </Typography>
        <Chip
          icon={<CategoryIcon />}
          label={`${stats.total} ${t('categories.total')}`}
          size="small"
          variant="outlined"
        />
      </Box>

      {/* Categories Display */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : displayedCategories.length === 0 ? (
        <Paper sx={{ p: 8, textAlign: 'center', borderRadius: 2 }}>
          <CategoryIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {t('categories.noCategories')}
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            {t('categories.noCategoriesDesc')}
          </Typography>
          {isAdmin && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleAddCategory}
              sx={{ mt: 2 }}
            >
              {t('categories.addFirst')}
            </Button>
          )}
        </Paper>
      ) : (
        <>
          {viewMode === 'grid' ? (
            <Grid container spacing={3}>
              {displayedCategories.map((category) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={category.id}>
                  <CategoryCard
                    category={category}
                    onEdit={handleEditCategory}
                    onDelete={handleDeleteClick}
                    onViewCrafts={handleViewCrafts}
                    isAdmin={isAdmin}
                  />
                </Grid>
              ))}
            </Grid>
          ) : (
            <CategoriesTable
              categories={displayedCategories}
              onEdit={handleEditCategory}
              onDelete={handleDeleteClick}
              onViewCrafts={handleViewCrafts}
              isAdmin={isAdmin}
            />
          )}
        </>
      )}

      {/* Filter Drawer */}
      <Drawer
        anchor="right"
        open={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: { xs: '100%', sm: 400 },
            p: 3,
          },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" fontWeight={600}>
            {t('categories.advancedFilters')}
          </Typography>
          <IconButton onClick={() => setFilterDrawerOpen(false)}>
            <Close />
          </IconButton>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              {t('categories.minCrafts')}
            </Typography>
            <TextField
              type="number"
              fullWidth
              size="small"
              placeholder={t('categories.minCraftsPlaceholder')}
            />
          </Box>

          <Box>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              {t('categories.hasCrafts')}
            </Typography>
            <FormControl fullWidth size="small">
              <Select defaultValue="all">
                <MenuItem value="all">{t('categories.all')}</MenuItem>
                <MenuItem value="with">{t('categories.withCrafts')}</MenuItem>
                <MenuItem value="without">{t('categories.withoutCrafts')}</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
            <Button
              fullWidth
              variant="contained"
              onClick={() => setFilterDrawerOpen(false)}
            >
              {t('common.apply')}
            </Button>
            <Button
              fullWidth
              variant="outlined"
              onClick={handleClearFilters}
            >
              {t('common.clear')}
            </Button>
          </Box>
        </Box>
      </Drawer>

      {/* Category Form Dialog */}
      <CategoryFormDialog
        open={formDialog.open}
        onClose={() => setFormDialog({ open: false, mode: 'add', category: null })}
        mode={formDialog.mode}
        category={formDialog.category}
        onSuccess={() => {
          fetchCategories();
          setFormDialog({ open: false, mode: 'add', category: null });
        }}
      />

      {/* Category Crafts Dialog */}
      <CategoryCraftsDialog
        open={craftsDialog.open}
        onClose={() => setCraftsDialog({ open: false, category: null })}
        category={craftsDialog.category}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, category: null })}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" fontWeight={600}>
            {t('categories.deleteTitle')}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <CategoryIcon sx={{ fontSize: 48, color: 'error.main', mb: 2 }} />
            <Typography variant="body1" gutterBottom>
              {t('categories.deleteConfirm')}
            </Typography>
            {deleteDialog.category && (
              <Typography variant="body2" color="text.secondary">
                "{deleteDialog.category.name}"
              </Typography>
            )}
            <Typography variant="caption" color="error" sx={{ display: 'block', mt: 2 }}>
              {t('categories.deleteWarning')}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => setDeleteDialog({ open: false, category: null })}
          >
            {t('common.cancel')}
          </Button>
          <Button
            fullWidth
            variant="contained"
            color="error"
            onClick={handleDeleteConfirm}
          >
            {t('common.delete')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Floating Action Button */}
      {isAdmin && (
        <Zoom in={true}>
          <Fab
            color="primary"
            sx={{
              position: 'fixed',
              bottom: 24,
              right: 24,
            }}
            onClick={handleAddCategory}
          >
            <Add />
          </Fab>
        </Zoom>
      )}
    </Container>
  );
};

export default CategoriesPage;