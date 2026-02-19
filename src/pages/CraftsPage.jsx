

// 1. React Hooks
import React, { useState, useEffect } from 'react';

// 2. MUI Components
import { 
  Container, Paper, Box, Grid, Typography, Button, 
  Chip, Tabs, Tab, TextField, MenuItem, Tooltip, 
  IconButton, Avatar, Rating, Drawer, Zoom, Fab 
} from '@mui/material';

// 3. MUI Utilities (for the 'alpha' error)
import { useTheme, alpha } from '@mui/material/styles';
import {
  Add,
  MoreVert,
  Edit,
  Delete,
  Visibility,
  Inventory,
  Refresh,
  FilterList,
  Close,
  ShoppingBag,
  Favorite,
  Share,
  Store,
  LocalFireDepartment,
  NewReleases,
  TrendingUp,
  Agriculture,
  Spa,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';
import CraftCard from '../components/crafts/CraftCard';
import { craftsAPI } from '../services/craftsService';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import AddCraftDialog from '../components/crafts/AddCraftDialog';
import CraftGrid from '../components/crafts/CraftGrid';

// Ethiopian traditional colors
const ethiopianColors = {
  green: '#078930', // Ethiopian flag green
  yellow: '#FCDD09', // Ethiopian flag yellow
  red: '#DA121A', // Ethiopian flag red
  blue: '#0F47AF', // Ethiopian blue
  gold: '#B8860B', // Traditional gold
  brown: '#8B4513', // Coffee brown
  ochre: '#CC7722', // Traditional ochre
  cream: '#FDF5E6', // Traditional cotton cream
};

const CraftsPage = () => {
  const theme = useTheme();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [featuredCrafts, setFeaturedCrafts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [filters, setFilters] = useState({
    region: '',
    material: '',
    priceRange: '',
    occasion: '',
  });

  // Ethiopian regions known for crafts
  const regions = [
    { value: 'all', label: 'All Regions', icon: '🇪🇹' },
    { value: 'addis', label: 'Addis Ababa', icon: '🏛️' },
    { value: 'harar', label: 'Harar', icon: '🏘️' },
    { value: 'tigray', label: 'Tigray', icon: '⛰️' },
    { value: 'oromia', label: 'Oromia', icon: '🌾' },
    { value: 'southern', label: 'SNNPR', icon: '🎨' },
     { value: 'gondar', label: 'Gondar', icon: '🏰' },
    { value: 'lalibela', label: 'Lalibela', icon: '⛪' },
  ];

  // Traditional Ethiopian crafts categories
  const craftCategories = [
    { id: 1, name: 'ሸክላ (Pottery)', count: 156, icon: '🏺', color: ethiopianColors.brown },
    { id: 2, name: 'ጥልፍ (Textiles)', count: 243, icon: '🧵', color: ethiopianColors.green },
    { id: 3, name: 'ወርቅ (Gold)', count: 89, icon: '💍', color: ethiopianColors.gold },
    { id: 4, name: 'ቅርጫት (Basketry)', count: 167, icon: '🧺', color: ethiopianColors.ochre },
    { id: 5, name: 'እንጨት (Woodwork)', count: 98, icon: '🪵', color: ethiopianColors.brown },
    { id: 6, name: 'ቆዳ (Leather)', count: 76, icon: '🧤', color: ethiopianColors.red },
    { id: 7, name: 'ብረት (Metal)', count: 54, icon: '⚒️', color: ethiopianColors.blue },
    { id: 8, name: 'ጌጣጌጥ (Jewelry)', count: 134, icon: '💎', color: ethiopianColors.gold },
  ];

  // Ethiopian cultural events/seasons
  const occasions = [
    { value: 'meskel', label: 'Meskel Festival', icon: '🔥' },
    { value: 'enkutatash', label: 'Enkutatash (New Year)', icon: '🎉' },
    { value: 'timkat', label: 'Timkat (Epiphany)', icon: '💧' },
    { value: 'wedding', label: 'Wedding Season', icon: '💒' },
    { value: 'coffee', label: 'Coffee Ceremony', icon: '☕' },
     {value:'ramadan',label:'Ramadan Gifts', icon: '💒'},
     
  ];

  const tabs = [
    { label: 'All Crafts', value: 'all', icon: <ShoppingBag /> },
    { label: 'Featured', value: 'featured', icon: <LocalFireDepartment /> },
    { label: 'New Arrivals', value: 'new', icon: <NewReleases /> },
    { label: 'Best Sellers', value: 'bestsellers', icon: <TrendingUp /> },
    { label: 'Traditional', value: 'traditional', icon: <Agriculture /> },
  ];

  const handleAddSuccess = () => {
    setRefreshKey(prev => prev + 1);
    setDialogOpen(false);
  };

  const fetchFeaturedCrafts = async () => {
    setLoading(true);
    try {
      // This would be an API call to get Ethiopian crafts
      const response = await craftsAPI.getFeaturedCrafts();
      setFeaturedCrafts(response.data || []);
    } catch (err) {
      console.error('Failed to fetch featured crafts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeaturedCrafts();
  }, []);

  const actions = isAuthenticated ? [
    {
      label: 'አዲስ የእጅ ሥራ ጨምር (Add New Craft)',
      onClick: () => setDialogOpen(true),
      variant: 'contained',
      color: 'primary',
      icon: <Add />,
    },
  ] : [];

  return (
    <Container maxWidth="xl">
      <PageHeader
        title="የኢትዮጵያ የእጅ ሥራዎች (Ethiopian Handicrafts)"
        subtitle="Discover unique handmade creations from Ethiopian artisans"
        breadcrumbs={true}
        actions={actions}
      />

      {/* Cultural Banner */}
      <Paper
        sx={{
          p: 3,
          mb: 3,
          background: `linear-gradient(135deg, ${ethiopianColors.green} 0%, ${ethiopianColors.yellow} 50%, ${ethiopianColors.red} 100%)`,
          color: 'white',
          borderRadius: 2,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            width: '30%',
            background: 'url("/images/ethiopian-pattern.png") repeat',
            opacity: 0.1,
          }}
        />
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <Typography variant="h5" fontWeight={700} gutterBottom>
              🇪🇹 የኢትዮጵያ ባህላዊ የእጅ ሥራዎች
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              Support local artisans and bring home authentic Ethiopian craftsmanship. 
              Each piece tells a story of our rich cultural heritage.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4} sx={{ textAlign: 'right' }}>
            <Button
              variant="contained"
              sx={{
                bgcolor: 'white',
                color: ethiopianColors.green,
                '&:hover': { bgcolor: alpha('#fff', 0.9) },
              }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              Explore Crafts
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Cultural Categories */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom fontWeight={600}>
          በክፍል ይመልከቱ (Browse by Category)
        </Typography>
        <Grid container spacing={1}>
          {craftCategories.map((category) => (
            <Grid item key={category.id}>
              <Chip
                icon={<span style={{ fontSize: '1.2rem' }}>{category.icon}</span>}
                label={`${category.name} (${category.count})`}
                onClick={() => setActiveTab(0)}
                sx={{
                  bgcolor: alpha(category.color, 0.1),
                  color: category.color,
                  borderColor: category.color,
                  '&:hover': {
                    bgcolor: alpha(category.color, 0.2),
                  },
                }}
                variant="outlined"
              />
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(e, v) => setActiveTab(v)}
          variant="scrollable"
          scrollButtons="auto"
        >
          {tabs.map((tab, index) => (
            <Tab
              key={index}
              icon={tab.icon}
              label={tab.label}
              iconPosition="start"
            />
          ))}
        </Tabs>
      </Box>

      {/* Filter Bar */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <TextField
            select
            label="ክልል (Region)"
            value={filters.region}
            onChange={(e) => setFilters({ ...filters, region: e.target.value })}
            size="small"
            sx={{ minWidth: 150 }}
          >
            {regions.map((region) => (
              <MenuItem key={region.value} value={region.value}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <span>{region.icon}</span>
                  {region.label}
                </Box>
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="የእጅ ሥራ አይነት (Material)"
            value={filters.material}
            onChange={(e) => setFilters({ ...filters, material: e.target.value })}
            size="small"
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="">All Materials</MenuItem>
            <MenuItem value="clay">ሸክላ (Clay)</MenuItem>
            <MenuItem value="cotton">ጥጥ (Cotton)</MenuItem>
            <MenuItem value="wood">እንጨት (Wood)</MenuItem>
            <MenuItem value="leather">ቆዳ (Leather)</MenuItem>
            <MenuItem value="metal">ብረት (Metal)</MenuItem>
            <MenuItem value="gold">ወርቅ (Gold)</MenuItem>
            <MenuItem value="silver">ብር (Silver)</MenuItem>
          </TextField>

          <TextField
            select
            label="ዋጋ (Price)"
            value={filters.priceRange}
            onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
            size="small"
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="">All Prices</MenuItem>
            <MenuItem value="0-500">Under 500 ETB</MenuItem>
            <MenuItem value="500-2000">500 - 2,000 ETB</MenuItem>
            <MenuItem value="2000-5000">2,000 - 5,000 ETB</MenuItem>
            <MenuItem value="5000+">Above 5,000 ETB</MenuItem>
          </TextField>

          <TextField
            select
            label="ዝግጅት (Occasion)"
            value={filters.occasion}
            onChange={(e) => setFilters({ ...filters, occasion: e.target.value })}
            size="small"
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="">All Occasions</MenuItem>
            {occasions.map((occasion) => (
              <MenuItem key={occasion.value} value={occasion.value}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <span>{occasion.icon}</span>
                  {occasion.label}
                </Box>
              </MenuItem>
            ))}
          </TextField>

          <Box sx={{ flexGrow: 1 }} />

          <Tooltip title="ማጣሪያ (More Filters)">
            <IconButton onClick={() => setFilterDrawerOpen(true)}>
              <FilterList />
            </IconButton>
          </Tooltip>

          <Tooltip title="አድስ (Refresh)">
            <IconButton onClick={() => setRefreshKey(prev => prev + 1)}>
              <Refresh />
            </IconButton>
          </Tooltip>
        </Box>
      </Paper>

      {/* Featured Artisans */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom fontWeight={600}>
          🌟 ታዋቂ የእጅ ባለሙያዎች (Featured Artisans)
        </Typography>
        <Grid container spacing={2}>
          {[1, 2, 3, 4].map((i) => (
            <Grid item xs={6} sm={3} key={i}>
              <Paper
                sx={{
                  p: 2,
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'scale(1.05)' },
                }}
                onClick={() => navigate(`/artisans/${i}`)}
              >
                <Avatar
                  src={`/api/placeholder/100/100`}
                  sx={{ width: 80, height: 80, mx: 'auto', mb: 1 }}
                />
                <Typography variant="subtitle2" fontWeight={600}>
                  Artisan Name {i}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {regions[i].label}
                </Typography>
                <Rating value={4.5 + i * 0.1} size="small" readOnly />
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Add Craft Dialog */}
      <AddCraftDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSuccess={handleAddSuccess}
      />

      {/* Crafts Grid */}
      <Box sx={{ mt: 3 }}>
        <CraftGrid key={refreshKey} filters={filters} />
      </Box>

      {/* Filter Drawer */}
      <Drawer
        anchor="right"
        open={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: { xs: '100%', sm: 400 },
            p: 3,
            bgcolor: 'background.paper',
          }
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" fontWeight={600}>
            የላቀ ማጣሪያ (Advanced Filters)
          </Typography>
          <IconButton onClick={() => setFilterDrawerOpen(false)} size="small">
            <Close />
          </IconButton>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              የዋጋ ክልል (Price Range in ETB)
            </Typography>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <TextField
                  type="number"
                  label="ከ (From)"
                  size="small"
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  type="number"
                  label="እስከ (To)"
                  size="small"
                  fullWidth
                />
              </Grid>
            </Grid>
          </Box>

          <Box>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              ደረጃ አሰጣጥ (Rating)
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {[5, 4, 3, 2, 1].map((rating) => (
                <Button
                  key={rating}
                  variant="outlined"
                  size="small"
                  startIcon={<Rating value={rating} readOnly size="small" />}
                  sx={{ justifyContent: 'flex-start' }}
                >
                  {rating} ኮከብ እና ከዚያ በላይ
                </Button>
              ))}
            </Box>
          </Box>

          <Box>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              የአቅርቦት አማራጮች (Delivery Options)
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Button variant="outlined" size="small" sx={{ justifyContent: 'flex-start' }}>
                🚚 በኢትዮጵያ ውስጥ ነፃ መላኪያ
              </Button>
              <Button variant="outlined" size="small" sx={{ justifyContent: 'flex-start' }}>
                ✈️ አለም አቀፍ መላኪያ
              </Button>
              <Button variant="outlined" size="small" sx={{ justifyContent: 'flex-start' }}>
                📦 በአካባቢዎ መሰብሰብ
              </Button>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
            <Button
              fullWidth
              variant="contained"
              onClick={() => setFilterDrawerOpen(false)}
            >
              ውጤቶችን አሳይ (Show Results)
            </Button>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => setFilters({ region: '', material: '', priceRange: '', occasion: '' })}
            >
              አጽዳ (Clear)
            </Button>
          </Box>
        </Box>
      </Drawer>

      {/* Floating Action Button */}
      <Zoom in={true}>
        <Fab
          color="primary"
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            bgcolor: ethiopianColors.green,
            '&:hover': { bgcolor: ethiopianColors.green },
          }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <ShoppingBag />
        </Fab>
      </Zoom>
    </Container>
  );
};

export default CraftsPage;








// import React, { useState } from 'react';
// import { Container, Box, Button } from '@mui/material';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext'; 
// import PageHeader from '../components/common/PageHeader';
// import CraftGrid from '../components/crafts/CraftGrid';
// import AddCraftDialog from '../components/crafts/AddCraftDialog'; 
// import React, { useState, useEffect } from 'react';
// import {
//   Container,
//   Box,
//   Typography,
//   Button,
//   Chip,
//   IconButton,
//   Menu,
//   MenuItem,
//   Alert,
//   CircularProgress,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   Grid,
//   Paper,
//   Badge,
//   Avatar,
//   Tooltip,
//   Zoom,
//   Fab,
//   Drawer,
//   useTheme,
//   alpha,
//   Tabs,
//   Tab,
//   Rating,
// } from '@mui/material';
// const CraftsPage = () => {
//   const { isAuthenticated, user } = useAuth(); 
//   const navigate = useNavigate(); 
//   const [dialogOpen, setDialogOpen] = useState(false);
//   const [refreshKey, setRefreshKey] = useState(0);

//   const handleAddSuccess = () => {
//     // Refresh the crafts grid
//     setRefreshKey(prev => prev + 1);
//     setDialogOpen(false);
//   };

//   const actions = isAuthenticated ? [
//     {
//       label: 'Add New Craft',
//       onClick: () => setDialogOpen(true),
//       variant: 'contained',
//     },
//   ] : [];

//   return (
//     <Container maxWidth="xl">
//       <PageHeader
//         title="Handmade Crafts"
//         subtitle="Discover unique handmade creations"
//         breadcrumbs={true}
//         actions={actions}
//       />
      
//       {/* Use AddCraftDialog, */}
//       <AddCraftDialog
//         open={dialogOpen}
//         onClose={() => setDialogOpen(false)}
//         onSuccess={handleAddSuccess}
//       />
      
//       <Box sx={{ mt: 3 }}>
//         {/*  Pass refreshKey to force re-render when craft is added */}
//         <CraftGrid key={refreshKey} />
//       </Box>
//     </Container>
//   );
// };

// export default CraftsPage;