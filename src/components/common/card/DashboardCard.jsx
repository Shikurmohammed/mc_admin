import React from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  IconButton,
  Typography,
  Box,
  Divider,
  alpha,
} from '@mui/material';
import {
  MoreVert,
  OpenInNew,
  Refresh,
} from '@mui/icons-material';

import LoadingSpinner from '../LoadingSpinner';
const DashboardCard = ({
  title,
  subtitle,
  children,
  action,
  footer,
  loading = false,
  onRefresh,
  onViewDetails,
  headerAction = true,
  sx = {},
  elevation = 1,
}) => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Card
      elevation={elevation}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
        ...sx,
      }}
    >
      <CardHeader
        title={
          <Typography variant="h6" fontWeight={600}>
            {title}
          </Typography>
        }
        subheader={
          subtitle && (
            <Typography variant="caption" color="text.secondary">
              {subtitle}
            </Typography>
          )
        }
        action={
          headerAction && (
            <Box>
              {onRefresh && (
                <IconButton
                  size="small"
                  onClick={onRefresh}
                  disabled={loading}
                  sx={{ mr: 0.5 }}
                >
                  <Refresh fontSize="small" />
                </IconButton>
              )}
              <IconButton
                size="small"
                onClick={handleMenuClick}
              >
                <MoreVert fontSize="small" />
              </IconButton>
            </Box>
          )
        }
        sx={{
          pb: 1,
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
        }}
      />

      <CardContent sx={{ flexGrow: 1, position: 'relative' }}>
        {loading ? (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: (theme) => alpha(theme.palette.background.paper, 0.8),
              zIndex: 1,
            }}
          >
            <LoadingSpinner size={40} />
          </Box>
        ) : null}
        {children}
      </CardContent>

      {footer && (
        <>
          <Divider />
          <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
            {footer}
            {onViewDetails && (
              <IconButton size="small" onClick={onViewDetails}>
                <OpenInNew fontSize="small" />
              </IconButton>
            )}
          </CardActions>
        </>
      )}
    </Card>
  );
};

export default DashboardCard;