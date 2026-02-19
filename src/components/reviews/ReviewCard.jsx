import React, { useState } from 'react';
import {
  Paper,
  Box,
  Typography,
  Rating,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  Divider,
  alpha,
  useTheme,
  TextField,
  Button,

} from '@mui/material';
import {
  MoreVert,
  Visibility,
  ThumbUp,
  ThumbDown,
  Delete,
  Reply,
  ExpandMore,
  ExpandLess,
  CheckCircle,
  Cancel,
  Schedule,
  Verified,
} from '@mui/icons-material';
import { formatDistance } from 'date-fns';

const statusConfig = {
  APPROVED: {
    color: 'success',
    icon: <CheckCircle sx={{ fontSize: '0.875rem' }} />,
    label: 'Approved',
  },
  PENDING: {
    color: 'warning',
    icon: <Schedule sx={{ fontSize: '0.875rem' }} />,
    label: 'Pending',
  },
  REJECTED: {
    color: 'error',
    icon: <Cancel sx={{ fontSize: '0.875rem' }} />,
    label: 'Rejected',
  },
};

const ReviewCard = ({ review, userRole, onAction }) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [responseText, setResponseText] = useState('');

  const handleMenuOpen = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleAction = (action, data = {}) => {
    handleMenuClose();
    onAction(action, review.id, data);
  };

  const getInitials = (name) => {
    return name
      ?.split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Paper
      sx={{
        p: 2.5,
        borderRadius: 2,
        transition: 'all 0.3s',
        border: '1px solid',
        borderColor: 'divider',
        '&:hover': {
          boxShadow: theme.shadows[4],
          borderColor: alpha(theme.palette.primary.main, 0.3),
        },
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            src={review.user?.avatar}
            sx={{
              width: 48,
              height: 48,
              bgcolor: theme.palette.primary.main,
              border: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
            }}
          >
            {getInitials(`${review.user?.firstName} ${review.user?.lastName}`)}
          </Avatar>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <Typography variant="subtitle1" fontWeight={600}>
                {review.user?.firstName} {review.user?.lastName}
              </Typography>
              {review.isVerifiedPurchase && (
                <Tooltip title="Verified Purchase">
                  <Verified sx={{ fontSize: '1rem', color: 'primary.main' }} />
                </Tooltip>
              )}
              <Chip
                label={statusConfig[review.status]?.label || review.status}
                size="small"
                color={statusConfig[review.status]?.color}
                icon={statusConfig[review.status]?.icon}
                sx={{ height: 20, fontSize: '0.675rem' }}
              />
            </Box>
            <Typography variant="caption" color="text.secondary">
              {formatDistance(new Date(review.createdAt), new Date(), { addSuffix: true })}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Rating value={review.rating} readOnly size="small" precision={0.5} />
            <Chip
              label={review.rating.toFixed(1)}
              size="small"
              sx={{
                bgcolor: alpha(theme.palette.warning.main, 0.1),
                color: 'warning.main',
                fontWeight: 600,
                height: 20,
              }}
            />
          </Box>
          
          <IconButton size="small" onClick={handleMenuOpen}>
            <MoreVert />
          </IconButton>
        </Box>
      </Box>

      {/* Craft Info */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          mt: 2,
          p: 1.5,
          bgcolor: alpha(theme.palette.primary.main, 0.03),
          borderRadius: 2,
          cursor: 'pointer',
        }}
        onClick={() => setExpanded(!expanded)}
      >
        <Avatar
          src={review.craft?.images?.[0]}
          variant="rounded"
          sx={{ width: 40, height: 40 }}
        />
        <Box sx={{ flex: 1 }}>
          <Typography variant="body2" fontWeight={500}>
            {review.craft?.title}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            by {review.craft?.artisan?.firstName} {review.craft?.artisan?.lastName}
          </Typography>
        </Box>
        <IconButton size="small">
          {expanded ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      </Box>

      {/* Review Content */}
      <Box sx={{ mt: 2 }}>
        <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
          {review.comment}
        </Typography>
      </Box>

      {/* Review Images */}
      {review.images?.length > 0 && (
        <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
          {review.images.map((image, index) => (
            <Box
              key={index}
              component="img"
              src={image}
              sx={{
                width: 60,
                height: 60,
                borderRadius: 1,
                objectFit: 'cover',
                cursor: 'pointer',
                border: '1px solid',
                borderColor: 'divider',
              }}
            />
          ))}
        </Box>
      )}

      {/* Seller Response */}
      <Collapse in={expanded}>
        {review.sellerResponse && (
          <Box sx={{ mt: 2, p: 2, bgcolor: alpha(theme.palette.primary.main, 0.02), borderRadius: 2 }}>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              Seller Response
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {review.sellerResponse}
            </Typography>
          </Box>
        )}

        {/* Response Form (for artisans/admins) */}
        {(userRole === 'ARTISAN' || userRole === 'ADMIN') && !review.sellerResponse && (
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              multiline
              rows={2}
              placeholder="Write a response to this review..."
              value={responseText}
              onChange={(e) => setResponseText(e.target.value)}
              size="small"
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
              <Button
                size="small"
                variant="contained"
                onClick={() => handleAction('respond', { response: responseText })}
                disabled={!responseText.trim()}
              >
                Respond
              </Button>
            </Box>
          </Box>
        )}
      </Collapse>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{ sx: { minWidth: 200, borderRadius: 2 } }}
      >
        <MenuItem onClick={() => handleAction('view')}>
          <ListItemIcon>
            <Visibility fontSize="small" />
          </ListItemIcon>
          <ListItemText>View Details</ListItemText>
        </MenuItem>

        {review.status === 'PENDING' && (userRole === 'ADMIN') && (
          [
            <MenuItem key="approve" onClick={() => handleAction('approve')}>
              <ListItemIcon>
                <ThumbUp fontSize="small" color="success" />
              </ListItemIcon>
              <ListItemText>Approve</ListItemText>
            </MenuItem>,
            <MenuItem key="reject" onClick={() => handleAction('reject')}>
              <ListItemIcon>
                <ThumbDown fontSize="small" color="error" />
              </ListItemIcon>
              <ListItemText>Reject</ListItemText>
            </MenuItem>
          ]
        )}

        {(userRole === 'ADMIN') && (
          <MenuItem onClick={() => handleAction('delete')} sx={{ color: 'error.main' }}>
            <ListItemIcon>
              <Delete fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText>Delete</ListItemText>
          </MenuItem>
        )}
      </Menu>
    </Paper>
  );
};

export default ReviewCard;