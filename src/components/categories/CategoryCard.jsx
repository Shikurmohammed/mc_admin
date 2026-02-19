import React, { useState } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Box,
  Chip,
  IconButton,
  Tooltip,
  Badge,
  alpha,
  useTheme,
  Collapse,
  Button,
} from '@mui/material';
import {
  Edit,
  Delete,
  Visibility,
  Inventory,
  ExpandMore,
  ExpandLess,
  Image as ImageIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const CategoryCard = ({ category, onEdit, onDelete, onViewCrafts, isAdmin }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const craftCount = category.crafts?.length || 0;
  const hasCrafts = craftCount > 0;

  const handleViewCrafts = () => {
    if (hasCrafts) {
      onViewCrafts(category);
    } else {
      navigate(`/crafts?category=${category.id}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
    >
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          borderRadius: 2,
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: theme.shadows[8],
          },
        }}
      >
        {/* Image */}
        <Box sx={{ position: 'relative', height: 160, bgcolor: 'grey.100' }}>
          {category.image && !imageError ? (
            <CardMedia
              component="img"
              height="160"
              image={category.image}
              alt={category.name}
              onError={() => setImageError(true)}
              sx={{ objectFit: 'cover' }}
            />
          ) : (
            <Box
              sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: alpha(theme.palette.primary.main, 0.1),
              }}
            >
              <ImageIcon sx={{ fontSize: 48, color: 'text.secondary', opacity: 0.5 }} />
            </Box>
          )}

          {/* Craft Count Badge */}
          <Badge
            badgeContent={craftCount}
            color={hasCrafts ? 'primary' : 'default'}
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              '& .MuiBadge-badge': {
                fontSize: '0.75rem',
                height: 20,
                minWidth: 20,
              },
            }}
          />
        </Box>

        <CardContent sx={{ flexGrow: 1, p: 2 }}>
          {/* Category Name */}
          <Typography
            variant="h6"
            fontWeight={600}
            gutterBottom
            sx={{
              fontSize: '1rem',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {category.name}
          </Typography>

          {/* Description */}
          {category.description && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 1,
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: expanded ? 10 : 2,
                WebkitBoxOrient: 'vertical',
              }}
            >
              {category.description}
            </Typography>
          )}

          {/* Expand Button */}
          {category.description?.length > 100 && (
            <Button
              size="small"
              onClick={() => setExpanded(!expanded)}
              sx={{ textTransform: 'none', fontSize: '0.7rem', p: 0 }}
            >
              {expanded ? t('common.showLess') : t('common.showMore')}
              {expanded ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
            </Button>
          )}

          {/* Crafts Preview */}
          {hasCrafts && (
            <Box sx={{ mt: 1, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
              {category.crafts.slice(0, 3).map((craft) => (
                <Chip
                  key={craft.id}
                  label={craft.title}
                  size="small"
                  sx={{ fontSize: '0.6rem', height: 20 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/crafts/${craft.id}`);
                  }}
                />
              ))}
              {craftCount > 3 && (
                <Chip
                  label={`+${craftCount - 3}`}
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: '0.6rem', height: 20 }}
                />
              )}
            </Box>
          )}
        </CardContent>

        <CardActions sx={{ p: 2, pt: 0, justifyContent: 'space-between' }}>
          <Tooltip title={t('categories.viewCrafts')}>
            <IconButton
              size="small"
              onClick={handleViewCrafts}
              color={hasCrafts ? 'primary' : 'default'}
            >
              <Inventory fontSize="small" />
            </IconButton>
          </Tooltip>

          <Box>
            {isAdmin && (
              <>
                <Tooltip title={t('common.edit')}>
                  <IconButton
                    size="small"
                    onClick={() => onEdit(category)}
                    sx={{ mr: 0.5 }}
                  >
                    <Edit fontSize="small" />
                  </IconButton>
                </Tooltip>

                <Tooltip title={t('common.delete')}>
                  <IconButton
                    size="small"
                    onClick={() => onDelete(category)}
                    color="error"
                    disabled={hasCrafts}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </Tooltip>
              </>
            )}
          </Box>
        </CardActions>
      </Card>
    </motion.div>
  );
};

export default CategoryCard;