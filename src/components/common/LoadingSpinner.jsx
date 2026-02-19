import React from 'react';
import { Box, CircularProgress, linearProgressClasses, styled,Typography } from '@mui/material';

const StyledCircularProgress = styled(CircularProgress)(({ theme, color }) => ({
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[200],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: color || theme.palette.primary.main,
  },
}));

const LoadingSpinner = ({ size = 40, color, thickness = 4, variant = 'indeterminate', value, sx = {} }) => {
  if (variant === 'indeterminate') {
    return (
      <Box sx={{ position: 'relative', display: 'inline-flex', ...sx }}>
        <StyledCircularProgress
          variant="determinate"
          value={100}
          size={size}
          thickness={thickness}
          sx={{
            color: (theme) => theme.palette.grey[300],
          }}
        />
        <StyledCircularProgress
          variant="indeterminate"
          size={size}
          thickness={thickness}
          color={color}
          sx={{
            position: 'absolute',
            left: 0,
          }}
        />
      </Box>
    );
  }

  return (
    <Box sx={{ position: 'relative', display: 'inline-flex', ...sx }}>
      <StyledCircularProgress variant="determinate" value={value} size={size} thickness={thickness} color={color} />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="caption" component="div" color="text.secondary">
          {`${Math.round(value)}%`}
        </Typography>
      </Box>
    </Box>
  );
};

export default LoadingSpinner;