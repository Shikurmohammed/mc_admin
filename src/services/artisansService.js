import apiService from './apiService';

export const artisansAPI = {
  getFeaturedArtisans: (params = {}) => 
    apiService.get('/artisans/featured', { params }),
  
  getArtisan: (id) => 
    apiService.get(`/artisans/${id}`),
  
  getArtisanCrafts: (id, params = {}) => 
    apiService.get(`/artisans/${id}/crafts`, { params }),
  getArtisansCount: (params = {}) =>
    apiService.get('/artisans/artisanscount', { params }),
  getCustomersCount:(params={})=>
    apiService.get('/artisans/customerscount', { params }),

   
};