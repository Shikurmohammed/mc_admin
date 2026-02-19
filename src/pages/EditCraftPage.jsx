import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Box,
  Typography,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';
import { craftsAPI } from '../services/craftsService';

const EditCraftPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCraft = async () => {
      try {
        // Fetch craft data by ID
        const craft = await craftsAPI.getCraft(id);
        // You would set the form data here
        console.log('Craft to edit:', craft);
      } catch (err) {
        setError(err.message || 'Failed to load craft');
      } finally {
        setLoading(false);
      }
    };

    fetchCraft();
  }, [id]);

  if (loading) {
    return (
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
        <Button
          variant="contained"
          onClick={() => navigate('/my-crafts')}
          sx={{ mt: 2 }}
        >
          Back to My Crafts
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <PageHeader
        title="Edit Craft"
        subtitle="Update your craft details"
        breadcrumbs={true}
      />
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          Edit Craft Page - Under Development
        </Typography>
        <Typography color="text.secondary" paragraph>
          This page would contain a form similar to AddCraftPage for editing existing crafts.
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate('/my-crafts')}
        >
          Back to My Crafts
        </Button>
      </Paper>
    </Container>
  );
};

export default EditCraftPage;