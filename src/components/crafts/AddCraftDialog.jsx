import React, { useEffect, useState, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  TextField,
  Button,
  Chip,
  IconButton,
  Alert,
  CircularProgress,
  FormControlLabel,
  Switch,
  Stack,
  Avatar,
  Paper,
  Fade,
  Zoom,
  ListItemText, FormControl, Select, MenuItem, Checkbox, InputLabel
} from '@mui/material';
import {
  Close,
  CloudUpload,
  Delete,
  AddPhotoAlternate,
  Save,
  Category,
  Inventory,
  AttachMoney,
  Description,
  LocationOn,
  LocalShipping
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { craftsAPI } from '../../services/craftsService';
import { categoriesAPI } from '../../services/categoriesService';

const AddCraftDialog = ({ open, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);

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


    //
    region: '',
    culturalSignificance: '',
    estimatedDelivery: '',
    isTraditional: false,
    materialSource: '',
    craftType: '',
  });

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  useEffect(() => {
    if (open) {
      fetchCategories();
    }
  }, [open]);

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getCategories();
      setCategories(response.data || response || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const handleClose = (event, reason) => {
    if (reason === 'backdropClick') return;
    if (reason === 'escapeKeyDown') return;


    if (!loading) {
      setFormData({
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
      });
      setImages([]);
      setImagePreviews([]);
      setError('');
      onClose();
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = [...images];
    const newPreviews = [...imagePreviews];

    files.slice(0, 5 - images.length).forEach(file => {
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
    const newImages = [...images];
    const newPreviews = [...imagePreviews];
    newImages.splice(index, 1);
    newPreviews.splice(index, 1);
    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.title.trim()) {
      setError('Please enter a craft title');
      return;
    }
    if (!formData.description.trim()) {
      setError('Please enter a description');
      return;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      setError('Please enter a valid price');
      return;
    }
    if (formData.categoryIds.length === 0) {
      setError('Please select at least one category');
      return;
    }
    if (images.length === 0) {
      setError('Please upload at least one image');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const submitData = new FormData();

      // Send as individual fields - these will be in @Body()
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('price', formData.price.toString());
      submitData.append('stock', formData.stock.toString());
      submitData.append('isAvailable', formData.isAvailable.toString());

      //  CRITICAL FIX: Send categoryIds as a SINGLE JSON string, NOT multiple fields!
      //submitData.append('categoryIds', JSON.stringify(formData.categoryIds));
      submitData.append('categoryIds', formData.categoryIds.join(','));
      //  Send specifications as JSON string
      if (formData.specifications) {
        submitData.append('specifications', JSON.stringify(formData.specifications));
      }

      //  Send images (these will be in @UploadedFiles())
      images.forEach(image => {
        submitData.append('images', image);
      });

      // DEBUG: Log FormData contents
      console.log('=== FormData Contents ===');
      for (let pair of submitData.entries()) {
        if (pair[0] === 'images') {
          console.log(pair[0] + ': File - ' + (pair[1]).name);
        } else {
          console.log(pair[0] + ': ' + pair[1]);
        }
      }

      await craftsAPI.createCraft(submitData);

      setLoading(false);
      handleClose();
      if (onSuccess) onSuccess();

    } catch (err) {
      console.error('Submit error:', err.response?.data || err);
      setLoading(false);
      setError(err.response?.data?.message || err.message || 'Failed to create craft');
    }

  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      TransitionComponent={Fade}
      transitionDuration={400}
      PaperProps={{
        sx: {
          boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
        }
      }}

    >
      <DialogTitle sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid',
        borderColor: 'divider',
        py: 2,
        px: 3,
      }}>
        <Box>
          <Typography variant="h6" fontWeight={600}>
            Create New Craft
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Share your handmade creation with the world
          </Typography>
        </Box>
        <IconButton onClick={handleClose} disabled={loading} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Stack spacing={3}>
          {/* Error Alert */}
          {error && (
            <Fade in>
              <Alert
                severity="error"
                onClose={() => setError('')}
                sx={{ borderRadius: 2 }}
              >
                {error}
              </Alert>
            </Fade>
          )}

          {/* Basic Info */}
          <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
            <Stack spacing={2.5}>
              <Box display="flex" alignItems="center" gap={1}>
                <Description color="primary" fontSize="small" />
                <Typography variant="subtitle2" fontWeight={600}>
                  Basic Information
                </Typography>
              </Box>

              <TextField
                fullWidth
                label="Craft Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Handmade Ceramic Coffee Mug"
                size="small"
                variant="outlined"
              />

              <TextField
                fullWidth
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                multiline
                rows={3}
                placeholder="Describe your craft in detail..."
                size="small"
              />
            </Stack>
          </Paper>

          {/* Pricing & Stock */}
          <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
            <Stack spacing={2.5}>
              <Box display="flex" alignItems="center" gap={1}>
                <AttachMoney color="primary" fontSize="small" />
                <Typography variant="subtitle2" fontWeight={600}>
                  Pricing & Availability
                </Typography>
              </Box>

              <Box display="flex" gap={2}>
                <TextField
                  label="Price ($)"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  InputProps={{ inputProps: { min: 0, step: 0.01 } }}
                  size="small"
                  sx={{ flex: 1 }}
                />
                <TextField
                  label="Stock"
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  InputProps={{ inputProps: { min: 0 } }}
                  size="small"
                  sx={{ flex: 1 }}
                />
              </Box>

              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isAvailable}
                    onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                    size="small"
                  />
                }
                label="Available for purchase"
              />
            </Stack>
          </Paper>

          {/* Categories */}
          <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
            <Stack spacing={2}>
              <Box display="flex" alignItems="center" gap={1}>
                <Category color="primary" fontSize="small" />
                <Typography variant="subtitle2" fontWeight={600}>
                  Categories
                </Typography>
              </Box>

              <FormControl fullWidth size="small">
                <InputLabel>Select Categories</InputLabel>
                <Select
                  multiple
                  value={formData.categoryIds}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      categoryIds: e.target.value,
                    })
                  }
                  renderValue={(selected) =>
                    categories
                      .filter((cat) => selected.includes(cat.id))
                      .map((cat) => cat.name)
                      .join(', ')
                  }
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat.id} value={cat.id}>
                      <Checkbox
                        checked={formData.categoryIds.includes(cat.id)}
                      />
                      <ListItemText primary={cat.name} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          </Paper>

          {/* Specifications */}
          <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
            <Stack spacing={2.5}>
              <Box display="flex" alignItems="center" gap={1}>
                <Inventory color="primary" fontSize="small" />
                <Typography variant="subtitle2" fontWeight={600}>
                  Specifications (Optional)
                </Typography>
              </Box>

              <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
                <TextField
                  label="Material"
                  value={formData.specifications.material}
                  onChange={(e) => setFormData({
                    ...formData,
                    specifications: { ...formData.specifications, material: e.target.value }
                  })}
                  size="small"
                  placeholder="e.g., Ceramic"
                />
                <TextField
                  label="Dimensions"
                  value={formData.specifications.dimensions}
                  onChange={(e) => setFormData({
                    ...formData,
                    specifications: { ...formData.specifications, dimensions: e.target.value }
                  })}
                  size="small"
                  placeholder="e.g., 10x15cm"
                />
                <TextField
                  label="Weight"
                  value={formData.specifications.weight}
                  onChange={(e) => setFormData({
                    ...formData,
                    specifications: { ...formData.specifications, weight: e.target.value }
                  })}
                  size="small"
                  placeholder="e.g., 500g"
                />
                <TextField
                  label="Color"
                  value={formData.specifications.color}
                  onChange={(e) => setFormData({
                    ...formData,
                    specifications: { ...formData.specifications, color: e.target.value }
                  })}
                  size="small"
                  placeholder="e.g., Blue"
                />
              </Box>
            </Stack>
          </Paper>
          {/* Region Information */}
          <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
            <Stack spacing={2.5}>
              <Box display="flex" alignItems="center" gap={1}>
                <LocationOn color="primary" fontSize="small" />
                <Typography variant="subtitle2" fontWeight={600}>
                  ክልል እና ባህል (Region & Culture)
                </Typography>
              </Box>

              <FormControl fullWidth size="small">
                <InputLabel>ክልል (Region)</InputLabel>
                <Select
                  value={formData.region}
                  label="Region"
                  onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                >
                  <MenuItem value="addis">አዲስ አበባ (Addis Ababa)</MenuItem>
                  <MenuItem value="oromia">ኦሮሚያ (Oromia)</MenuItem>
                  <MenuItem value="amhara">አማራ (Amhara)</MenuItem>
                  <MenuItem value="tigray">ትግራይ (Tigray)</MenuItem>
                  <MenuItem value="snnpr">ደቡብ (SNNPR)</MenuItem>
                  <MenuItem value="harar">ሐረር (Harar)</MenuItem>
                </Select>
              </FormControl>

              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isTraditional}
                    onChange={(e) => setFormData({ ...formData, isTraditional: e.target.checked })}
                    size="small"
                  />
                }
                label="ባህላዊ የእጅ ሥራ (Traditional Craft)"
              />

              <TextField
                fullWidth
                label="ባህላዊ ጠቀሜታ (Cultural Significance)"
                value={formData.culturalSignificance}
                onChange={(e) => setFormData({ ...formData, culturalSignificance: e.target.value })}
                multiline
                rows={2}
                size="small"
                placeholder="Describe the cultural importance of this craft..."
              />
            </Stack>
          </Paper>

          {/* Delivery Information */}
          <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
            <Stack spacing={2.5}>
              <Box display="flex" alignItems="center" gap={1}>
                <LocalShipping color="primary" fontSize="small" />
                <Typography variant="subtitle2" fontWeight={600}>
                  አቅርቦት መረጃ (Delivery Information)
                </Typography>
              </Box>

              <FormControl fullWidth size="small">
                <InputLabel>የተገመተ የአቅርቦት ጊዜ (Est. Delivery)</InputLabel>
                <Select
                  value={formData.estimatedDelivery}
                  label="Estimated Delivery"
                  onChange={(e) => setFormData({ ...formData, estimatedDelivery: e.target.value })}
                >
                  <MenuItem value="1-3">1-3 ቀናት በአዲስ አበባ</MenuItem>
                  <MenuItem value="3-7">3-7 ቀናት በክልሎች</MenuItem>
                  <MenuItem value="7-14">7-14 ቀናት ለሩቅ አካባቢዎች</MenuItem>
                  <MenuItem value="14-21">14-21 ቀናት አለም አቀፍ</MenuItem>
                </Select>
              </FormControl>

              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.freeDelivery}
                    onChange={(e) => setFormData({ ...formData, freeDelivery: e.target.checked })}
                    size="small"
                  />
                }
                label="ነፃ መላኪያ በኢትዮጵያ (Free Delivery in Ethiopia)"
              />
            </Stack>
          </Paper>

          {/* Images */}
          <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
            <Stack spacing={2.5}>
              <Box display="flex" alignItems="center" gap={1}>
                <AddPhotoAlternate color="primary" fontSize="small" />
                <Typography variant="subtitle2" fontWeight={600}>
                  Images
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  (Max 5 images)
                </Typography>
              </Box>

              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="craft-images"
                type="file"
                multiple
                onChange={handleImageUpload}
                disabled={images.length >= 5}
              />

              <Box display="flex" flexWrap="wrap" gap={2}>
                {imagePreviews.map((preview, index) => (
                  <Zoom in key={index}>
                    <Box sx={{ position: 'relative' }}>
                      <Avatar
                        src={preview}
                        variant="rounded"
                        sx={{
                          width: 80,
                          height: 80,
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
                    </Box>
                  </Zoom>
                ))}

                {images.length < 5 && (
                  <label htmlFor="craft-images">
                    <Paper
                      component={Box}
                      sx={{
                        width: 80,
                        height: 80,
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
                        Upload
                      </Typography>
                    </Paper>
                  </label>
                )}
              </Box>
            </Stack>
          </Paper>
        </Stack>
      </DialogContent>

      <DialogActions sx={{
        p: 3,
        borderTop: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.default'
      }}>
        <Button
          onClick={handleClose}
          disabled={loading}
          variant="outlined"
          sx={{ borderRadius: 2 }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={loading}
          variant="contained"
          startIcon={loading ? <CircularProgress size={20} /> : <Save />}
          sx={{ borderRadius: 2, px: 4 }}
        >
          {loading ? 'Creating...' : 'Create Craft'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddCraftDialog;