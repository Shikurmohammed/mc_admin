import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Chip,
  IconButton,
  Alert,
  CircularProgress,
  FormControlLabel,
  Switch,
  Stack,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  Divider,
  Snackbar,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Save,
  ArrowBack,
  CloudUpload,
  Delete,
  AddPhotoAlternate,
  Category,
  Inventory,
  AttachMoney,
  Description,
  LocationOn,
  LocalShipping,
  Info,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { craftsAPI } from '../services/craftsService';
import { categoriesAPI } from '../services/categoriesService';
import PageHeader from '../components/common/PageHeader';

// Ethiopian colors
const ethiopianColors = {
  green: '#078930',
  yellow: '#FCDD09',
  red: '#DA121A',
  gold: '#B8860B',
  cream: '#FDF5E6',
};

const EditCraftPage = () => {
  const { id } = useParams();
  const theme = useTheme();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [categories, setCategories] = useState([]);
  const [originalImages, setOriginalImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    stock: 1,
    isAvailable: true,
    categoryIds: [],
    specifications: {
      material: '',
      dimensions: '',
      weight: '',
      color: '',
    },
    region: '',
    culturalSignificance: '',
    estimatedDelivery: '',
    isTraditional: false,
    materialSource: '',
    craftType: '',
    freeDelivery: false,
  });

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  // Fetch craft details and categories on mount
  useEffect(() => {
    fetchCraftDetails();
    fetchCategories();
  }, [id]);

  const fetchCraftDetails = async () => {
    setLoading(true);
    try {
      const craft = await craftsAPI.getCraft(id);
      
      // Populate form data
      setFormData({
        title: craft.title || '',
        description: craft.description || '',
        price: craft.price || '',
        stock: craft.stock || 1,
        isAvailable: craft.isAvailable ?? true,
        categoryIds: craft.categories?.map(c => c.id) || [],
        specifications: {
          material: craft.specifications?.material || '',
          dimensions: craft.specifications?.dimensions || '',
          weight: craft.specifications?.weight || '',
          color: craft.specifications?.color || '',
        },
        region: craft.region || '',
        culturalSignificance: craft.culturalSignificance || '',
        estimatedDelivery: craft.estimatedDelivery || '',
        isTraditional: craft.isTraditional || false,
        materialSource: craft.materialSource || '',
        craftType: craft.craftType || '',
        freeDelivery: craft.freeDelivery || false,
      });

      // Set original images
      setOriginalImages(craft.images || []);
      setImagePreviews(craft.images || []);
      
    } catch (err) {
      console.error('Error fetching craft:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load craft details');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getCategories();
      setCategories(response.data || response || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSpecificationChange = (field) => (e) => {
    setFormData(prev => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [field]: e.target.value,
      },
    }));
  };

  const handleSwitchChange = (name) => (e) => {
    setFormData(prev => ({ ...prev, [name]: e.target.checked }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = [...images];
    const newPreviews = [...imagePreviews];

    files.slice(0, 5 - (originalImages.length + images.length)).forEach(file => {
      newImages.push(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result);
        setImagePreviews([...newPreviews]);
      };
      reader.readAsDataURL(file);
    });

    setImages(newImages);
  };

  const handleRemoveImage = (index) => {
    const isOriginal = index < originalImages.length;
    
    if (isOriginal) {
      // Mark original image for deletion
      const imageUrl = originalImages[index];
      setImagesToDelete(prev => [...prev, imageUrl]);
      
      // Remove from preview
      const newPreviews = [...imagePreviews];
      newPreviews.splice(index, 1);
      setImagePreviews(newPreviews);
      
      // Remove from original images
      const newOriginalImages = [...originalImages];
      newOriginalImages.splice(index, 1);
      setOriginalImages(newOriginalImages);
    } else {
      // Remove newly uploaded image
      const newImages = [...images];
      const newPreviews = [...imagePreviews];
      const imageIndex = originalImages.length + (index - originalImages.length);
      newImages.splice(imageIndex - originalImages.length, 1);
      newPreviews.splice(index, 1);
      setImages(newImages);
      setImagePreviews(newPreviews);
    }
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('Please enter a craft title');
      return false;
    }
    if (!formData.description.trim()) {
      setError('Please enter a description');
      return false;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      setError('Please enter a valid price');
      return false;
    }
    if (formData.categoryIds.length === 0) {
      setError('Please select at least one category');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setSaving(true);
    setError('');

    try {
      const submitData = new FormData();

      // Send basic fields
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('price', formData.price.toString());
      submitData.append('stock', formData.stock.toString());
      submitData.append('isAvailable', formData.isAvailable.toString());
      submitData.append('categoryIds', formData.categoryIds.join(','));
      
      // Send specifications
      if (formData.specifications) {
        submitData.append('specifications', JSON.stringify(formData.specifications));
      }

      // Send additional fields
      if (formData.region) submitData.append('region', formData.region);
      if (formData.culturalSignificance) submitData.append('culturalSignificance', formData.culturalSignificance);
      if (formData.estimatedDelivery) submitData.append('estimatedDelivery', formData.estimatedDelivery);
      submitData.append('isTraditional', formData.isTraditional.toString());
      if (formData.materialSource) submitData.append('materialSource', formData.materialSource);
      if (formData.craftType) submitData.append('craftType', formData.craftType);
      submitData.append('freeDelivery', formData.freeDelivery.toString());

      // Send new images
      images.forEach(image => {
        submitData.append('images', image);
      });

      // Send list of images to delete
      if (imagesToDelete.length > 0) {
        submitData.append('imagesToDelete', JSON.stringify(imagesToDelete));
      }

      await craftsAPI.updateCraft(id, submitData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setSuccess('Craft updated successfully');
      
      // Navigate back after short delay
      setTimeout(() => {
        navigate('/dashboard/my-crafts');
      }, 1500);

    } catch (err) {
      console.error('Update error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to update craft');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard/my-crafts');
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <PageHeader
        title="Edit Craft"
        subtitle={`Editing: ${formData.title}`}
        breadcrumbs={true}
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

      <Paper sx={{ p: 4, borderRadius: 2 }}>
        <form>
          <Grid container spacing={4}>
            {/* Basic Information */}
            <Grid item xs={12}>
              <Typography variant="h6" fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Info color="primary" />
                Basic Information
              </Typography>
              <Divider sx={{ mb: 3 }} />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Craft Title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Price (ETB)"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleInputChange}
                required
                InputProps={{ startAdornment: <AttachMoney /> }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                multiline
                rows={4}
                required
              />
            </Grid>

            {/* Images Section */}
            <Grid item xs={12}>
              <Typography variant="h6" fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
                <AddPhotoAlternate color="primary" />
                Images
                <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                  (Max 5 images)
                </Typography>
              </Typography>
              <Divider sx={{ mb: 3 }} />
            </Grid>

            <Grid item xs={12}>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="craft-images"
                type="file"
                multiple
                onChange={handleImageUpload}
                disabled={originalImages.length + images.length >= 5}
              />
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                {imagePreviews.map((preview, index) => (
                  <Box key={index} sx={{ position: 'relative' }}>
                    <Avatar
                      src={preview}
                      variant="rounded"
                      sx={{
                        width: 100,
                        height: 100,
                        borderRadius: 2,
                        border: '2px solid',
                        borderColor: 'divider'
                      }}
                    />
                    <IconButton
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: -8,
                        right: -8,
                        backgroundColor: 'error.main',
                        color: 'white',
                        width: 24,
                        height: 24,
                        '&:hover': { backgroundColor: 'error.dark' }
                      }}
                      onClick={() => handleRemoveImage(index)}
                    >
                      <Delete sx={{ fontSize: 14 }} />
                    </IconButton>
                    {index < originalImages.length && (
                      <Chip
                        label="Existing"
                        size="small"
                        sx={{
                          position: 'absolute',
                          bottom: -8,
                          left: '50%',
                          transform: 'translateX(-50%)',
                          fontSize: '0.6rem',
                          height: 18,
                        }}
                      />
                    )}
                  </Box>
                ))}

                {originalImages.length + images.length < 5 && (
                  <label htmlFor="craft-images">
                    <Paper
                      component={Box}
                      sx={{
                        width: 100,
                        height: 100,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '2px dashed',
                        borderColor: 'divider',
                        borderRadius: 2,
                        cursor: 'pointer',
                        bgcolor: 'action.hover',
                        '&:hover': {
                          borderColor: 'primary.main',
                          bgcolor: 'action.selected',
                        },
                      }}
                    >
                      <CloudUpload sx={{ fontSize: 24, color: 'text.secondary', mb: 0.5 }} />
                      <Typography variant="caption" color="text.secondary">
                        Add Image
                      </Typography>
                    </Paper>
                  </label>
                )}
              </Box>
            </Grid>

            {/* Categories & Stock */}
            <Grid item xs={12}>
              <Typography variant="h6" fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
                <Category color="primary" />
                Categories & Stock
              </Typography>
              <Divider sx={{ mb: 3 }} />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Categories</InputLabel>
                <Select
                  multiple
                  value={formData.categoryIds}
                  onChange={(e) => setFormData({ ...formData, categoryIds: e.target.value })}
                  renderValue={(selected) => 
                    categories
                      .filter(cat => selected.includes(cat.id))
                      .map(cat => cat.name)
                      .join(', ')
                  }
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat.id} value={cat.id}>
                      <Checkbox checked={formData.categoryIds.includes(cat.id)} />
                      <ListItemText primary={cat.name} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Stock"
                name="stock"
                type="number"
                value={formData.stock}
                onChange={handleInputChange}
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isAvailable}
                    onChange={handleSwitchChange('isAvailable')}
                  />
                }
                label="Available for purchase"
              />
            </Grid>

            {/* Specifications */}
            <Grid item xs={12}>
              <Typography variant="h6" fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
                <Inventory color="primary" />
                Specifications (Optional)
              </Typography>
              <Divider sx={{ mb: 3 }} />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Material"
                value={formData.specifications.material}
                onChange={handleSpecificationChange('material')}
                placeholder="e.g., Ceramic, Wood"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Dimensions"
                value={formData.specifications.dimensions}
                onChange={handleSpecificationChange('dimensions')}
                placeholder="e.g., 10x15cm"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Weight"
                value={formData.specifications.weight}
                onChange={handleSpecificationChange('weight')}
                placeholder="e.g., 500g"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Color"
                value={formData.specifications.color}
                onChange={handleSpecificationChange('color')}
                placeholder="e.g., Blue, Red"
              />
            </Grid>

            {/* Region & Culture */}
            <Grid item xs={12}>
              <Typography variant="h6" fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
                <LocationOn color="primary" />
                Region & Culture
              </Typography>
              <Divider sx={{ mb: 3 }} />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Region</InputLabel>
                <Select
                  value={formData.region}
                  onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                  label="Region"
                >
                  <MenuItem value="">None</MenuItem>
                  <MenuItem value="addis">አዲስ አበባ (Addis Ababa)</MenuItem>
                  <MenuItem value="oromia">ኦሮሚያ (Oromia)</MenuItem>
                  <MenuItem value="amhara">አማራ (Amhara)</MenuItem>
                  <MenuItem value="tigray">ትግራይ (Tigray)</MenuItem>
                  <MenuItem value="snnpr">ደቡብ (SNNPR)</MenuItem>
                  <MenuItem value="harar">ሐረር (Harar)</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isTraditional}
                    onChange={handleSwitchChange('isTraditional')}
                  />
                }
                label="Traditional Craft"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Cultural Significance"
                name="culturalSignificance"
                value={formData.culturalSignificance}
                onChange={handleInputChange}
                multiline
                rows={2}
                placeholder="Describe the cultural importance of this craft..."
              />
            </Grid>

            {/* Delivery Information */}
            <Grid item xs={12}>
              <Typography variant="h6" fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
                <LocalShipping color="primary" />
                Delivery Information
              </Typography>
              <Divider sx={{ mb: 3 }} />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Estimated Delivery</InputLabel>
                <Select
                  value={formData.estimatedDelivery}
                  onChange={(e) => setFormData({ ...formData, estimatedDelivery: e.target.value })}
                  label="Estimated Delivery"
                >
                  <MenuItem value="">Select delivery time</MenuItem>
                  <MenuItem value="1-3">1-3 days in Addis Ababa</MenuItem>
                  <MenuItem value="3-7">3-7 days in regions</MenuItem>
                  <MenuItem value="7-14">7-14 days to remote areas</MenuItem>
                  <MenuItem value="14-21">14-21 days international</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Material Source"
                name="materialSource"
                value={formData.materialSource}
                onChange={handleInputChange}
                placeholder="e.g., Local Ethiopian materials"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Craft Type"
                name="craftType"
                value={formData.craftType}
                onChange={handleInputChange}
                placeholder="e.g., Woven, Carved, Painted"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.freeDelivery}
                    onChange={handleSwitchChange('freeDelivery')}
                  />
                }
                label="Free Delivery in Ethiopia"
              />
            </Grid>

            {/* Action Buttons */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 4 }}>
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<ArrowBack />}
                  onClick={handleCancel}
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={saving ? <CircularProgress size={20} /> : <Save />}
                  onClick={handleSubmit}
                  disabled={saving}
                  sx={{
                    bgcolor: ethiopianColors.green,
                    '&:hover': { bgcolor: ethiopianColors.green },
                  }}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default EditCraftPage;