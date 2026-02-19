import React from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Pagination,
  Paper,
} from '@mui/material';
import { RateReview } from '@mui/icons-material';
import ReviewCard from './ReviewCard';

const ReviewsList = ({
  reviews,
  loading,
  userRole,
  pagination,
  onPageChange,
  onReviewAction,
}) => {
  if (loading) {
    return (
      <Paper sx={{ p: 8, textAlign: 'center', borderRadius: 2 }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }} color="text.secondary">
          Loading reviews...
        </Typography>
      </Paper>
    );
  }

  if (reviews.length === 0) {
    return (
      <Paper sx={{ p: 8, textAlign: 'center', borderRadius: 2 }}>
        <RateReview sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No Reviews Found
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {pagination.total === 0 
            ? 'There are no reviews yet.'
            : 'Try adjusting your filters to see more results.'}
        </Typography>
      </Paper>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {reviews.map((review) => (
          <ReviewCard
            key={review.id}
            review={review}
            userRole={userRole}
            onAction={onReviewAction}
          />
        ))}
      </Box>

      {pagination.totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={pagination.totalPages}
            page={pagination.page}
            onChange={onPageChange}
            color="primary"
            size="large"
            showFirstButton
            showLastButton
          />
        </Box>
      )}
    </Box>
  );
};

export default ReviewsList;