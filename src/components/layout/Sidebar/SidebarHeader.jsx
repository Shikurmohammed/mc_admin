import React from 'react';
import { Box, IconButton, Typography, useTheme } from '@mui/material';
import { MenuOpen } from '@mui/icons-material';

const SidebarHeader = ({ onClose }) => {
  const theme = useTheme();
  
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        p: 2,
        borderBottom: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.paper,
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
        Crafts Market
      </Typography>
      <IconButton onClick={onClose} size="small" sx={{ color: theme.palette.text.secondary }}>
        <MenuOpen />
      </IconButton>
    </Box>
  );
};

export default SidebarHeader;