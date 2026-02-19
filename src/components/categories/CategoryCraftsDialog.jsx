import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  IconButton,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Chip,
  Rating,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Close,
  ShoppingBag,
  Visibility,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { categoriesAPI } from '../../services/categoriesService';
import { useTranslation } from 'react-i18next';

const CategoryCraftsDialog = ({ open, onClose, category }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [crafts, setCrafts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open && category) {
      fetchCrafts();
    }
  }, [open, category]);

  const fetchCrafts = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await categoriesAPI.getCraftsByCategory(category.id);
      const craftsData = response.data || response || [];
      setCrafts(Array.isArray(craftsData) ? craftsData : []);
    } catch (err) {
      setError(err.response?.data?.message || t('errors.failedToLoadCrafts'));
    } finally {
      setLoading(false);
    }
  };

  const handleViewCraft = (craftId) => {
    onClose();
    navigate(`/crafts/${craftId}`);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'ETB',
    }).format(price);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { borderRadius: 2, minHeight: 400 } }}
    >
      <DialogTitle sx={{ py: 2, px: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h6" fontWeight={600}>
              {category?.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {crafts.length} {t('categories.craftsInCategory')}
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : crafts.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <ShoppingBag sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography color="text.secondary">
              {t('categories.noCraftsInCategory')}
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={2}>
            {crafts.map((craft) => (
              <Grid item xs={12} sm={6} key={craft.id}>
                <Card
                  sx={{
                    display: 'flex',
                    cursor: 'pointer',
                    '&:hover': {
                      boxShadow: 4,
                    },
                  }}
                  onClick={() => handleViewCraft(craft.id)}
                >
                  <CardMedia
                    component="img"
                    sx={{ width: 100, height: 100, objectFit: 'cover' }}
                    image={craft.images?.[0] || '/api/placeholder/100/100'}
                    alt={craft.title}
                  />
                  <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <CardContent sx={{ flex: '1 0 auto', p: 1.5 }}>
                      <Typography variant="subtitle2" fontWeight={600} noWrap>
                        {craft.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block" noWrap>
                        {craft.artisan?.firstName} {craft.artisan?.lastName}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                        <Rating value={craft.averageRating || 0} size="small" readOnly />
                        <Typography variant="caption" sx={{ ml: 0.5 }}>
                          ({craft.reviewCount || 0})
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="primary.main" fontWeight={600}>
                        {formatPrice(craft.price)}
                      </Typography>
                    </CardContent>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, borderTop: '1px solid', borderColor: 'divider' }}>
        <Button onClick={onClose}>
          {t('common.close')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CategoryCraftsDialog;