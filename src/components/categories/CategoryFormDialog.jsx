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
  CircularProgress,
  Alert,
  Avatar,
  InputAdornment,
} from '@mui/material';
import {
  Close,
  Save,
  Image as ImageIcon,
  CloudUpload,
  Delete,
} from '@mui/icons-material';
import { categoriesAPI } from '../../services/categoriesService';
import notificationService from '../../services/notificationService';
import { useTranslation } from 'react-i18next';

const CategoryFormDialog = ({ open, onClose, mode, category, onSuccess }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (category && mode === 'edit') {
      setFormData({
        name: category.name || '',
        description: category.description || '',
        image: category.image || '',
      });
      setImagePreview(category.image || '');
    } else {
      setFormData({
        name: '',
        description: '',
        image: '',
      });
      setImagePreview('');
      setImageFile(null);
    }
    setErrors({});
    setError('');
  }, [category, mode, open]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = t('validation.nameRequired');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError(t('validation.imageTooLarge'));
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError(t('validation.invalidImageType'));
      return;
    }

    setImageFile(file);

    // Preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview('');
    setFormData(prev => ({ ...prev, image: '' }));
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      const submitData = new FormData();
      submitData.append('name', formData.name);
      if (formData.description) {
        submitData.append('description', formData.description);
      }
      if (imageFile) {
        submitData.append('image', imageFile);
      } else if (formData.image && mode === 'edit') {
        submitData.append('image', formData.image);
      }

      if (mode === 'add') {
        await categoriesAPI.createCategory(submitData);
        notificationService.success(t('categories.createSuccess'));
      } else {
        await categoriesAPI.updateCategory(category.id, submitData);
        notificationService.success(t('categories.updateSuccess'));
      }

      onSuccess();
    } catch (err) {
      console.error('Category error:', err);
      setError(err.response?.data?.message || t('errors.somethingWentWrong'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: 2 } }}
    >
      <DialogTitle sx={{ py: 2, px: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight={600}>
            {mode === 'add' ? t('categories.addNew') : t('categories.editCategory')}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {/* Image Upload */}
        <Box sx={{ mb: 3, textAlign: 'center' }}>
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="category-image"
            type="file"
            onChange={handleImageUpload}
          />
          <label htmlFor="category-image">
            <Avatar
              src={imagePreview}
              variant="rounded"
              sx={{
                width: 120,
                height: 120,
                mx: 'auto',
                mb: 1,
                cursor: 'pointer',
                border: '2px dashed',
                borderColor: 'divider',
              }}
            >
              <ImageIcon sx={{ fontSize: 40, color: 'text.secondary' }} />
            </Avatar>
          </label>
          
          {imagePreview && (
            <Button
              size="small"
              color="error"
              startIcon={<Delete />}
              onClick={handleRemoveImage}
              sx={{ mt: 1 }}
            >
              {t('common.remove')}
            </Button>
          )}

          <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
            {t('categories.imageRequirements')}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            fullWidth
            label={t('categories.name')}
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
            required
            size="small"
          />

          <TextField
            fullWidth
            label={t('categories.description')}
            name="description"
            value={formData.description}
            onChange={handleChange}
            multiline
            rows={4}
            size="small"
            placeholder={t('categories.descriptionPlaceholder')}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, borderTop: '1px solid', borderColor: 'divider', gap: 1 }}>
        <Button
          onClick={onClose}
          disabled={loading}
          variant="outlined"
        >
          {t('common.cancel')}
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={loading}
          variant="contained"
          startIcon={loading ? <CircularProgress size={20} /> : <Save />}
        >
          {loading ? t('common.saving') : t('common.save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CategoryFormDialog;