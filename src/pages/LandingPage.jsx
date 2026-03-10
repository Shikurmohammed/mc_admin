import React, { useState, useEffect } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Chip,
  Rating,
  Avatar,
  Paper,
  Stack,
  Fab,
  Zoom,
  Skeleton,
  Alert,
  alpha,
  CircularProgress,
  useTheme,
} from '@mui/material';
import {
  ShoppingBag,
  Menu as MenuIcon,
  Close,
  ArrowForward,
  Storefront,
  ArrowUpward,
  Visibility,
  Favorite,
  ChevronRight,
  FormatQuote,
  Facebook,
  Twitter,
  Instagram,
  Language,
  Email,
  Phone,
  LocationOn,
  Handshake,
  EmojiEvents,
  CheckCircle,
  TrendingUp,
  Payment,
  Brush,
  AttachMoney,
  LocalShipping,

} from '@mui/icons-material';
import PersonAdd from '@mui/icons-material/PersonAdd';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeMode } from '../context/ThemeContext';
import { craftsAPI } from '../services/craftsService';
import { categoriesAPI } from '../services/categoriesService';
import { reviewsAPI } from '../services/reviewsService';
import { artisansAPI } from '../services/artisansService';
import { usersAPI } from '../services/usersService';
import { useTranslation } from 'react-i18next';

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Ethiopian traditional colors
const ethiopianColors = {
  green: '#078930',
  yellow: '#FCDD09',
  red: '#DA121A',
  blue: '#0F47AF',
  gold: '#B8860B',
  brown: '#8B4513',
  ochre: '#CC7722',
  cream: '#FDF5E6',
  coffee: '#6F4E37',
};

// Ethiopian regions (static - these don't change often)
const regions = [
  { id: 'all', name: 'ሁሉም ክልሎች', nameEn: 'All Regions', icon: '🇪🇹', color: ethiopianColors.green },
  { id: 'addis', name: 'አዲስ አበባ', nameEn: 'Addis Ababa', icon: '🏛️', color: ethiopianColors.blue },
  { id: 'gondar', name: 'ጎንደር', nameEn: 'Gondar', icon: '🏰', color: ethiopianColors.gold },
  { id: 'lalibela', name: 'ላሊበላ', nameEn: 'Lalibela', icon: '⛪', color: ethiopianColors.ochre },
  { id: 'harar', name: 'ሐረር', nameEn: 'Harar', icon: '🏘️', color: ethiopianColors.red },
  { id: 'oromia', name: 'ኦሮሚያ', nameEn: 'Oromia', icon: '🌾', color: ethiopianColors.green },
  { id: 'tigray', name: 'ትግራይ', nameEn: 'Tigray', icon: '⛰️', color: ethiopianColors.brown },
];

// Features (static content)
const features = [
  {
    icon: <ShoppingBag sx={{ fontSize: 40 }} />,
    title: 'ፈጣን እና አስተማማኝ',
    titleEn: 'Fast & Secure',
    description: 'ፈጣን አቅርቦት እና አስተማማኝ ክፍያ',
    descriptionEn: 'Fast delivery in Ethiopia and secure payment',
  },
  {
    icon: <Storefront sx={{ fontSize: 40 }} />,
    title: 'የገዢ ጥበቃ',
    titleEn: 'Buyer Protection',
    description: 'ለሁሉም ግዢዎች 100% የገንዘብ ተመላሽ ዋስትና',
    descriptionEn: '100% money-back guarantee on all purchases',
  },
  {
    icon: <LocationOn sx={{ fontSize: 40 }} />,
    title: 'አለም አቀፍ አቅርቦት',
    titleEn: 'Worldwide Shipping',
    description: 'ወደ ማንኛውም አገር መላክ ይቻላል',
    descriptionEn: 'Ship to any country worldwide',
  },
  {
    icon: <Favorite sx={{ fontSize: 40 }} />,
    title: 'የቡና ሥነ ሥርዓት',
    titleEn: 'Coffee Ceremony',
    description: 'ልዩ የኢትዮጵያ ባህላዊ ልምዶች',
    descriptionEn: 'Special Ethiopian cultural experiences',
  },
];

const LandingPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { mode } = useThemeMode();
  const { t, i18n } = useTranslation();

  // State for data
  const [featuredCrafts, setFeaturedCrafts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [featuredArtisans, setFeaturedArtisans] = useState([]);
  const [stats, setStats] = useState([]);
  const [totalCrafts, setTotalCrafts] = useState(0);
  const [totalArtisans, setTotalArtisans] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [totalCountries, setTotalCountries] = useState(10); // Default
  const [ourTeam, setOurTeam] = useState([]);


  // UI States
  const [loading, setLoading] = useState({
    crafts: true,
    categories: true,
    testimonials: true,
    artisans: true,
    stats: true,
  });

  const [errors, setErrors] = useState({
    crafts: null,
    categories: null,
    testimonials: null,
    artisans: null,
    stats: null,
  });

  const [mobileOpen, setMobileOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [activeRegion, setActiveRegion] = useState('all');

  // Fetch data from APIs
  useEffect(() => {
    const fetchData = async () => {
      // Fetch Featured Crafts
      try {
        const craftsResponse = await craftsAPI.getCrafts({
          page: 1,
          limit: 4,
          sortBy: 'averageRating',
          sortOrder: 'DESC'
        });
        const craftsData = craftsResponse?.crafts || craftsResponse?.data || [];
        setFeaturedCrafts(Array.isArray(craftsData) ? craftsData : []);
        setErrors(prev => ({ ...prev, crafts: null }));
      } catch (err) {
        console.error('Error fetching crafts:', err);
        setErrors(prev => ({ ...prev, crafts: err.message }));
        setFeaturedCrafts([]);
      } finally {
        setLoading(prev => ({ ...prev, crafts: false }));
      }

      // Fetch Categories
      try {
        const categoriesResponse = await categoriesAPI.getCategories();
        const categoriesData = categoriesResponse?.data || categoriesResponse || [];
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
        setErrors(prev => ({ ...prev, categories: null }));
      } catch (err) {
        console.error('Error fetching categories:', err);
        setErrors(prev => ({ ...prev, categories: err.message }));
        setCategories([]);
      } finally {
        setLoading(prev => ({ ...prev, categories: false }));
      }

      // Fetch Testimonials (approved reviews)
      try {
        const testimonialsResponse = await reviewsAPI.getReviews({
          status: 'APPROVED',
          limit: 10,
          sortBy: 'rating',
          sortOrder: 'DESC'
        });
        console.log('Testimonials Response:', testimonialsResponse);
        const testimonialsData = testimonialsResponse?.data || testimonialsResponse || [];
        setTestimonials(Array.isArray(testimonialsData) ? testimonialsData : []);
        setErrors(prev => ({ ...prev, testimonials: null }));
      } catch (err) {
        console.error('Error fetching testimonials:', err);
        setErrors(prev => ({ ...prev, testimonials: err.message }));
        setTestimonials([]);
      } finally {
        setLoading(prev => ({ ...prev, testimonials: false }));
      }

      // Fetch Featured Artisans
      try {
        const artisansResponse = await artisansAPI.getFeaturedArtisans({ limit: 10 });
        console.log('Artisans Response:', artisansResponse);
        const artisansData = artisansResponse || artisansResponse?.artisans || artisansResponse?.data || [];
        setFeaturedArtisans(Array.isArray(artisansData) ? artisansData : []);
        setErrors(prev => ({ ...prev, artisans: null }));
      } catch (err) {
        console.error('Error fetching artisans:', err);
        setErrors(prev => ({ ...prev, artisans: err.message }));
        setFeaturedArtisans([]);
      } finally {
        setLoading(prev => ({ ...prev, artisans: false }));
      }
      // Fetch Stats
      try {
        const [craftsStats, artisansResponse, customersResponse] = await Promise.all([
          craftsAPI.getStats().catch(() => ({ totalCrafts: 0 })),
          artisansAPI.getArtisansCount?.().catch(() => ({ artisanCount: 0 })),
          artisansAPI.getCustomersCount?.().catch(() => ({ customerCount: 0 })),
        ]);

        console.log('Stats Response:', { craftsStats, artisansResponse, customersResponse });

        // Extract the specific numbers from the objects
        const finalCrafts = craftsStats?.totalCrafts || 0;
        const finalArtisans = artisansResponse?.artisanCount || 0; // Fix: use .artisanCount
        const finalCustomers = customersResponse?.customerCount || 0;
        const finalCountries = regions.length; // Default value, as we don't have an API for this

        setTotalCrafts(finalCrafts);
        setTotalArtisans(finalArtisans);
        setTotalCustomers(finalCustomers);

        setStats([
          { value: (finalArtisans || 5000).toLocaleString() + '+', label: 'የእጅ ባለሙያዎች', labelEn: 'Artisans' },
          { value: (finalCrafts || 20000).toLocaleString() + '+', label: 'የእጅ ሥራዎች', labelEn: 'Crafts' },
          { value: (finalCustomers || 50000).toLocaleString() + '+', label: 'ደስተኛ ደንበኞች', labelEn: 'Happy Customers' },
          { value: (finalCountries || 10).toLocaleString() + '+', label: 'ክፍለ-ሀገራት', labelEn: 'Regions' },
        ]);

        setErrors(prev => ({ ...prev, stats: null }));
      } catch (err) {
        console.error('Error fetching stats:', err);
        setErrors(prev => ({ ...prev, stats: err.message }));
      } finally {
        setLoading(prev => ({ ...prev, stats: false }));
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (testimonials.length > 0) {
      const interval = setInterval(() => {
        setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [testimonials.length]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
useEffect(() => {
  const fetchTeam = async () => {
    try {
      // Fetch users with ADMIN role or specific team members
      const response = await usersAPI.getTeamMembers({ role: 'ADMIN,ARTISAN' }); 
      const team = response.map(member => ({
        name: member.firstName + ' ' + member.lastName,
        nameEn: member.firstName + ' ' + member.lastName, // Or add firstNameEn/lastNameEn to entity
        role: member.displayTitle || 'የቡድን አባል',
        roleEn: member.displayTitleEn || 'Team Member',
        avatar: member.avatar || 'https://via.placeholder.com'
      }));

      setOurTeam(team);
    } catch (error) {
      console.error("Failed to load team:", error);
    }
  };

  fetchTeam();
}, []);
  const navItems = [
    { label: 'መነሻ', labelEn: 'Home', href: '#hero', amharic: true },
    { label: 'የእጅ ሥራዎች', labelEn: 'Crafts', href: '#featured' },
    { label: 'ክልሎች', labelEn: 'Regions', href: '#regions' },
    { label: 'እንዴት እንደሚሠራ', labelEn: 'How It Works', href: '#how-it-works' },
    { label: 'ስለ እኛ', labelEn: 'About', href: '#about' },
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleRegionFilter = (regionId) => {
    setActiveRegion(regionId);
    if (regionId !== 'all') {
      navigate(`/crafts?region=${regionId}`);
    } else {
      navigate('/crafts');
    }
  };

  // Loading skeleton for crafts
  const CraftSkeleton = () => (
    <Grid item xs={12} sm={6} md={3}>
      <Card sx={{ height: '100%' }}>
        <Skeleton variant="rectangular" height={240} />
        <CardContent>
          <Skeleton variant="text" width="80%" />
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="40%" />
        </CardContent>
      </Card>
    </Grid>
  );

  const isLoading = Object.values(loading).some(Boolean);

  return (
    <Box sx={{ overflowX: 'hidden' }}>
      {/* Scroll to Top Button */}
      <Zoom in={showScrollTop}>
        <Fab
          color="primary"
          size="small"
          onClick={scrollToTop}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 1000,
            boxShadow: theme.shadows[8],
            bgcolor: ethiopianColors.green,
            '&:hover': { bgcolor: ethiopianColors.green },
          }}
        >
          <ArrowUpward />
        </Fab>
      </Zoom>

      {/* Navigation */}
      <AppBar
        position="fixed"
        color="transparent"
        elevation={0}
        sx={{
          backdropFilter: 'blur(10px)',
          backgroundColor: alpha(theme.palette.background.paper, 0.8),
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 40,
                height: 40,
                borderRadius: 2,
                background: `linear-gradient(135deg, ${ethiopianColors.green} 0%, ${ethiopianColors.yellow} 50%, ${ethiopianColors.red} 100%)`,
                color: 'white',
              }}
            >
              <ShoppingBag />
            </Box>
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontWeight: 700,
                background: `linear-gradient(135deg, ${ethiopianColors.green} 0%, ${ethiopianColors.yellow} 50%, ${ethiopianColors.red} 100%)`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                display: { xs: 'none', sm: 'block' }
              }}
            >
              የእጅ ሥራዎች
            </Typography>
          </Box>

          {/* Desktop Menu */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 4 }}>
            {navItems.map((item) => (
              <Button
                key={item.label}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.querySelector(item.href);
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                sx={{
                  color: 'text.primary',
                  textTransform: 'none',
                  '&:hover': {
                    color: ethiopianColors.green,
                  },
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>

          {/* Auth Buttons */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              size="small"
              onClick={() => handleNavigation('/login')}
              sx={{
                display: { xs: 'none', sm: 'inline-flex' },
                borderColor: ethiopianColors.green,
                color: ethiopianColors.green,
                '&:hover': {
                  borderColor: ethiopianColors.green,
                  bgcolor: alpha(ethiopianColors.green, 0.1),
                },
              }}
            >
              ግባ
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={() => handleNavigation('/register')}
              sx={{
                bgcolor: ethiopianColors.green,
                '&:hover': { bgcolor: ethiopianColors.green },
              }}
            >
              ተመዝገብ
            </Button>
            <IconButton
              sx={{ display: { md: 'none' } }}
              onClick={() => setMobileOpen(true)}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        PaperProps={{
          sx: {
            width: 280,
            background: theme.palette.background.paper,
          }
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <IconButton onClick={() => setMobileOpen(false)}>
              <Close />
            </IconButton>
          </Box>
          <List>
            {navItems.map((item) => (
              <ListItem key={item.label} disablePadding>
                <ListItemButton
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    const element = document.querySelector(item.href);
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' });
                    }
                    setMobileOpen(false);
                  }}
                >
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}
            <Divider sx={{ my: 2 }} />
            <ListItem disablePadding>
              <ListItemButton onClick={() => handleNavigation('/login')}>
                <ListItemText primary="ይግቡ" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={() => handleNavigation('/register')}>
                <ListItemText primary="ይመዝገቡ" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* Hero Section */}
      <Box
        component={motion.section}
        initial="initial"
        animate="animate"
        variants={staggerContainer}
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
          pt: { xs: 8, md: 0 },
        }}
      >
        {/* Ethiopian Flag Background Pattern */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.1,
            background: `linear-gradient(135deg, ${ethiopianColors.green} 0%, ${ethiopianColors.yellow} 50%, ${ethiopianColors.red} 100%)`,
          }}
        />

        {/* Traditional Pattern Overlay */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'url("/images/ethiopian-pattern.png")',
            backgroundRepeat: 'repeat',
            opacity: 0.03,
          }}
        />

        <Container maxWidth="lg" >
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6} sx={{ position: 'relative', zIndex: 1 ,marginTop:'70px'}}>
              <motion.div variants={fadeInUp}>
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: { xs: '2.2rem', md: '3.2rem', lg: '3.7rem' },
                    fontWeight: 800,
                    lineHeight: 1.2,
                    mb: 2,
                  }}
                >
                  የኢትዮጵያ{' '}
                  <Typography
                    component="span"
                    variant="inherit"
                    sx={{
                      background: `linear-gradient(135deg, ${ethiopianColors.green} 0%, ${ethiopianColors.yellow} 50%, ${ethiopianColors.red} 100%)`,
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      color: 'transparent',
                    }}
                  >
                    ባህላዊ
                  </Typography>{' '}
                  የእጅ ሥራዎች
                </Typography>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <Typography
                  variant="h5"
                  color="text.secondary"
                  sx={{ mb: 3, fontWeight: 400 }}
                >
                  ባለሙያ የእጅ ባለሙያዎች ጋር ይገናኙ እና
                  ልዩ የሆኑ ባህላዊ የእጅ ሥራዎችን ያግኙ።
                </Typography>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 4 }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => handleNavigation('/crafts')}
                    endIcon={<ArrowForward />}
                    sx={{
                      py: 1.5,
                      px: 4,
                      borderRadius: 2,
                      textTransform: 'none',
                      bgcolor: ethiopianColors.green,
                      '&:hover': { bgcolor: ethiopianColors.green },
                    }}
                  >
                    የእጅ ሥራዎችን ይመልከቱ
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => handleNavigation('/register?type=artisan')}
                    startIcon={<Storefront />}
                    sx={{
                      py: 1.5,
                      px: 4,
                      borderRadius: 2,
                      textTransform: 'none',
                      borderColor: ethiopianColors.green,
                      color: ethiopianColors.green,
                      '&:hover': {
                        borderColor: ethiopianColors.green,
                        bgcolor: alpha(ethiopianColors.green, 0.1),
                      },
                    }}
                  >
                    የእጅ ባለሙያ ይሁኑ
                  </Button>
                </Stack>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <Stack direction="row" spacing={4}>
                  {loading.stats ? (
                    <>
                      <Skeleton variant="text" width={80} height={40} />
                      <Skeleton variant="text" width={80} height={40} />
                      <Skeleton variant="text" width={80} height={40} />
                      <Skeleton variant="text" width={80} height={40} />
                    </>
                  ) : (
                    stats.map((stat, index) => (
                      <Box key={index}>
                        <Typography variant="h4" fontWeight={700} color={ethiopianColors.green}>
                          {stat.value}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {stat.label}
                        </Typography>
                      </Box>
                    ))
                  )}
                </Stack>
              </motion.div>
            </Grid>

            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
              >
                <Box
                  sx={{
                    position: 'relative',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: -20,
                      left: -20,
                      right: -20,
                      bottom: -20,
                      background: `radial-gradient(circle, ${alpha(ethiopianColors.gold, 0.2)} 0%, transparent 70%)`,
                      borderRadius: '50%',
                      zIndex: -1,
                    },
                  }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=800"
                    alt="Ethiopian Handicrafts"
                    style={{
                      width: '100%',
                      height: 'auto',
                      borderRadius: 20,
                      boxShadow: theme.shadows[20],
                    }}
                  />
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Regions Section */}
      <Box component="section" id="regions" sx={{ py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '2rem', md: '2.5rem' },
                fontWeight: 700,
                mb: 2,
              }}
            >
              በክልል ይመልከቱ
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
              ልዩ ልዩ የእጅ ሥራዎችን ያግኙ
            </Typography>
          </Box>

          <Grid container spacing={2} justifyContent="center">
            {regions.map((region, index) => (
              <Grid item key={region.id}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Paper
                    sx={{
                      p: 3,
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      border: `2px solid ${activeRegion === region.id ? region.color : 'transparent'}`,
                      bgcolor: activeRegion === region.id ? alpha(region.color, 0.1) : 'background.paper',
                      '&:hover': {
                        transform: 'scale(1.05)',
                        borderColor: region.color,
                      },
                    }}
                    onClick={() => handleRegionFilter(region.id)}
                  >
                    <Typography variant="h2" sx={{ fontSize: '3rem', mb: 1 }}>
                      {region.icon}
                    </Typography>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {region.name}
                    </Typography>
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Featured Crafts */}
      <Box
        component="section"
        id="featured"
        sx={{
          py: { xs: 8, md: 12 },
          bgcolor: alpha(ethiopianColors.cream, 0.3),
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '2rem', md: '2.5rem' },
                fontWeight: 700,
                mb: 2,
              }}
            >
              ተወዳጅ የእጅ ሥራዎች
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
              የተመረጡ የእጅ ሥራዎች
            </Typography>
            {errors.crafts && (
              <Alert severity="info" sx={{ mt: 2, maxWidth: 400, mx: 'auto' }}>
                Unable to load crafts. Please try again later.
              </Alert>
            )}
          </Box>

          <Grid container spacing={3}>
            {loading.crafts ? (
              <>
                <CraftSkeleton />
                <CraftSkeleton />
                <CraftSkeleton />
                <CraftSkeleton />
              </>
            ) : featuredCrafts.length > 0 ? (
              featuredCrafts.map((craft, index) => (
                <Grid item xs={12} sm={6} md={3} key={craft.id || index}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        position: 'relative',
                        borderRadius: 3,
                        overflow: 'hidden',
                        transition: 'transform 0.3s, box-shadow 0.3s',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: theme.shadows[12],
                          '& .craft-overlay': {
                            opacity: 1,
                          },
                        },
                      }}
                    >
                      <Box sx={{ position: 'relative' }}>
                        <CardMedia
                          component="img"
                          height="240"
                          image={craft.images?.[0] || 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=500'}
                          alt={craft.title}
                        />
                        <Box
                          className="craft-overlay"
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            bgcolor: alpha('#000', 0.4),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 1,
                            opacity: 0,
                            transition: 'opacity 0.3s',
                          }}
                        >
                          <IconButton
                            sx={{ bgcolor: 'white', '&:hover': { bgcolor: 'white' } }}
                            onClick={() => handleNavigation(`/crafts/${craft.id}`)}
                          >
                            <Visibility />
                          </IconButton>
                          <IconButton
                            sx={{ bgcolor: 'white', '&:hover': { bgcolor: 'white' } }}
                          >
                            <Favorite />
                          </IconButton>
                        </Box>
                        {craft.isTraditional && (
                          <Chip
                            label="ባህላዊ"
                            size="small"
                            sx={{
                              position: 'absolute',
                              top: 12,
                              left: 12,
                              bgcolor: ethiopianColors.gold,
                              color: 'white',
                              fontWeight: 600,
                            }}
                          />
                        )}
                        <Chip
                          label={craft.region || 'ኢትዮጵያ'}
                          size="small"
                          sx={{
                            position: 'absolute',
                            top: 12,
                            right: 12,
                            bgcolor: alpha(theme.palette.background.paper, 0.9),
                            fontWeight: 500,
                          }}
                        />
                      </Box>
                      <CardContent sx={{ flexGrow: 1, p: 2 }}>
                        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                          {craft.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          በ {craft.artisan?.firstName} {craft.artisan?.lastName}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Rating value={craft.averageRating || 0} precision={0.1} size="small" readOnly />
                          <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                            ({craft.reviewCount || 0})
                          </Typography>
                        </Box>
                        <Typography variant="h6" sx={{ color: ethiopianColors.green }} fontWeight={600}>
                          ETB {(craft.price || 0).toLocaleString()}
                        </Typography>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Alert severity="info">No crafts available at the moment.</Alert>
              </Grid>
            )}
          </Grid>

          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Button
              variant="outlined"
              size="large"
              onClick={() => handleNavigation('/crafts')}
              endIcon={<ChevronRight />}
              sx={{
                borderRadius: 2,
                borderColor: ethiopianColors.green,
                color: ethiopianColors.green,
                '&:hover': {
                  borderColor: ethiopianColors.green,
                  bgcolor: alpha(ethiopianColors.green, 0.1),
                },
              }}
            >
              ሁሉንም ይመልከቱ
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Featured Artisans */}
      <Box component="section" sx={{ py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '2rem', md: '2.5rem' },
                fontWeight: 700,
                mb: 2,
              }}
            >
              ታዋቂ የእጅ ባለሙያዎች
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
              የእጅ ባለሙያዎች
            </Typography>
            {errors.artisans && (
              <Alert severity="info" sx={{ mt: 2, maxWidth: 400, mx: 'auto' }}>
                Unable to load artisans. Please try again later.
              </Alert>
            )}
          </Box>

          <Grid container spacing={3}>
            {loading.artisans ? (
              <>
                <CraftSkeleton />
                <CraftSkeleton />
                <CraftSkeleton />
                <CraftSkeleton />
              </>
            ) : featuredArtisans.length > 0 ? (
              featuredArtisans.map((artisan, index) => (
                <Grid item xs={12} sm={6} md={3} key={artisan.id || index}>
                  <Paper
                    sx={{
                      p: 3,
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'transform 0.3s',
                      '&:hover': { transform: 'scale(1.05)' },
                    }}
                    onClick={() => handleNavigation(`/artisans/${artisan.id}`)}
                  >
                    <Avatar
                      src={artisan.avatar}
                      sx={{ width: 100, height: 100, mx: 'auto', mb: 2 }}
                    >
                      {artisan.firstName?.charAt(0)}
                    </Avatar>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      {artisan.firstName} {artisan.lastName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {artisan.region || 'ኢትዮጵያ'}
                    </Typography>
                    <Rating value={artisan.rating || 4.5} size="small" readOnly />
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                      {artisan.craftsCount || 0} የእጅ ሥራዎች
                    </Typography>
                  </Paper>
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Alert severity="info">No artisans available at the moment.</Alert>
              </Grid>
            )}
          </Grid>
        </Container>
      </Box>

      {/* Categories */}
      <Box
        component="section"
        id="categories"
        sx={{
          py: { xs: 8, md: 12 },
          bgcolor: alpha(ethiopianColors.cream, 0.3),
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '2rem', md: '2.5rem' },
                fontWeight: 700,
                mb: 2,
              }}
            >
              በምድብ ይመልከቱ
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
              ከተለያዩ የእጅ ሥራ ዓይነቶች ውስጥ ይምረጡ
            </Typography>
            {errors.categories && (
              <Alert severity="info" sx={{ mt: 2, maxWidth: 400, mx: 'auto' }}>
                Unable to load categories. Please try again later.
              </Alert>
            )}
          </Box>

          <Grid container spacing={2}>
            {loading.categories ? (
              <>
                <CraftSkeleton />
                <CraftSkeleton />
                <CraftSkeleton />
                <CraftSkeleton />
              </>
            ) : categories.length > 0 ? (
              categories.slice(0, 6).map((category, index) => (
                <Grid item xs={6} sm={4} md={2} key={category.id || index}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Paper
                      sx={{
                        p: 3,
                        textAlign: 'center',
                        cursor: 'pointer',
                        transition: 'transform 0.3s',
                        border: `1px solid ${alpha(ethiopianColors.green, 0.2)}`,
                        '&:hover': {
                          transform: 'scale(1.05)',
                          borderColor: ethiopianColors.green,
                          boxShadow: `0 4px 12px ${alpha(ethiopianColors.green, 0.2)}`,
                        },
                      }}
                      onClick={() => handleNavigation(`/crafts?category=${category.id}`)}
                    >
                      <Typography variant="h2" sx={{ fontSize: '3rem', mb: 1 }}>
                        {category.icon || '🎨'}
                      </Typography>
                      <Typography variant="subtitle1" fontWeight={600} sx={{ fontSize: '0.9rem' }}>
                        {category.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {category.craftsCount || 0} ዕቃዎች
                      </Typography>
                    </Paper>
                  </motion.div>
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Alert severity="info">No categories available at the moment.</Alert>
              </Grid>
            )}
          </Grid>
        </Container>
      </Box>

      {/* Features */}
      <Box
        sx={{
          py: { xs: 8, md: 12 },
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Box sx={{ textAlign: 'center' }}>
                    <Box
                      sx={{
                        display: 'inline-flex',
                        p: 2,
                        borderRadius: 3,
                        bgcolor: alpha(ethiopianColors.green, 0.1),
                        color: ethiopianColors.green,
                        mb: 2,
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </Box>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* How It Works Section */}
      <Box
        component="section"
        id="how-it-works"
        sx={{
          py: { xs: 8, md: 12 },
          bgcolor: alpha(ethiopianColors.cream, 0.3),
          scrollMarginTop: '80px', // Offset for fixed header
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '2rem', md: '2.5rem' },
                fontWeight: 700,
                mb: 2,
              }}
            >
              እንዴት እንደሚሠራ
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
              ለገዢዎች እና ለሻጮች ቀላል መመሪያ
            </Typography>
          </Box>

          {/* For Buyers */}
          <Box sx={{ mb: 8 }}>
            <Typography variant="h4" fontWeight={700} gutterBottom align="center" color={ethiopianColors.green}>
              ለገዢዎች
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" align="center" sx={{ mb: 4 }}>
              How to Buy
            </Typography>

            <Grid container spacing={4} justifyContent="center">
              {[
                {
                  step: '1',
                  icon: <PersonAdd sx={{ fontSize: 40 }} />,
                  title: 'ይመዝገቡ',
                  titleEn: 'Sign Up',
                  desc: 'በነፃ ይመዝገቡ እና መለያ ይፍጠሩ',
                  color: ethiopianColors.green,
                },
                {
                  step: '2',
                  icon: <ShoppingBag sx={{ fontSize: 40 }} />,
                  title: 'ይምረጡ',
                  titleEn: 'Browse',
                  desc: 'ከተለያዩ የእጅ ሥራዎች ውስጥ ይምረጡ',
                  color: ethiopianColors.yellow,
                },
                {
                  step: '3',
                  icon: <Payment sx={{ fontSize: 40 }} />,
                  title: 'ይግዙ',
                  titleEn: 'Purchase',
                  desc: 'ደህንነቱ በተጠበቀ ክፍያ ይግዙ',
                  color: ethiopianColors.red,
                },
                {
                  step: '4',
                  icon: <LocalShipping sx={{ fontSize: 40 }} />,
                  title: 'ይቀበሉ',
                  titleEn: 'Receive',
                  desc: 'ዕቃዎን በፍጥነት ይቀበሉ',
                  color: ethiopianColors.gold,
                },
              ].map((item, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Paper
                      sx={{
                        p: 3,
                        textAlign: 'center',
                        height: '100%',
                        position: 'relative',
                        borderRadius: 4,
                        transition: 'transform 0.3s',
                        '&:hover': {
                          transform: 'scale(1.05)',
                          boxShadow: theme.shadows[8],
                        },
                      }}
                    >
                      <Box
                        sx={{
                          position: 'absolute',
                          top: -10,
                          left: 20,
                          width: 30,
                          height: 30,
                          borderRadius: '50%',
                          bgcolor: item.color,
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 'bold',
                          fontSize: '1.2rem',
                        }}
                      >
                        {item.step}
                      </Box>
                      <Box
                        sx={{
                          display: 'inline-flex',
                          p: 2,
                          borderRadius: '50%',
                          bgcolor: alpha(item.color, 0.1),
                          color: item.color,
                          mb: 2,
                          mt: 2,
                        }}
                      >
                        {item.icon}
                      </Box>
                      <Typography variant="h6" fontWeight={600} gutterBottom>
                        {item.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.desc}
                      </Typography>
                    </Paper>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* For Artisans */}
          <Box>
            <Typography variant="h4" fontWeight={700} gutterBottom align="center" color={ethiopianColors.gold}>
              ለእጅ ባለሙያዎች
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" align="center" sx={{ mb: 4 }}>
              How to Sell
            </Typography>

            <Grid container spacing={4} justifyContent="center">
              {[
                {
                  step: '1',
                  icon: <Storefront sx={{ fontSize: 40 }} />,
                  title: 'ይመዝገቡ',
                  titleEn: 'Register',
                  desc: 'የእጅ ባለሙያ ሆነው ይመዝገቡ',
                  color: ethiopianColors.green,
                },
                {
                  step: '2',
                  icon: <Brush sx={{ fontSize: 40 }} />,
                  title: 'ያስመዘግቡ',
                  titleEn: 'List',
                  desc: 'የእጅ ሥራዎችዎን በፎቶ ያስመዘግቡ',
                  color: ethiopianColors.yellow,
                },
                {
                  step: '3',
                  icon: <AttachMoney sx={{ fontSize: 40 }} />,
                  title: 'ይሸጡ',
                  titleEn: 'Sell',
                  desc: 'ምርቶችዎን ለደንበኞች ይሸጡ',
                  color: ethiopianColors.red,
                },
                {
                  step: '4',
                  icon: <TrendingUp sx={{ fontSize: 40 }} />,
                  title: 'ይደጉ',
                  titleEn: 'Grow',
                  desc: 'ንግድዎን ያሳድጉ',
                  color: ethiopianColors.gold,
                },
              ].map((item, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Paper
                      sx={{
                        p: 3,
                        textAlign: 'center',
                        height: '100%',
                        position: 'relative',
                        borderRadius: 4,
                        transition: 'transform 0.3s',
                        '&:hover': {
                          transform: 'scale(1.05)',
                          boxShadow: theme.shadows[8],
                        },
                      }}
                    >
                      <Box
                        sx={{
                          position: 'absolute',
                          top: -10,
                          left: 20,
                          width: 30,
                          height: 30,
                          borderRadius: '50%',
                          bgcolor: item.color,
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 'bold',
                          fontSize: '1.2rem',
                        }}
                      >
                        {item.step}
                      </Box>
                      <Box
                        sx={{
                          display: 'inline-flex',
                          p: 2,
                          borderRadius: '50%',
                          bgcolor: alpha(item.color, 0.1),
                          color: item.color,
                          mb: 2,
                          mt: 2,
                        }}
                      >
                        {item.icon}
                      </Box>
                      <Typography variant="h6" fontWeight={600} gutterBottom>
                        {item.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.desc}
                      </Typography>
                    </Paper>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Benefits Box */}
          <Box sx={{ mt: 6 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper
                  sx={{
                    p: 3,
                    borderRadius: 4,
                    bgcolor: alpha(ethiopianColors.green, 0.05),
                  }}
                >
                  <Typography variant="h6" fontWeight={600} gutterBottom color={ethiopianColors.green}>
                    ለገዢዎች ጥቅሞች
                  </Typography>
                  <Stack spacing={1}>
                    {[
                      'ሁሉም ክፍያዎች ደህንነታቸው የተጠበቀ ነው',
                      '10 ቀናት የገንዘብ ተመላሽ ዋስትና',
                      'ነፃ አቅርቦት በአዲስ አበባ ውስጥ',
                      '24/7 የደንበኞች ድጋፍ',
                    ].map((text, i) => (
                      <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CheckCircle sx={{ color: ethiopianColors.green, fontSize: 20 }} />
                        <Typography variant="body2">{text}</Typography>
                      </Box>
                    ))}
                  </Stack>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper
                  sx={{
                    p: 3,
                    borderRadius: 4,
                    bgcolor: alpha(ethiopianColors.gold, 0.05),
                  }}
                >
                  <Typography variant="h6" fontWeight={600} gutterBottom color={ethiopianColors.gold}>
                    ለእጅ ባለሙያዎች ጥቅሞች
                  </Typography>
                  <Stack spacing={1}>
                    {[
                      'ቀላል የምርት አስተዳደር',
                      'ፈጣን ክፍያ ሂደት',
                    ].map((text, i) => (
                      <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CheckCircle sx={{ color: ethiopianColors.gold, fontSize: 20 }} />
                        <Typography variant="body2">{text}</Typography>
                      </Box>
                    ))}
                  </Stack>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>

      {/* About Us Section */}
      <Box
        component="section"
        id="about"
        sx={{
          py: { xs: 8, md: 12 },
          scrollMarginTop: '80px', // Offset for fixed header
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '2rem', md: '2.5rem' },
                fontWeight: 700,
                mb: 2,
              }}
            >
              ስለ እኛ
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
              የኢትዮጵያን ባህላዊ የእጅ ሥራዎችን እናቀርባለን
            </Typography>
          </Box>

          {/* Mission & Vision */}
          <Grid container spacing={4} sx={{ mb: 6 }}>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Paper
                  sx={{
                    p: 4,
                    height: '100%',
                    borderRadius: 4,
                    border: `2px solid ${alpha(ethiopianColors.green, 0.2)}`,
                  }}
                >
                  <Typography variant="h4" fontWeight={700} gutterBottom color={ethiopianColors.green}>
                    ተልዕኳአችን
                  </Typography>
                  <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem' }}>
                    የኢትዮጵያን ባህላዊ የእጅ ሥራዎች መጠበቅ፣ ማስተዋወቅ እና ለገበያ ማቅረብ።
                    የእጅ ባለሙያዎችን እና ደንበኞችን በማገናኘት ዘላቂ የሆነ የእጅ ሥራ ኢኮኖሚ መፍጠር።
                  </Typography>
                </Paper>
              </motion.div>
            </Grid>

            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Paper
                  sx={{
                    p: 4,
                    height: '100%',
                    borderRadius: 4,
                    border: `2px solid ${alpha(ethiopianColors.gold, 0.2)}`,
                  }}
                >
                  <Typography variant="h4" fontWeight={700} gutterBottom color={ethiopianColors.gold}>
                    ራዕያችን
                  </Typography>
                  <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem' }}>
                    የኢትዮጵያ ባህላዊ የእጅ ሥራዎችን ታዋቂ እንዲሆኑ ማድረግ።
                    ለእጅ ባለሙያዎች ቀጥተኛ የገበያ ተደራሽነት በመፍጠር ኢኮኖሚያዊ ተጠቃሚነታቸውን ማሳደግ።
                  </Typography>
                </Paper>
              </motion.div>
            </Grid>
          </Grid>

          {/* Our Values */}
          <Box sx={{ mb: 6 }}>
            <Typography variant="h3" fontWeight={700} textAlign="center" gutterBottom>
              እሴቶቻችን
            </Typography>
            <Typography variant="h6" color="text.secondary" textAlign="center" sx={{ mb: 4 }}>
              Our Core Values
            </Typography>

            <Grid container spacing={4}>
              {[
                {
                  icon: <Handshake sx={{ fontSize: 40 }} />,
                  title: 'ባህላዊ ቅርስ',
                  titleEn: 'Cultural Heritage',
                  desc: 'የኢትዮጵያን ባህላዊ የእጅ ሥራዎች መጠበቅ እና ማስተዋወቅ',
                },
                {
                  icon: <EmojiEvents sx={{ fontSize: 40 }} />,
                  title: 'ጥራት',
                  titleEn: 'Quality',
                  desc: 'ከፍተኛ ጥራት ያላቸው የእጅ ሥራዎችን ማቅረብ',
                },
                {
                  icon: <Favorite sx={{ fontSize: 40 }} />,
                  title: 'ማህበረሰብ',
                  titleEn: 'Community',
                  desc: 'የእጅ ባለሙያዎችን እና ደንበኞችን ማገናኘት',
                },
                {
                  icon: <TrendingUp sx={{ fontSize: 40 }} />,
                  title: 'ዘላቂነት',
                  titleEn: 'Sustainability',
                  desc: 'ዘላቂ የሆነ የእጅ ሥራ ኢኮኖሚ መፍጠር',
                },
              ].map((value, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card
                      sx={{
                        height: '100%',
                        textAlign: 'center',
                        p: 3,
                        transition: 'transform 0.3s',
                        '&:hover': {
                          transform: 'scale(1.05)',
                          boxShadow: theme.shadows[8],
                        },
                      }}
                    >
                      <Box
                        sx={{
                          display: 'inline-flex',
                          p: 2,
                          borderRadius: '50%',
                          bgcolor: alpha(ethiopianColors.green, 0.1),
                          color: ethiopianColors.green,
                          mb: 2,
                        }}
                      >
                        {value.icon}
                      </Box>
                      <Typography variant="h6" fontWeight={600} gutterBottom>
                        {value.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {value.desc}
                      </Typography>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Our Team */}
          <Box>
            <Typography variant="h3" fontWeight={700} textAlign="center" gutterBottom>
              ቡድናችን
            </Typography>
            <Typography variant="h6" color="text.secondary" textAlign="center" sx={{ mb: 4 }}>
              Meet Our Team
            </Typography>

            <Grid container spacing={4}>
              {ourTeam.map((member, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card
                      sx={{
                        height: '100%',
                        textAlign: 'center',
                        p: 3,
                      }}
                    >
                      <Avatar
                        src={member.avatar}
                        sx={{
                          width: 120,
                          height: 120,
                          mx: 'auto',
                          mb: 2,
                          border: `3px solid ${ethiopianColors.green}`,
                        }}
                      />
                      <Typography variant="h6" fontWeight={600}>
                        {member.name}
                      </Typography>
                      <Typography variant="body2" color="primary" gutterBottom>
                        {member.role}
                      </Typography>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Container>
      </Box>

      {/* Testimonials */}
      <Box
        component="section"
        sx={{
          py: { xs: 8, md: 12 },
          bgcolor: alpha(ethiopianColors.cream, 0.3),
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '2rem', md: '2.5rem' },
                fontWeight: 700,
                mb: 2,
              }}
            >
              ደንበኞቻችን ምን ይላሉ?
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
              ከደንበኞቻችን እና የእጅ ባለሙያዎቻችን ጋር ይቀላቀሉ
            </Typography>
            {errors.testimonials && (
              <Alert severity="info" sx={{ mt: 2, maxWidth: 400, mx: 'auto' }}>
                Unable to load testimonials. Please try again later.
              </Alert>
            )}
          </Box>

          <Box
            sx={{
              position: 'relative',
              maxWidth: 800,
              mx: 'auto',
              minHeight: 300,
            }}
          >
            {loading.testimonials ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : testimonials.length > 0 ? (
              <>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTestimonial}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Paper
                      sx={{
                        p: 4,
                        textAlign: 'center',
                        position: 'relative',
                        borderRadius: 4,
                        border: `2px solid ${alpha(ethiopianColors.green, 0.1)}`,
                      }}
                    >
                      <FormatQuote
                        sx={{
                          position: 'absolute',
                          top: 20,
                          left: 20,
                          fontSize: 60,
                          color: alpha(ethiopianColors.green, 0.1),
                        }}
                      />
                      <Avatar
                        src={testimonials[activeTestimonial]?.user?.avatar}
                        sx={{
                          width: 100,
                          height: 100,
                          mx: 'auto',
                          mb: 2,
                          border: `3px solid ${ethiopianColors.green}`,
                        }}
                      >
                        {testimonials[activeTestimonial]?.user?.firstName?.charAt(0)}
                      </Avatar>
                      <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', maxWidth: 600, mx: 'auto', fontStyle: 'italic' }}>
                        "{testimonials[activeTestimonial]?.comment}"
                      </Typography>
                      <Rating value={testimonials[activeTestimonial]?.rating || 5} readOnly sx={{ mb: 2 }} />
                      <Typography variant="h6" fontWeight={600}>
                        {testimonials[activeTestimonial]?.user?.firstName} {testimonials[activeTestimonial]?.user?.lastName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {testimonials[activeTestimonial]?.user?.role === 'ARTISAN' ? 'የእጅ ባለሙያ' : 'ደንበኛ'}
                      </Typography>
                    </Paper>
                  </motion.div>
                </AnimatePresence>

                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 2 }}>
                  {testimonials.map((_, index) => (
                    <Box
                      key={index}
                      onClick={() => setActiveTestimonial(index)}
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        bgcolor: index === activeTestimonial ? ethiopianColors.green : 'divider',
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                        '&:hover': {
                          bgcolor: ethiopianColors.green,
                        },
                      }}
                    />
                  ))}
                </Box>
              </>
            ) : (
              <Alert severity="info">No testimonials available at the moment.</Alert>
            )}
          </Box>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          py: { xs: 8, md: 12 },
          background: `linear-gradient(135deg, ${ethiopianColors.green} 0%, ${ethiopianColors.yellow} 50%, ${ethiopianColors.red} 100%)`,
          color: 'white',
        }}
      >
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Typography variant="h3" sx={{ fontSize: { xs: '2rem', md: '2.5rem' }, fontWeight: 700, mb: 2 }}>
              ዛሬውኑ ይጀምሩ!
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
              ባህላዊ የእጅ ሥራዎች ማግኘት ይጀምሩ
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
              <Button
                variant="contained"
                size="large"
                onClick={() => handleNavigation('/register?type=artisan')}
                sx={{
                  bgcolor: 'white',
                  color: ethiopianColors.green,
                  py: 1.5,
                  px: 4,
                  '&:hover': {
                    bgcolor: alpha('#fff', 0.9),
                  },
                }}
              >
                የእጅ ባለሙያ ይሁኑ
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => handleNavigation('/crafts')}
                sx={{
                  borderColor: 'white',
                  color: 'white',
                  py: 1.5,
                  px: 4,
                  '&:hover': {
                    borderColor: 'white',
                    bgcolor: alpha('#fff', 0.1),
                  },
                }}
              >
                ግዢ ይጀምሩ
              </Button>
            </Stack>
          </motion.div>
        </Container>
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 6,
          bgcolor: mode === 'dark' ? '#0a0a0a' : ethiopianColors.cream,
          borderTop: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    background: `linear-gradient(135deg, ${ethiopianColors.green} 0%, ${ethiopianColors.yellow} 50%, ${ethiopianColors.red} 100%)`,
                    color: 'white',
                  }}
                >
                  <ShoppingBag />
                </Box>
                <Typography variant="h6" fontWeight={700} color={ethiopianColors.green}>
                  የእጅ ሥራዎች
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" paragraph>
                የእጅ ባለሙያዎችን እና የእጅ ሥራ ወዳዶችን እናገናኛል።
                ልዩ የሆኑ ባህላዊ የእጅ ሥራዎችን ያግኙ።
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton size="small" sx={{ color: ethiopianColors.green }}>
                  <Facebook />
                </IconButton>
                <IconButton size="small" sx={{ color: ethiopianColors.green }}>
                  <Twitter />
                </IconButton>
                <IconButton size="small" sx={{ color: ethiopianColors.green }}>
                  <Instagram />
                </IconButton>
                <IconButton size="small" sx={{ color: ethiopianColors.green }}>
                  <Language />
                </IconButton>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom color={ethiopianColors.green}>
                ፈጣን ማገናኛዎች
              </Typography>
              <Stack spacing={1}>
                {[
                  { label: 'ስለ እኛ', id: '#about' },
                  { label: 'እንዴት እንደሚሠራ', id: '#how-it-works' },
                  { label: 'ተደጋጋሚ ጥያቄዎች', id: '#faq' },
                  { label: 'አግኙን', id: '#contact' }
                ].map((item) => (
                  <Button
                    key={item.label}
                    href={item.id}
                    onClick={(e) => {
                      if (item.id.startsWith('#')) {
                        e.preventDefault();
                        const element = document.querySelector(item.id);
                        if (element) element.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    variant="text"
                    size="small"
                    sx={{
                      justifyContent: 'flex-start',
                      color: 'text.secondary',
                      textTransform: 'none',
                      p: 0,
                      '&:hover': { color: ethiopianColors.green },
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
              </Stack>
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom color={ethiopianColors.green}>
                አግኙን
              </Typography>
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Email fontSize="small" sx={{ color: ethiopianColors.green }} />
                  <Typography variant="body2" color="text.secondary">
                    support@menencrafts.com
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Phone fontSize="small" sx={{ color: ethiopianColors.green }} />
                  <Typography variant="body2" color="text.secondary">
                    +251 xxxxxxxx
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocationOn fontSize="small" sx={{ color: ethiopianColors.green }} />
                  <Typography variant="body2" color="text.secondary">
                    አዲስ አበባ፣ ኢትዮጵያ
                  </Typography>
                </Box>
              </Stack>
            </Grid>
          </Grid>

          <Divider sx={{ my: 4, borderColor: alpha(ethiopianColors.green, 0.2) }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
            <Typography variant="body2" color="text.secondary">
              © 2026 Menen Crafts. መብቱ በህግ የተጠበቀ ነው።
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button variant="text" size="small" sx={{ color: 'text.secondary' }}>
                የግላዊነት ፖሊሲ
              </Button>
              <Button variant="text" size="small" sx={{ color: 'text.secondary' }}>
                የአገልግሎት ውል
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;