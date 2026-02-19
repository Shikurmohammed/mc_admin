import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Box,
  Typography,
  Button,
  Chip,
  Rating,
  Divider,
  Alert,
  CircularProgress,
  IconButton,
  Tab,
  Tabs,
  TextField,
  Avatar,
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  ShoppingCart,
  Share,
  ArrowBack,
  Store,
  RateReview,
  Photo,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';
import { craftsAPI } from '../services/craftsService';
import {reviewsAPI} from '../services/reviewsService';
import { useAuth } from '../context/AuthContext';

const CraftDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [craft, setCraft] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchCraftData = async () => {
      try {
        setLoading(true);
        
        // Fetch craft data
        const craftData = await craftsAPI.getCraft(id);
        setCraft(craftData);
        
        // Fetch reviews
        const reviewsData = await reviewsAPI.getCraftReviews(id);
        setReviews(reviewsData);
        
      } catch (err) {
        setError(err.message || 'Failed to load craft details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCraftData();
    }
  }, [id]);

  const handleAddToCart = () => {
    console.log('Adding to cart:', craft, quantity);
    // Implement cart logic
  };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // Implement favorite logic
  };

  const handleContactArtisan = () => {
    console.log('Contact artisan:', craft.artisan);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
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

  if (error || !craft) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 2 }}>
          {error || 'Craft not found'}
        </Alert>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/crafts')}
          sx={{ mt: 2 }}
        >
          Back to Crafts
        </Button>
      </Container>
    );
  }

  const tabs = [
    { label: 'Details', value: 'details' },
    { label: 'Specifications', value: 'specifications' },
    { label: `Reviews (${reviews.length})`, value: 'reviews' },
    { label: 'Shipping', value: 'shipping' },
  ];

  return (
    <Container maxWidth="lg">
      <PageHeader
        title={craft.title}
        subtitle="Craft Details"
        breadcrumbs={true}
        actions={[
          {
            label: 'Back to Crafts',
            icon: <ArrowBack />,
            onClick: () => navigate('/crafts'),
            variant: 'outlined',
          },
        ]}
      />

      <Grid container spacing={4}>
        {/* Left Column - Images */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Box sx={{ position: 'relative', height: 400 }}>
              <img
                src={craft.images?.[selectedImage] || '/api/placeholder/600/400'}
                alt={craft.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  borderRadius: 8,
                }}
              />
              <IconButton
                sx={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  backgroundColor: 'rgba(255,255,255,0.9)',
                }}
                onClick={handleToggleFavorite}
              >
                {isFavorite ? <Favorite color="error" /> : <FavoriteBorder />}
              </IconButton>
            </Box>
          </Paper>
          
          {/* Thumbnail Images */}
          {craft.images && craft.images.length > 1 && (
            <Grid container spacing={1}>
              {craft.images.map((image, index) => (
                <Grid item xs={3} key={index}>
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 0.5,
                      cursor: 'pointer',
                      border: selectedImage === index ? '2px solid primary.main' : '1px solid divider',
                    }}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img
                      src={image}
                      alt={`${craft.title} ${index + 1}`}
                      style={{
                        width: '100%',
                        height: 80,
                        objectFit: 'cover',
                        borderRadius: 4,
                      }}
                    />
                  </Paper>
                </Grid>
              ))}
            </Grid>
          )}
        </Grid>

        {/* Right Column - Details */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              {craft.title}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Rating value={craft.averageRating || 0} readOnly precision={0.5} />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                ({craft.reviewCount || 0} reviews)
              </Typography>
            </Box>
            
            <Typography variant="h3" color="primary" fontWeight={700} gutterBottom>
              ${parseFloat(craft.price).toFixed(2)}
            </Typography>
            
            <Typography variant="body1" paragraph>
              {craft.description}
            </Typography>
            
            {/* Categories */}
            {craft.categories && craft.categories.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Categories:
                </Typography>
                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                  {craft.categories.map((category, index) => (
                    <Chip
                      key={index}
                      label={category.name}
                      size="small"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Box>
            )}
            
            {/* Stock Status */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Availability:
              </Typography>
              <Typography
                variant="body1"
                color={craft.stock > 0 ? 'success.main' : 'error.main'}
                fontWeight={600}
              >
                {craft.stock > 0 
                  ? `In Stock (${craft.stock} available)` 
                  : 'Out of Stock'}
              </Typography>
            </Box>
            
            {/* Quantity Selector */}
            {craft.stock > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Quantity:
                </Typography>
                <TextField
                  type="number"
                  value={quantity}
                  onChange={(e) => {
                    const value = Math.max(1, Math.min(craft.stock, parseInt(e.target.value) || 1));
                    setQuantity(value);
                  }}
                  size="small"
                  sx={{ width: 100 }}
                  inputProps={{ min: 1, max: craft.stock }}
                />
              </Box>
            )}
            
            {/* Action Buttons */}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  startIcon={<ShoppingCart />}
                  onClick={handleAddToCart}
                  disabled={craft.stock === 0}
                >
                  {craft.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  fullWidth
                  variant="outlined"
                  size="large"
                  startIcon={<Store />}
                  onClick={handleContactArtisan}
                >
                  Contact Artisan
                </Button>
              </Grid>
            </Grid>
          </Paper>
          
          {/* Artisan Info */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight={600}>
              About the Artisan
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar
                src={craft.artisan?.avatar}
                sx={{ width: 60, height: 60 }}
              >
                {craft.artisan?.firstName?.charAt(0)}
              </Avatar>
              <Box>
                <Typography variant="subtitle1" fontWeight={600}>
                  {craft.artisan?.firstName} {craft.artisan?.lastName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Joined {new Date(craft.artisan?.createdAt).toLocaleDateString()}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Tabs Section */}
      <Paper sx={{ mt: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={handleTabChange}>
            {tabs.map((tab, index) => (
              <Tab key={index} label={tab.label} />
            ))}
          </Tabs>
        </Box>
        
        <Box sx={{ p: 3 }}>
          {activeTab === 0 && (
            <Typography variant="body1">
              {craft.description}
            </Typography>
          )}
          
          {activeTab === 1 && (
            <Grid container spacing={2}>
              {craft.specifications && Object.entries(craft.specifications).map(([key, value]) => (
                <Grid item xs={12} sm={6} key={key}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {key.charAt(0).toUpperCase() + key.slice(1)}:
                  </Typography>
                  <Typography variant="body1">
                    {value || 'Not specified'}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          )}
          
          {activeTab === 2 && (
            <Box>
              {reviews.length === 0 ? (
                <Typography color="text.secondary">
                  No reviews yet. Be the first to review this craft!
                </Typography>
              ) : (
                reviews.map((review) => (
                  <Paper key={review.id} sx={{ p: 2, mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar src={review.user?.avatar} sx={{ width: 32, height: 32 }}>
                          {review.user?.firstName?.charAt(0)}
                        </Avatar>
                        <Typography variant="body2" fontWeight={600}>
                          {review.user?.firstName}
                        </Typography>
                      </Box>
                      <Rating value={review.rating} readOnly size="small" />
                    </Box>
                    <Typography variant="body2">
                      {review.comment}
                    </Typography>
                  </Paper>
                ))
              )}
            </Box>
          )}
          
          {activeTab === 3 && (
            <Box>
              <Typography variant="body1" paragraph>
                Shipping information would be displayed here.
              </Typography>
            </Box>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default CraftDetailPage;