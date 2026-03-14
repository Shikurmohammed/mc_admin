
import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { Link } from 'react-router-dom'; // Or 'next/link' for Next.js

const NotFoundPage = () => {
  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          textAlign: 'center',
        }}
      >
        <Typography variant="h1" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          404
        </Typography>
        <Typography variant="h4" component="h2" gutterBottom>
          Page Not Found
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          The page you are looking for doesn't exist or has been moved.
        </Typography>
        <Button 
          variant="contained" 
          component={Link} 
          to="/" 
          size="large"
          sx={{ textTransform: 'none', borderRadius: 2 }}
        >
          Back to Home
        </Button>
      </Box>
    </Container>
  );
};

export default NotFoundPage;
