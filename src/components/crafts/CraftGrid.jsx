import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Grid,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  IconButton,
  Pagination,
  CircularProgress,
  Alert,
  Paper,
  Chip,
  Divider,
  Button,
  Rating,
  Slider,
  Badge,
  alpha,
  useTheme,
} from '@mui/material';
import {
  Search,
  Refresh,
  GridView,
  ViewList,
  FilterList,
  Close,
  LocalOffer,
  LocationOn,
  Agriculture,
} from '@mui/icons-material';
import CraftCard from './CraftCard';
import { craftsAPI } from '../../services/craftsService';
import { useAuth } from '../../context/AuthContext';

// Ethiopian regions
const ethiopianRegions = [
  { value: '', label: 'ሁሉም ክልሎች (All Regions)' },
  { value: 'addis', label: 'አዲስ አበባ (Addis Ababa)' },
  { value: 'oromia', label: 'ኦሮሚያ (Oromia)' },
  { value: 'amhara', label: 'አማራ (Amhara)' },
  { value: 'tigray', label: 'ትግራይ (Tigray)' },
  { value: 'snnpr', label: 'ደቡብ (SNNPR)' },
  { value: 'harar', label: 'ሐረር (Harar)' },
  { value: 'dire', label: 'ድሬዳዋ (Dire Dawa)' },
];

