

import apiService from './apiService';

export const reviewsAPI = {
  getReviews: (params = {}) => {
    const { page = 1, limit = 10, status, search, rating, craftId, startDate, endDate } = params;
    return apiService.get('/reviews', {
      params: { page, limit, status, search, rating, craftId, startDate, endDate },
    });
  },

  getReview: (reviewId) =>
    apiService.get(`/reviews/${reviewId}`),

  getCraftReviews: (craftId, params = {}) =>
    apiService.get(`/reviews/craft/${craftId}`, { params }),

  createReview: (reviewData) =>
    apiService.post('/reviews', reviewData),

  updateReview: (reviewId, reviewData) =>
    apiService.patch(`/reviews/${reviewId}`, reviewData),

  deleteReview: (reviewId) =>
    apiService.delete(`/reviews/${reviewId}`),

  approveReview: (reviewId) =>
    apiService.patch(`/reviews/${reviewId}/approve`),

  rejectReview: (reviewId) =>
    apiService.patch(`/reviews/${reviewId}/reject`),

  respondToReview: (reviewId, data) =>
    apiService.post(`/reviews/${reviewId}/respond`, data),

  getReviewStats: () =>
    apiService.get('/reviews/stats'),

  exportReviews: (filters = {}) =>
    apiService.get('/reviews/export', {
      params: filters,
      responseType: 'blob',
    }),
      getTestimonials: (params = {}) => 
    apiService.get('/reviews/testimonials', { params }),

};


// import apiService from './apiService';

// export const reviewsAPI = {
//   getReviews: () =>
//     apiService.get('/reviews'),

//   getReview: (reviewId) =>
//     apiService.get(`/reviews/${reviewId}`),

//   getCraftReviews: (craftId) =>
//     apiService.get(`/reviews/craft/${craftId}`),

//   createReview: (reviewData) =>
//     apiService.post('/reviews', reviewData),

//   updateReview: (reviewId, reviewData) =>
//     apiService.patch(`/reviews/${reviewId}`, reviewData),

//   deleteReview: (reviewId) =>
//     apiService.delete(`/reviews/${reviewId}`),
// };