const CraftGrid = ({ filters = {}, onCraftClick }) => {
  const theme = useTheme();
  const { user, isAuthenticated } = useAuth();
  
  const [crafts, setCrafts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [minRating, setMinRating] = useState(0);
  const [viewMode, setViewMode] = useState('grid');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const sortOptions = [
    { value: 'newest', label: 'አዲስ (Newest First)' },
    { value: 'oldest', label: 'የቀድሞ (Oldest First)' },
    { value: 'price_low', label: 'ዋጋ፡ ከዝቅተኛ ወደ ከፍተኛ (Price: Low to High)' },
    { value: 'price_high', label: 'ዋጋ፡ ከከፍተኛ ወደ ዝቅተኛ (Price: High to Low)' },
    { value: 'rating', label: 'ከፍተኛ ደረጃ የተሰጠው (Top Rated)' },
    { value: 'popular', label: 'ታዋቂ (Most Popular)' },
  ];

  // Helper to map UI sort to API params
  const getSortParams = (sortValue) => {
    switch (sortValue) {
      case 'price_low': return { sortBy: 'price', sortOrder: 'ASC' };
      case 'price_high': return { sortBy: 'price', sortOrder: 'DESC' };
      case 'newest': return { sortBy: 'createdAt', sortOrder: 'DESC' };
      case 'oldest': return { sortBy: 'createdAt', sortOrder: 'ASC' };
      case 'rating': return { sortBy: 'averageRating', sortOrder: 'DESC' };
      case 'popular': return { sortBy: 'views', sortOrder: 'DESC' };
      default: return { sortBy: 'createdAt', sortOrder: 'DESC' };
    }
  };

  const fetchCrafts = useCallback(async () => {
    setLoading(true);
    try {
      const sortMapping = getSortParams(sortBy);
      const params = {
        page,
        limit: 12,
        ...sortMapping,
        ...(searchQuery && { search: searchQuery }),
        ...(selectedCategory && { category: selectedCategory }),
        ...(selectedRegion && { region: selectedRegion }),
        minPrice: priceRange[0],
        maxPrice: priceRange[1],
        minRating,
        ...filters
      };

      const res = await craftsAPI.getCrafts(params);
      const data = res?.data || res; 
      
      const items = Array.isArray(data) ? data : (data.items || []);
      const total = data.meta?.totalPages || 1;

      setCrafts(items);
      setTotalPages(total);
    } catch (err) {
      setError(err?.message || 'Failed to load crafts');
    } finally {
      setLoading(false);
    }
  }, [page, sortBy, searchQuery, selectedCategory, selectedRegion, priceRange, minRating, JSON.stringify(filters)]);

  // Main Effect
  useEffect(() => {
    fetchCrafts();
  }, [fetchCrafts]);

  // Categories Effect
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await craftsAPI.getCraftCategories();
        const data = res?.data || res;
        setCategories(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    };
    fetchCategories();
  }, []);

  // Search Debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleAddToCart = (craft) => {
    console.log('Add to cart:', craft);
    // Implement cart logic with Ethiopian Birr
  };

  const handleFavorite = (id, fav) => {
    console.log(fav ? 'Added to favorites' : 'Removed from favorites', id);
  };

  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
    setPage(1);
  };

  const handleRatingChange = (rating) => {
    setMinRating(rating);
    setPage(1);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedRegion('');
    setPriceRange([0, 50000]);
    setMinRating(0);
    setSortBy('newest');
    setPage(1);
  };

  if (error) return <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>;

  return (
    <Box>
      {/* Mobile Filter Toggle */}
      <Box sx={{ display: { xs: 'block', md: 'none' }, mb: 2 }}>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<FilterList />}
          onClick={() => setShowFilters(!showFilters)}
        >
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Filters Sidebar */}
        <Grid item xs={12} md={3} sx={{ display: { xs: showFilters ? 'block' : 'none', md: 'block' } }}>
          <Paper sx={{ p: 2, borderRadius: 2, position: 'sticky', top: 80 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" fontWeight={600}>
                ማጣሪያ (Filters)
              </Typography>
              <IconButton size="small" onClick={clearFilters}>
                <Refresh />
              </IconButton>
            </Box>

            <Divider sx={{ mb: 2 }} />

            {/* Category Filter */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                ምድብ (Category)
              </Typography>
              <FormControl fullWidth size="small">
                <Select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setPage(1);
                  }}
                >
                  <MenuItem value="">ሁሉም (All)</MenuItem>
                  {categories.map((cat) => (
                    <MenuItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* Region Filter */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                ክልል (Region)
              </Typography>
              <FormControl fullWidth size="small">
                <Select
                  value={selectedRegion}
                  onChange={(e) => {
                    setSelectedRegion(e.target.value);
                    setPage(1);
                  }}
                >
                  {ethiopianRegions.map((region) => (
                    <MenuItem key={region.value} value={region.value}>
                      {region.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* Price Range */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                የዋጋ ክልል (Price Range)
              </Typography>
              <Slider
                value={priceRange}
                onChange={handlePriceChange}
                valueLabelDisplay="auto"
                min={0}
                max={50000}
                step={500}
                valueLabelFormat={(value) => `ETB ${value.toLocaleString()}`}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                <Typography variant="caption">
                  ETB {priceRange[0].toLocaleString()}
                </Typography>
                <Typography variant="caption">
                  ETB {priceRange[1].toLocaleString()}
                </Typography>
              </Box>
            </Box>

            {/* Rating Filter */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                ዝቅተኛ ደረጃ (Min. Rating)
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {[0, 1, 2, 3, 4].map((rating) => (
                  <Chip
                    key={rating}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        {rating}+ <Rating value={rating} readOnly size="small" />
                      </Box>
                    }
                    onClick={() => handleRatingChange(rating)}
                    color={minRating === rating ? 'primary' : 'default'}
                    variant={minRating === rating ? 'filled' : 'outlined'}
                    size="small"
                  />
                ))}
              </Box>
            </Box>

            {/* Active Filters */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                ንቁ ማጣሪያ (Active Filters)
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selectedCategory && (
                  <Chip
                    label={categories.find(c => c.id === selectedCategory)?.name}
                    onDelete={() => setSelectedCategory('')}
                    size="small"
                  />
                )}
                {selectedRegion && (
                  <Chip
                    label={ethiopianRegions.find(r => r.value === selectedRegion)?.label}
                    onDelete={() => setSelectedRegion('')}
                    size="small"
                  />
                )}
                {priceRange[0] > 0 || priceRange[1] < 50000 ? (
                  <Chip
                    label={`ETB ${priceRange[0].toLocaleString()} - ${priceRange[1].toLocaleString()}`}
                    onDelete={() => setPriceRange([0, 50000])}
                    size="small"
                  />
                ) : null}
                {minRating > 0 && (
                  <Chip
                    label={`${minRating}+ ⭐`}
                    onDelete={() => setMinRating(0)}
                    size="small"
                  />
                )}
                {!selectedCategory && !selectedRegion && priceRange[0] === 0 && priceRange[1] === 50000 && minRating === 0 && (
                  <Typography variant="caption" color="text.secondary">
                    ንቁ ማጣሪያ የለም (No active filters)
                  </Typography>
                )}
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Sort Options */}
            <Box>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                ደርድር (Sort By)
              </Typography>
              <FormControl fullWidth size="small">
                <Select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setPage(1);
                  }}
                >
                  {sortOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Paper>
        </Grid>

        {/* Crafts Grid */}
        <Grid item xs={12} md={9}>
          {/* Search and View Toggle */}
          <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
            <TextField
              fullWidth
              size="small"
              placeholder="ፈልግ የእጅ ሥራዎች... (Search crafts...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
                endAdornment: searchQuery && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setSearchQuery('')}>
                      <Close fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton
                color={viewMode === 'grid' ? 'primary' : 'default'}
                onClick={() => setViewMode('grid')}
              >
                <GridView />
              </IconButton>
              <IconButton
                color={viewMode === 'list' ? 'primary' : 'default'}
                onClick={() => setViewMode('list')}
              >
                <ViewList />
              </IconButton>
            </Box>
          </Box>

          {/* Results Count */}
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              {crafts.length} ውጤቶች ተገኝተዋል (results found)
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Chip
                icon={<LocalOffer />}
                label={`ETB ${priceRange[0].toLocaleString()} - ${priceRange[1].toLocaleString()}`}
                size="small"
              />
              {minRating > 0 && (
                <Chip
                  icon={<Rating value={minRating} readOnly size="small" />}
                  label={`${minRating}+`}
                  size="small"
                />
              )}
            </Box>
          </Box>

          {/* Loading State */}
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
              <CircularProgress />
            </Box>
          ) : crafts.length === 0 ? (
            <Paper sx={{ p: 5, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                ምንም የእጅ ሥራዎች አልተገኙም
              </Typography>
              <Typography variant="body2" color="text.secondary">
                No crafts found matching your criteria. Try adjusting your filters.
              </Typography>
              <Button variant="outlined" onClick={clearFilters} sx={{ mt: 2 }}>
                ማጣሪያ አጽዳ (Clear Filters)
              </Button>
            </Paper>
          ) : (
            <>
              {/* Crafts Grid */}
              <Grid container spacing={3}>
                {crafts.map((craft) => (
                  <Grid
                    key={craft.id}
                    item
                    xs={12}
                    sm={viewMode === 'grid' ? 6 : 12}
                    md={viewMode === 'grid' ? 4 : 12}
                    lg={viewMode === 'grid' ? 3 : 12}
                  >
                    <CraftCard
                      craft={craft}
                      onAddToCart={handleAddToCart}
                      onFavorite={handleFavorite}
                      onClick={onCraftClick}
                    />
                  </Grid>
                ))}
              </Grid>

              {/* Pagination */}
              {totalPages > 1 && (
                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={(_, v) => setPage(v)}
                    color="primary"
                    size="large"
                    showFirstButton
                    showLastButton
                  />
                </Box>
              )}
            </>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default CraftGrid;













// import React, { useState, useEffect, useCallback } from 'react';
// import {
//   Grid, Box, TextField, FormControl, InputLabel, Select, MenuItem,
//   Pagination, CircularProgress, Alert, Typography, IconButton, InputAdornment,
// } from '@mui/material';
// import { Search, GridView, ViewList, Refresh } from '@mui/icons-material';
// import CraftCard from './CraftCard';
// import { craftsAPI } from '../../services/craftsService';
// import { useAuth } from '../../context/AuthContext';

// const CraftGrid = ({ filters = {}, onCraftClick }) => {
//   const { user, isAuthenticated } = useAuth();
  
//   const [crafts, setCrafts] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [sortBy, setSortBy] = useState('newest');
//   const [selectedCategory, setSelectedCategory] = useState('');
//   const [viewMode, setViewMode] = useState('grid');
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);

//   const sortOptions = [
//     { value: 'newest', label: 'Newest First' },
//     { value: 'oldest', label: 'Oldest First' },
//     { value: 'price_low', label: 'Price: Low to High' },
//     { value: 'price_high', label: 'Price: High to Low' },
//   ];

//   // Helper to map UI sort to API params
//   const getSortParams = (sortValue) => {
//     switch (sortValue) {
//       case 'price_low': return { sortBy: 'price', sortOrder: 'ASC' };
//       case 'price_high': return { sortBy: 'price', sortOrder: 'DESC' };
//       case 'newest': return { sortBy: 'createdAt', sortOrder: 'DESC' };
//       case 'oldest': return { sortBy: 'createdAt', sortOrder: 'ASC' };
//       default: return { sortBy: 'createdAt', sortOrder: 'DESC' };
//     }
//   };

//   const fetchCrafts = useCallback(async () => {
//     setLoading(true);
//     try {
//       const sortMapping = getSortParams(sortBy);
//       const params = {
//         page,
//         limit: 12,
//         ...sortMapping,
//         ...(searchQuery && { search: searchQuery }),
//         ...(selectedCategory && { category: selectedCategory }),
//         ...filters
//       };

//       const res = await craftsAPI.getCrafts(params);
//       const data = res?.data || res; 
      
//       const items = Array.isArray(data) ? data : (data.items || []);
//       const total = data.meta?.totalPages || 1;

//       setCrafts(items);
//       setTotalPages(total);
//     } catch (err) {
//       setError(err?.message || 'Failed to load crafts');
//     } finally {
//       setLoading(false);
//     }
//   }, [page, sortBy, searchQuery, selectedCategory, JSON.stringify(filters)]);

//   // Main Effect
//   useEffect(() => {
//     fetchCrafts();
//   }, [fetchCrafts]);

//   // Categories Effect
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const res = await craftsAPI.getCraftCategories();
//         const data = res?.data || res;
//         setCategories(Array.isArray(data) ? data : []);
//       } catch (err) {
//         console.error('Failed to load categories', err);
//       }
//     };
//     fetchCategories();
//   }, []);

//   // Search Debounce
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       if (searchQuery) setPage(1);
//     }, 500);
//     return () => clearTimeout(timer);
//   }, [searchQuery]);

//   const handleAddToCart = (craft) => console.log('Add to cart:', craft);
//   const handleFavorite = (id, fav) => console.log(fav ? 'Fav +' : 'Fav -', id);

//   if (error) return <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>;

//   return (
//     <Box>
//       <Box sx={{ mb: 3, p: 2, borderRadius: 2, bgcolor: 'background.paper' }}>
//         <Grid container spacing={2} alignItems="center">
//           <Grid item xs={12} md={4}>
//             <TextField
//               fullWidth
//               size="small"
//               placeholder="Search crafts..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               InputProps={{
//                 startAdornment: <InputAdornment position="start"><Search /></InputAdornment>,
//               }}
//             />
//           </Grid>

//           <Grid item xs={12} md={3}>
//             <FormControl fullWidth size="small">
//               <InputLabel>Category</InputLabel>
//               <Select
//                 value={selectedCategory}
//                 label="Category"
//                 onChange={(e) => {
//                   setSelectedCategory(e.target.value);
//                   setPage(1);
//                 }}
//               >
//                 <MenuItem value="">All Categories</MenuItem>
//                 {categories.map((c) => (
//                   <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//           </Grid>

//           <Grid item xs={12} md={3}>
//             <FormControl fullWidth size="small">
//               <InputLabel>Sort By</InputLabel>
//               <Select
//                 value={sortBy}
//                 label="Sort By"
//                 onChange={(e) => {
//                   setSortBy(e.target.value);
//                   setPage(1);
//                 }}
//               >
//                 {sortOptions.map((o) => (
//                   <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//           </Grid>

//           <Grid item xs={12} md={2}>
//             <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
//               <IconButton color={viewMode === 'grid' ? 'primary' : 'default'} onClick={() => setViewMode('grid')}><GridView /></IconButton>
//               <IconButton color={viewMode === 'list' ? 'primary' : 'default'} onClick={() => setViewMode('list')}><ViewList /></IconButton>
//               <IconButton onClick={fetchCrafts}><Refresh /></IconButton>
//             </Box>
//           </Grid>
//         </Grid>
//       </Box>

//       {loading ? (
//         <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress /></Box>
//       ) : crafts.length === 0 ? (
//         <Typography align="center" sx={{ py: 5 }}>No crafts found.</Typography>
//       ) : (
//         <>
//           <Grid container spacing={3}>
//             {crafts.map((craft) => (
//               <Grid key={craft.id} item xs={12} sm={viewMode === 'grid' ? 6 : 12} md={viewMode === 'grid' ? 4 : 12} lg={viewMode === 'grid' ? 3 : 12}>
//                 <CraftCard craft={craft} onAddToCart={handleAddToCart} onFavorite={handleFavorite} onClick={onCraftClick} />
//               </Grid>
//             ))}
//           </Grid>

//           {totalPages > 1 && (
//             <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
//               <Pagination count={totalPages} page={page} onChange={(_, v) => setPage(v)} color="primary" />
//             </Box>
//           )}
//         </>
//       )}
//     </Box>
//   );
// };

// export default CraftGrid;
