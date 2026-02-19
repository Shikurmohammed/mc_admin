import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Paper,
  Avatar,
  Rating,
  Divider,
  IconButton,
  useTheme,
  alpha,
  AppBar,
  Toolbar,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Fab,
  Zoom,
  Chip,
  Stack,
  Skeleton,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  ShoppingBag,
  Storefront,
  Person,
  Star,
  ArrowForward,
  Menu as MenuIcon,
  Close,
  Facebook,
  Twitter,
  Instagram,
  Email,
  Phone,
  LocationOn,
  Rocket,
  Security,
  Payment,
  LocalShipping,
  Favorite,
  Visibility,
  ChevronRight,
  ArrowUpward,
  FormatQuote,
  Coffee,
  Agriculture,
  Spa,
  EmojiEvents,
  Groups,
  Language,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useThemeMode } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { craftsAPI } from '../services/craftsService';
import { categoriesAPI } from '../services/categoriesService';
import { artisansAPI } from '../services/artisansService';
import { reviewsAPI } from '../services/reviewsService';

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

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

// Default fallback data (used when API returns empty)
const defaultData = {
  // Ethiopian regions known for crafts
  regions: [
    { id: 'all', name: 'ሁሉም ክልሎች', nameEn: 'All Regions', icon: '🇪🇹', color: ethiopianColors.green },
    { id: 'addis', name: 'አዲስ አበባ', nameEn: 'Addis Ababa', icon: '🏛️', color: ethiopianColors.blue },
    { id: 'gondar', name: 'ጎንደር', nameEn: 'Gondar', icon: '🏰', color: ethiopianColors.gold },
    { id: 'lalibela', name: 'ላሊበላ', nameEn: 'Lalibela', icon: '⛪', color: ethiopianColors.ochre },
    { id: 'harar', name: 'ሐረር', nameEn: 'Harar', icon: '🏘️', color: ethiopianColors.red },
    { id: 'oromia', name: 'ኦሮሚያ', nameEn: 'Oromia', icon: '🌾', color: ethiopianColors.green },
    { id: 'tigray', name: 'ትግራይ', nameEn: 'Tigray', icon: '⛰️', color: ethiopianColors.brown },
  ],

  // Featured Ethiopian crafts
  featuredCrafts: [
    {
      id: 1,
      title: 'ቅርጫት',
      titleEn: 'Ethiopian Basket',
      artisan: 'አማን ተስፋዬ',
      artisanEn: 'Aman Tesfaye',
      price: 850,
      rating: 4.9,
      reviewCount: 124,
      image: 'https://images.unsplash.com/photo-1597045566677-8cf9ed9c16d6?w=500',
      category: 'ቅርጫት',
      categoryEn: 'Basketry',
      region: 'አዲስ አበባ',
      regionEn: 'Addis Ababa',
      traditional: true,
    },
    {
      id: 2,
      title: 'የሐረር ጥልፍ ልብስ',
      titleEn: 'Harari Embroidery',
      artisan: 'ፋጢማ አብዱል',
      artisanEn: 'Fatima Abdul',
      price: 2500,
      rating: 4.8,
      reviewCount: 89,
      image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500',
      category: 'ጥልፍ',
      categoryEn: 'Embroidery',
      region: 'ሐረር',
      regionEn: 'Harar',
      traditional: true,
    },
    {
      id: 3,
      title: 'የጎንደር ቆዳ ሥራ',
      titleEn: 'Gondar Leather',
      artisan: 'ተረፈ መኮንን',
      artisanEn: 'Terefe Mekonnen',
      price: 1800,
      rating: 4.7,
      reviewCount: 56,
      image: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=500',
      category: 'ቆዳ',
      categoryEn: 'Leather',
      region: 'ጎንደር',
      regionEn: 'Gondar',
      traditional: true,
    },
    {
      id: 4,
      title: 'የላሊበላ የድንጋይ ቅርጽ',
      titleEn: 'Lalibela Stone Art',
      artisan: 'መላኩ ገብሬ',
      artisanEn: 'Melaku Gebre',
      price: 3200,
      rating: 4.9,
      reviewCount: 42,
      image: 'https://images.unsplash.com/photo-1610709176999-2607c3113dc8?w=500',
      category: 'የድንጋይ ሥራ',
      categoryEn: 'Stone Work',
      region: 'ላሊበላ',
      regionEn: 'Lalibela',
      traditional: true,
    },
  ],

  // Testimonials
  testimonials: [
    {
      id: 1,
      name: 'አበበ በቀለ',
      nameEn: 'Abebe Bekele',
      role: 'ደንበኛ',
      roleEn: 'Customer',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
      content: 'ባህላዊ የእጅ ሥራዎች በአንድ ቦታ ማግኘቴ በጣም ደስ ይላል። ጥራቱም አስደናቂ ነው።',
      contentEn: 'I love finding Ethiopian traditional crafts in one place. The quality is amazing.',
      rating: 5,
    },
    {
      id: 2,
      name: 'አስናቀ ተሾመ',
      nameEn: 'Asnake Teshome',
      role: 'የእጅ ባለሙያ',
      roleEn: 'Artisan',
      avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
      content: 'ይህ መድረክ የእኔን የእጅ ሥራ ለሌሎች ለማሳየትና ለመሸጥ ትልቅ እድል ፈጥሮልኛል።',
      contentEn: 'This platform has created a great opportunity to showcase and sell my crafts.',
      rating: 5,
    },
    {
      id: 3,
      name: 'ሄኖክ ደሳለኝ',
      nameEn: 'Henok Desalegn',
      role: 'ደንበኛ',
      roleEn: 'Customer',
      avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
      content: 'ለውጭ አገር ለሚኖሩ ዘመዶቼ ልዩ ልዩ ባህላዊ ስጦታዎችን በቀላሉ መላክ ችያለሁ።',
      contentEn: 'I can easily send traditional gifts to my relatives abroad.',
      rating: 5,
    },
  ],

  // Ethiopian craft categories
  categories: [
    { id: 1, name: 'ቅርጫት', nameEn: 'Basketry', count: 234, icon: '🧺', color: ethiopianColors.brown },
    { id: 2, name: 'ጥልፍ', nameEn: 'Embroidery', count: 189, icon: '🧵', color: ethiopianColors.green },
    { id: 3, name: 'ወርቅ', nameEn: 'Gold', count: 156, icon: '💍', color: ethiopianColors.gold },
    { id: 4, name: 'ቆዳ', nameEn: 'Leather', count: 143, icon: '🧤', color: ethiopianColors.ochre },
    { id: 5, name: 'ሸክላ', nameEn: 'Pottery', count: 198, icon: '🏺', color: ethiopianColors.red },
    { id: 6, name: 'እንጨት', nameEn: 'Woodwork', count: 187, icon: '🪵', color: ethiopianColors.coffee },
  ],

  // Features
  features: [
    {
      icon: <Rocket sx={{ fontSize: 40 }} />,
      title: 'ፈጣን እና አስተማማኝ',
      titleEn: 'Fast & Secure',
      description: 'ፈጣን አቅርቦት እና አስተማማኝ ክፍያ',
      descriptionEn: 'Fast delivery in Ethiopia and secure payment',
    },
    {
      icon: <Security sx={{ fontSize: 40 }} />,
      title: 'የገዢ ጥበቃ',
      titleEn: 'Buyer Protection',
      description: 'ለሁሉም ግዢዎች 100% የገንዘብ ተመላሽ ዋስትና',
      descriptionEn: '100% money-back guarantee on all purchases',
    },
    {
      icon: <LocalShipping sx={{ fontSize: 40 }} />,
      title: 'አለም አቀፍ አቅርቦት',
      titleEn: 'Worldwide Shipping',
      description: 'ወደ ማንኛውም አገር መላክ ይቻላል',
      descriptionEn: 'Ship to any country worldwide',
    },
    {
      icon: <Coffee sx={{ fontSize: 40 }} />,
      title: 'የቡና ሥነ ሥርዓት',
      titleEn: 'Coffee Ceremony',
      description: 'ልዩ የኢትዮጵያ ባህላዊ ልምዶች',
      descriptionEn: 'Special Ethiopian cultural experiences',
    },
  ],

  // Stats
  stats: [
    { value: '5,000+', label: 'የእጅ ባለሙያዎች', labelEn: 'Artisans' },
    { value: '20,000+', label: 'የእጅ ሥራዎች', labelEn: 'Crafts' },
    { value: '50,000+', label: 'ደስተኛ ደንበኞች', labelEn: 'Happy Customers' },
    { value: '10+', label: 'አገራት', labelEn: 'Countries' },
  ],

  // Featured artisans
  featuredArtisans: [
    {
      id: 1,
      name: 'አማን ተስፋዬ',
      nameEn: 'Aman Tesfaye',
      region: 'አዲስ አበባ',
      regionEn: 'Addis Ababa',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
      craftCount: 24,
      rating: 4.9,
    },
    {
      id: 2,
      name: 'ፋጢማ አብዱል',
      nameEn: 'Fatima Abdul',
      region: 'ሐረር',
      regionEn: 'Harar',
      avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
      craftCount: 18,
      rating: 4.8,
    },
    {
      id: 3,
      name: 'ተረፈ መኮንን',
      nameEn: 'Terefe Mekonnen',
      region: 'ጎንደር',
      regionEn: 'Gondar',
      avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
      craftCount: 15,
      rating: 4.7,
    },
    {
      id: 4,
      name: 'መላኩ ገብሬ',
      nameEn: 'Melaku Gebre',
      region: 'ላሊበላ',
      regionEn: 'Lalibela',
      avatar: 'https://randomuser.me/api/portraits/men/4.jpg',
      craftCount: 12,
      rating: 4.9,
    },
  ],
};

const LandingPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { mode } = useThemeMode();
  
  // State for data
  const [featuredCrafts, setFeaturedCrafts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [featuredArtisans, setFeaturedArtisans] = useState([]);
  const [stats, setStats] = useState(defaultData.stats);
  const [features] = useState(defaultData.features);
  const [regions] = useState(defaultData.regions);
  
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
          featured: true,
          sortBy: 'rating',
          sortOrder: 'DESC'
        });
        const craftsData = craftsResponse?.data || craftsResponse;
        setFeaturedCrafts(Array.isArray(craftsData) && craftsData.length > 0 ? craftsData : defaultData.featuredCrafts);
        setErrors(prev => ({ ...prev, crafts: null }));
      } catch (err) {
        console.error('Error fetching crafts:', err);
        setFeaturedCrafts(defaultData.featuredCrafts);
        setErrors(prev => ({ ...prev, crafts: err.message }));
      } finally {
        setLoading(prev => ({ ...prev, crafts: false }));
      }

      // Fetch Categories
      try {
        const categoriesResponse = await categoriesAPI.getCategories();
        const categoriesData = categoriesResponse?.data || categoriesResponse;
        setCategories(Array.isArray(categoriesData) && categoriesData.length > 0 ? categoriesData : defaultData.categories);
        setErrors(prev => ({ ...prev, categories: null }));
      } catch (err) {
        console.error('Error fetching categories:', err);
        setCategories(defaultData.categories);
        setErrors(prev => ({ ...prev, categories: err.message }));
      } finally {
        setLoading(prev => ({ ...prev, categories: false }));
      }

      // Fetch Testimonials
      try {
        const testimonialsResponse = await reviewsAPI.getTestimonials({ limit: 3 });
        const testimonialsData = testimonialsResponse?.data || testimonialsResponse;
        setTestimonials(Array.isArray(testimonialsData) && testimonialsData.length > 0 ? testimonialsData : defaultData.testimonials);
        setErrors(prev => ({ ...prev, testimonials: null }));
      } catch (err) {
        console.error('Error fetching testimonials:', err);
        setTestimonials(defaultData.testimonials);
        setErrors(prev => ({ ...prev, testimonials: err.message }));
      } finally {
        setLoading(prev => ({ ...prev, testimonials: false }));
      }

      // Fetch Featured Artisans
      try {
        const artisansResponse = await artisansAPI.getFeaturedArtisans({ limit: 4 });
        const artisansData = artisansResponse?.data || artisansResponse;
        setFeaturedArtisans(Array.isArray(artisansData) && artisansData.length > 0 ? artisansData : defaultData.featuredArtisans);
        setErrors(prev => ({ ...prev, artisans: null }));
      } catch (err) {
        console.error('Error fetching artisans:', err);
        setFeaturedArtisans(defaultData.featuredArtisans);
        setErrors(prev => ({ ...prev, artisans: err.message }));
      } finally {
        setLoading(prev => ({ ...prev, artisans: false }));
      }

      // Fetch Stats
      try {
        const statsResponse = await craftsAPI.getStats();
        const statsData = statsResponse?.data || statsResponse;
        if (statsData) {
          setStats([
            { value: statsData.artisans?.toLocaleString() || '5,000+', label: 'የእጅ ባለሙያዎች', labelEn: 'Artisans' },
            { value: statsData.crafts?.toLocaleString() || '20,000+', label: 'የእጅ ሥራዎች', labelEn: 'Crafts' },
            { value: statsData.customers?.toLocaleString() || '50,000+', label: 'ደስተኛ ደንበኞች', labelEn: 'Happy Customers' },
            { value: statsData.countries?.toString() || '10+', label: 'አገራት', labelEn: 'Countries' },
          ]);
        }
        setErrors(prev => ({ ...prev, stats: null }));
      } catch (err) {
        console.error('Error fetching stats:', err);
        setStats(defaultData.stats);
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

  const navItems = [
    { label: 'መነሻ', labelEn: 'Home', href: '#', amharic: true },
    { label: 'የእጅ ሥራዎች', labelEn: 'Crafts', href: '#featured' },
    { label: 'ክልሎች', labelEn: 'Regions', href: '#regions' },
    { label: 'እንዴት እንደሚሠራ', labelEn: 'How It Works', href: '#how-it-works' },
    { label: 'ስለ እኛ', labelEn: 'About', href: '#about' },
  ];

  const handleNavigation = (path) => {
    navigate(path);
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
                  onClick={() => setMobileOpen(false)}
                >
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}
            <Divider sx={{ my: 2 }} />
            <ListItem disablePadding>
              <ListItemButton onClick={() => handleNavigation('/login')}>
                <ListItemText primary="ግባ" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={() => handleNavigation('/register')}>
                <ListItemText primary="ተመዝገብ" />
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

        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <motion.div variants={fadeInUp}>
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' },
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
                    onClick={() => setActiveRegion(region.id)}
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
                Showing default crafts. {errors.crafts}
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
            ) : (
              (featuredCrafts.length > 0 ? featuredCrafts : defaultData.featuredCrafts).map((craft, index) => (
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
                          image={craft.image || craft.images?.[0] || 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=500'}
                          alt={craft.title || craft.titleEn}
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
                        {craft.traditional && (
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
                          label={craft.region || craft.regionEn || 'ኢትዮጵያ'}
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
                          {craft.title || craft.titleEn}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          በ   {craft.artisan?.firstName} {craft.artisan?.lastName}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Rating value={craft.rating || 4.5} precision={0.1} size="small" readOnly />
                          <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                            ({craft.reviewCount || craft.reviews || 0})
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
                Showing default artisans. {errors.artisans}
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
            ) : (
              (featuredArtisans.length > 0 ? featuredArtisans : defaultData.featuredArtisans).map((artisan, index) => (
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
                      {artisan.name?.charAt(0)}
                    </Avatar>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      {artisan.name || artisan.nameEn}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {artisan.region || artisan.regionEn || 'ኢትዮጵያ'}
                    </Typography>
                    <Rating value={artisan.rating || 4.5} size="small" readOnly />
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                      {artisan.craftCount || 0} የእጅ ሥራዎች
                    </Typography>
                  </Paper>
                </Grid>
              ))
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
                Showing default categories. {errors.categories}
              </Alert>
            )}
          </Box>

          <Grid container spacing={2}>
            {(categories.length > 0 ? categories : defaultData.categories).map((category, index) => (
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
                      border: `1px solid ${alpha(category.color || ethiopianColors.green, 0.2)}`,
                      '&:hover': {
                        transform: 'scale(1.05)',
                        borderColor: category.color || ethiopianColors.green,
                        boxShadow: `0 4px 12px ${alpha(category.color || ethiopianColors.green, 0.2)}`,
                      },
                    }}
                    onClick={() => handleNavigation(`/crafts?category=${category.id || category.name}`)}
                  >
                    <Typography variant="h2" sx={{ fontSize: '3rem', mb: 1 }}>
                      {category.icon || '🎨'}
                    </Typography>
                    <Typography variant="subtitle1" fontWeight={600} sx={{ fontSize: '0.9rem' }}>
                      {category.name || category.nameEn}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {category.count || 0} ዕቃዎች
                    </Typography>
                  </Paper>
                </motion.div>
              </Grid>
            ))}
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
              ከሺዎች ደስተኛ ደንበኞቻችን እና የእጅ ባለሙያዎቻችን ጋር ይቀላቀሉ
            </Typography>
            {errors.testimonials && (
              <Alert severity="info" sx={{ mt: 2, maxWidth: 400, mx: 'auto' }}>
                Showing default testimonials. {errors.testimonials}
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
            ) : (
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
                        src={(testimonials.length > 0 ? testimonials : defaultData.testimonials)[activeTestimonial]?.avatar}
                        sx={{
                          width: 100,
                          height: 100,
                          mx: 'auto',
                          mb: 2,
                          border: `3px solid ${ethiopianColors.green}`,
                        }}
                      />
                      <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', maxWidth: 600, mx: 'auto', fontStyle: 'italic' }}>
                        "{(testimonials.length > 0 ? testimonials : defaultData.testimonials)[activeTestimonial]?.content || 
                          (testimonials.length > 0 ? testimonials : defaultData.testimonials)[activeTestimonial]?.contentEn}"
                      </Typography>
                      <Rating value={(testimonials.length > 0 ? testimonials : defaultData.testimonials)[activeTestimonial]?.rating || 5} readOnly sx={{ mb: 2 }} />
                      <Typography variant="h6" fontWeight={600}>
                        {(testimonials.length > 0 ? testimonials : defaultData.testimonials)[activeTestimonial]?.name || 
                         (testimonials.length > 0 ? testimonials : defaultData.testimonials)[activeTestimonial]?.nameEn}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {(testimonials.length > 0 ? testimonials : defaultData.testimonials)[activeTestimonial]?.role || 
                         (testimonials.length > 0 ? testimonials : defaultData.testimonials)[activeTestimonial]?.roleEn}
                      </Typography>
                    </Paper>
                  </motion.div>
                </AnimatePresence>

                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 2 }}>
                  {(testimonials.length > 0 ? testimonials : defaultData.testimonials).map((_, index) => (
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
               የእጅ ባለሙያዎችን እና የእጅ ሥራ ወዳዶችን ያገናኛል። 
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
                {['ስለ እኛ', 'እንዴት እንደሚሠራ', 'ተደጋጋሚ ጥያቄዎች', 'አግኙን'].map((item) => (
                  <Button
                    key={item}
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
                    {item}
                  </Button>
                ))}
              </Stack>
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom color={ethiopianColors.green}>
                ለእጅ ባለሙያዎች
              </Typography>
              <Stack spacing={1}>
                {['የእጅ ባለሙያ ይሁኑ', 'የመሸጫ መመሪያ', 'ሀብቶች', 'የስኬት ታሪኮች'].map((item) => (
                  <Button
                    key={item}
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
                    {item}
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













// import React, { useState, useEffect } from 'react';
// import {
//   Box,
//   Container,
//   Typography,
//   Button,
//   Grid,
//   Card,
//   CardContent,
//   CardMedia,
//   Paper,
//   Avatar,
//   Rating,
//   Divider,
//   IconButton,
//   useTheme,
//   alpha,
//   AppBar,
//   Toolbar,
//   Drawer,
//   List,
//   ListItem,
//   ListItemText,
//   ListItemButton,
//   Fab,
//   Zoom,
//   Chip,
//   Stack,
// } from '@mui/material';
// import {
//   ShoppingBag,
//   Storefront,
//   Person,
//   Star,
//   ArrowForward,
//   Menu as MenuIcon,
//   Close,
//   Facebook,
//   Twitter,
//   Instagram,
//   LinkedIn,
//   Email,
//   Phone,
//   LocationOn,
//   Rocket,
//   Security,
//   Payment,
//   LocalShipping,
//   Favorite,
//   Visibility,
//   ChevronRight,
//   ArrowUpward,
//   PlayArrow,
//   FormatQuote,
// } from '@mui/icons-material';
// import { useNavigate } from 'react-router-dom';
// import { useThemeMode } from '../context/ThemeContext';
// import { motion, AnimatePresence } from 'framer-motion';

// // Animation variants
// const fadeInUp = {
//   initial: { opacity: 0, y: 20 },
//   animate: { opacity: 1, y: 0 },
//   transition: { duration: 0.6 }
// };

// const staggerContainer = {
//   animate: {
//     transition: {
//       staggerChildren: 0.1
//     }
//   }
// };

// const LandingPage = () => {
//   const theme = useTheme();
//   const navigate = useNavigate();
//   const { mode } = useThemeMode();
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const [showScrollTop, setShowScrollTop] = useState(false);
//   const [activeTestimonial, setActiveTestimonial] = useState(0);

//   // Sample data
//   const featuredCrafts = [
//     {
//       id: 1,
//       title: 'Handcrafted Ceramic Vase',
//       artisan: 'Emma Watson',
//       price: 89.99,
//       rating: 4.8,
//       reviews: 124,
//       image: 'https://images.unsplash.com/photo-1578749559198-99f214a0b42c?w=500',
//       category: 'Pottery',
//     },
//     {
//       id: 2,
//       title: 'Wooden Wall Art',
//       artisan: 'James Brown',
//       price: 149.99,
//       rating: 4.9,
//       reviews: 89,
//       image: 'https://images.unsplash.com/photo-1610709176999-2607c3113dc8?w=500',
//       category: 'Woodwork',
//     },
//     {
//       id: 3,
//       title: 'Silver Leaf Earrings',
//       artisan: 'Sarah Chen',
//       price: 59.99,
//       rating: 4.7,
//       reviews: 56,
//       image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500',
//       category: 'Jewelry',
//     },
//     {
//       id: 4,
//       title: 'Handwoven Basket',
//       artisan: 'Maria Garcia',
//       price: 45.99,
//       rating: 4.6,
//       reviews: 42,
//       image: 'https://images.unsplash.com/photo-1597045566677-8cf9ed9c16d6?w=500',
//       category: 'Textiles',
//     },
//   ];

//   const testimonials = [
//     {
//       name: 'Michael Roberts',
//       role: 'Customer',
//       avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
//       content: 'The quality of crafts I\'ve found here is amazing. Each piece tells a unique story and adds character to my home.',
//       rating: 5,
//     },
//     {
//       name: 'Isabella Martinez',
//       role: 'Artisan',
//       avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
//       content: 'This platform has helped me turn my passion into a thriving business. The community is incredibly supportive!',
//       rating: 5,
//     },
//     {
//       name: 'David Kim',
//       role: 'Customer',
//       avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
//       content: 'Finding unique gifts has never been easier. I love supporting talented artisans from around the world.',
//       rating: 5,
//     },
//   ];

//   const categories = [
//     { name: 'Pottery', count: 234, icon: '🏺', color: '#f59e0b' },
//     { name: 'Woodwork', count: 189, icon: '🪵', color: '#8b5cf6' },
//     { name: 'Jewelry', count: 156, icon: '💍', color: '#ec4899' },
//     { name: 'Textiles', count: 143, icon: '🧶', color: '#10b981' },
//     { name: 'Glass Art', count: 98, icon: '🥃', color: '#3b82f6' },
//     { name: 'Leather', count: 87, icon: '🧵', color: '#f97316' },
//   ];

//   const features = [
//     {
//       icon: <Rocket sx={{ fontSize: 40 }} />,
//       title: 'Fast & Secure',
//       description: 'Quick checkout process with encrypted payments',
//     },
//     {
//       icon: <Security sx={{ fontSize: 40 }} />,
//       title: 'Buyer Protection',
//       description: '100% money-back guarantee on all purchases',
//     },
//     {
//       icon: <LocalShipping sx={{ fontSize: 40 }} />,
//       title: 'Worldwide Shipping',
//       description: 'Track your orders from anywhere in the world',
//     },
//     {
//       icon: <Payment sx={{ fontSize: 40 }} />,
//       title: 'Multiple Payments',
//       description: 'Credit cards, PayPal, and local payment options',
//     },
//   ];

//   const stats = [
//     { value: '10K+', label: 'Artisans' },
//     { value: '50K+', label: 'Crafts' },
//     { value: '100K+', label: 'Happy Customers' },
//     { value: '4.9★', label: 'Average Rating' },
//   ];

//   useEffect(() => {
//     const handleScroll = () => {
//       setShowScrollTop(window.scrollY > 400);
//     };
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
//     }, 5000);
//     return () => clearInterval(interval);
//   }, [testimonials.length]);

//   const scrollToTop = () => {
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   const navItems = [
//     { label: 'Home', href: '#' },
//     { label: 'Crafts', href: '#featured' },
//     { label: 'Categories', href: '#categories' },
//     { label: 'How It Works', href: '#how-it-works' },
//     { label: 'About', href: '#about' },
//   ];

//   const handleNavigation = (path) => {
//     navigate(path);
//   };

//   return (
//     <Box sx={{ overflowX: 'hidden' }}>
//       {/* Scroll to Top Button */}
//       <Zoom in={showScrollTop}>
//         <Fab
//           color="primary"
//           size="small"
//           onClick={scrollToTop}
//           sx={{
//             position: 'fixed',
//             bottom: 24,
//             right: 24,
//             zIndex: 1000,
//             boxShadow: theme.shadows[8],
//           }}
//         >
//           <ArrowUpward />
//         </Fab>
//       </Zoom>

//       {/* Navigation */}
//       <AppBar 
//         position="fixed" 
//         color="transparent" 
//         elevation={0}
//         sx={{
//           backdropFilter: 'blur(10px)',
//           backgroundColor: alpha(theme.palette.background.paper, 0.8),
//           borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
//         }}
//       >
//         <Toolbar sx={{ justifyContent: 'space-between' }}>
//           <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//             <Box
//               sx={{
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 width: 40,
//                 height: 40,
//                 borderRadius: 2,
//                 bgcolor: 'primary.main',
//                 color: 'white',
//               }}
//             >
//               <ShoppingBag />
//             </Box>
//             <Typography
//               variant="h6"
//               component="div"
//               sx={{
//                 fontWeight: 700,
//                 background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
//                 backgroundClip: 'text',
//                 WebkitBackgroundClip: 'text',
//                 color: 'transparent',
//                 display: { xs: 'none', sm: 'block' }
//               }}
//             >
//               MenenCrafts-Market
//             </Typography>
//           </Box>

//           {/* Desktop Menu */}
//           <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 4 }}>
//             {navItems.map((item) => (
//               <Button
//                 key={item.label}
//                 href={item.href}
//                 sx={{
//                   color: 'text.primary',
//                   textTransform: 'none',
//                   '&:hover': {
//                     color: 'primary.main',
//                   },
//                 }}
//               >
//                 {item.label}
//               </Button>
//             ))}
//           </Box>

//           {/* Auth Buttons */}
//           <Box sx={{ display: 'flex', gap: 1 }}>
//             <Button
//               variant="outlined"
//               size="small"
//               onClick={() => handleNavigation('/login')}
//               sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
//             >
//               Sign In
//             </Button>
//             <Button
//               variant="contained"
//               size="small"
//               onClick={() => handleNavigation('/register')}
//             >
//               Join Now
//             </Button>
//             <IconButton
//               sx={{ display: { md: 'none' } }}
//               onClick={() => setMobileOpen(true)}
//             >
//               <MenuIcon />
//             </IconButton>
//           </Box>
//         </Toolbar>
//       </AppBar>

//       {/* Mobile Drawer */}
//       <Drawer
//         anchor="right"
//         open={mobileOpen}
//         onClose={() => setMobileOpen(false)}
//         PaperProps={{
//           sx: {
//             width: 280,
//             background: theme.palette.background.paper,
//           }
//         }}
//       >
//         <Box sx={{ p: 2 }}>
//           <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
//             <IconButton onClick={() => setMobileOpen(false)}>
//               <Close />
//             </IconButton>
//           </Box>
//           <List>
//             {navItems.map((item) => (
//               <ListItem key={item.label} disablePadding>
//                 <ListItemButton
//                   href={item.href}
//                   onClick={() => setMobileOpen(false)}
//                 >
//                   <ListItemText primary={item.label} />
//                 </ListItemButton>
//               </ListItem>
//             ))}
//             <Divider sx={{ my: 2 }} />
//             <ListItem disablePadding>
//               <ListItemButton onClick={() => handleNavigation('/login')}>
//                 <ListItemText primary="Sign In" />
//               </ListItemButton>
//             </ListItem>
//             <ListItem disablePadding>
//               <ListItemButton onClick={() => handleNavigation('/register')}>
//                 <ListItemText primary="Join Now" />
//               </ListItemButton>
//             </ListItem>
//           </List>
//         </Box>
//       </Drawer>

//       {/* Hero Section */}
//       <Box
//         component={motion.section}
//         initial="initial"
//         animate="animate"
//         variants={staggerContainer}
//         sx={{
//           minHeight: '100vh',
//           display: 'flex',
//           alignItems: 'center',
//           position: 'relative',
//           overflow: 'hidden',
//           pt: { xs: 8, md: 0 },
//         }}
//       >
//         {/* Background Pattern */}
//         <Box
//           sx={{
//             position: 'absolute',
//             top: 0,
//             left: 0,
//             right: 0,
//             bottom: 0,
//             opacity: 0.1,
//             background: `radial-gradient(circle at 30% 50%, ${theme.palette.primary.main} 0%, transparent 50%),
//                         radial-gradient(circle at 70% 50%, ${theme.palette.secondary.main} 0%, transparent 50%)`,
//           }}
//         />

//         <Container maxWidth="lg">
//           <Grid container spacing={4} alignItems="center">
//             <Grid item xs={12} md={6}>
//               <motion.div variants={fadeInUp}>
//                 <Typography
//                   variant="h1"
//                   sx={{
//                     fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' },
//                     fontWeight: 800,
//                     lineHeight: 1.2,
//                     mb: 2,
//                   }}
//                 >
//                   Discover Unique{' '}
//                   <Typography
//                     component="span"
//                     variant="inherit"
//                     sx={{
//                       background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
//                       backgroundClip: 'text',
//                       WebkitBackgroundClip: 'text',
//                       color: 'transparent',
//                     }}
//                   >
//                     Handmade Crafts
//                   </Typography>
//                 </Typography>
//               </motion.div>

//               <motion.div variants={fadeInUp}>
//                 <Typography
//                   variant="h5"
//                   color="text.secondary"
//                   sx={{ mb: 3, fontWeight: 400 }}
//                 >
//                   Connect with talented artisans from around the world and bring 
//                   unique, handcrafted pieces into your life.
//                 </Typography>
//               </motion.div>

//               <motion.div variants={fadeInUp}>
//                 <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 4 }}>
//                   <Button
//                     variant="contained"
//                     size="large"
//                     onClick={() => handleNavigation('/crafts')}
//                     endIcon={<ArrowForward />}
//                     sx={{
//                       py: 1.5,
//                       px: 4,
//                       borderRadius: 2,
//                       textTransform: 'none',
//                     }}
//                   >
//                     Explore Crafts
//                   </Button>
//                   <Button
//                     variant="outlined"
//                     size="large"
//                     onClick={() => handleNavigation('/register?type=artisan')}
//                     startIcon={<Storefront />}
//                     sx={{
//                       py: 1.5,
//                       px: 4,
//                       borderRadius: 2,
//                       textTransform: 'none',
//                     }}
//                   >
//                     Become an Artisan
//                   </Button>
//                 </Stack>
//               </motion.div>

//               <motion.div variants={fadeInUp}>
//                 <Stack direction="row" spacing={4}>
//                   {stats.map((stat, index) => (
//                     <Box key={index}>
//                       <Typography variant="h4" fontWeight={700}>
//                         {stat.value}
//                       </Typography>
//                       <Typography variant="body2" color="text.secondary">
//                         {stat.label}
//                       </Typography>
//                     </Box>
//                   ))}
//                 </Stack>
//               </motion.div>
//             </Grid>

//             <Grid item xs={12} md={6}>
//               <motion.div
//                 initial={{ opacity: 0, scale: 0.8 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 transition={{ duration: 0.8 }}
//               >
//                 <Box
//                   sx={{
//                     position: 'relative',
//                     '&::before': {
//                       content: '""',
//                       position: 'absolute',
//                       top: -20,
//                       left: -20,
//                       right: -20,
//                       bottom: -20,
//                       background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.2)} 0%, transparent 70%)`,
//                       borderRadius: '50%',
//                       zIndex: -1,
//                     },
//                   }}
//                 >
//                   <img
//                     src="https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=800"
//                     alt="Handmade Crafts"
//                     style={{
//                       width: '100%',
//                       height: 'auto',
//                       borderRadius: 20,
//                       boxShadow: theme.shadows[20],
//                     }}
//                   />
//                 </Box>
//               </motion.div>
//             </Grid>
//           </Grid>
//         </Container>
//       </Box>

//       {/* Featured Crafts */}
//       <Box
//         component="section"
//         id="featured"
//         sx={{
//           py: { xs: 8, md: 12 },
//           bgcolor: alpha(theme.palette.primary.main, 0.02),
//         }}
//       >
//         <Container maxWidth="lg">
//           <Box sx={{ textAlign: 'center', mb: 6 }}>
//             <Typography
//               variant="h2"
//               sx={{
//                 fontSize: { xs: '2rem', md: '2.5rem' },
//                 fontWeight: 700,
//                 mb: 2,
//               }}
//             >
//               Featured Crafts
//             </Typography>
//             <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
//               Discover our most loved handmade creations from talented artisans
//             </Typography>
//           </Box>

//           <Grid container spacing={3}>
//             {featuredCrafts.map((craft, index) => (
//               <Grid item xs={12} sm={6} md={3} key={craft.id}>
//                 <motion.div
//                   initial={{ opacity: 0, y: 20 }}
//                   whileInView={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.5, delay: index * 0.1 }}
//                   viewport={{ once: true }}
//                 >
//                   <Card
//                     sx={{
//                       height: '100%',
//                       display: 'flex',
//                       flexDirection: 'column',
//                       position: 'relative',
//                       borderRadius: 3,
//                       overflow: 'hidden',
//                       transition: 'transform 0.3s, box-shadow 0.3s',
//                       '&:hover': {
//                         transform: 'translateY(-8px)',
//                         boxShadow: theme.shadows[12],
//                         '& .craft-overlay': {
//                           opacity: 1,
//                         },
//                       },
//                     }}
//                   >
//                     <Box sx={{ position: 'relative' }}>
//                       <CardMedia
//                         component="img"
//                         height="240"
//                         image={craft.image}
//                         alt={craft.title}
//                       />
//                       <Box
//                         className="craft-overlay"
//                         sx={{
//                           position: 'absolute',
//                           top: 0,
//                           left: 0,
//                           right: 0,
//                           bottom: 0,
//                           bgcolor: alpha('#000', 0.4),
//                           display: 'flex',
//                           alignItems: 'center',
//                           justifyContent: 'center',
//                           gap: 1,
//                           opacity: 0,
//                           transition: 'opacity 0.3s',
//                         }}
//                       >
//                         <IconButton
//                           sx={{ bgcolor: 'white', '&:hover': { bgcolor: 'white' } }}
//                           onClick={() => handleNavigation(`/crafts/${craft.id}`)}
//                         >
//                           <Visibility />
//                         </IconButton>
//                         <IconButton
//                           sx={{ bgcolor: 'white', '&:hover': { bgcolor: 'white' } }}
//                         >
//                           <Favorite />
//                         </IconButton>
//                       </Box>
//                       <Chip
//                         label={craft.category}
//                         size="small"
//                         sx={{
//                           position: 'absolute',
//                           top: 12,
//                           left: 12,
//                           bgcolor: alpha(theme.palette.background.paper, 0.9),
//                           fontWeight: 500,
//                         }}
//                       />
//                     </Box>
//                     <CardContent sx={{ flexGrow: 1, p: 2 }}>
//                       <Typography variant="subtitle1" fontWeight={600} gutterBottom>
//                         {craft.title}
//                       </Typography>
//                       <Typography variant="body2" color="text.secondary" gutterBottom>
//                         by {craft.artisan}
//                       </Typography>
//                       <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
//                         <Rating value={craft.rating} precision={0.1} size="small" readOnly />
//                         <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
//                           ({craft.reviews})
//                         </Typography>
//                       </Box>
//                       <Typography variant="h6" color="primary.main" fontWeight={600}>
//                         ${craft.price}
//                       </Typography>
//                     </CardContent>
//                   </Card>
//                 </motion.div>
//               </Grid>
//             ))}
//           </Grid>

//           <Box sx={{ textAlign: 'center', mt: 4 }}>
//             <Button
//               variant="outlined"
//               size="large"
//               onClick={() => handleNavigation('/crafts')}
//               endIcon={<ChevronRight />}
//               sx={{ borderRadius: 2 }}
//             >
//               View All Crafts
//             </Button>
//           </Box>
//         </Container>
//       </Box>

//       {/* Categories */}
//       <Box component="section" id="categories" sx={{ py: { xs: 8, md: 12 } }}>
//         <Container maxWidth="lg">
//           <Box sx={{ textAlign: 'center', mb: 6 }}>
//             <Typography
//               variant="h2"
//               sx={{
//                 fontSize: { xs: '2rem', md: '2.5rem' },
//                 fontWeight: 700,
//                 mb: 2,
//               }}
//             >
//               Shop by Category
//             </Typography>
//             <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
//               Browse through our diverse collection of handmade crafts
//             </Typography>
//           </Box>

//           <Grid container spacing={2}>
//             {categories.map((category, index) => (
//               <Grid item xs={6} sm={4} md={2} key={category.name}>
//                 <motion.div
//                   initial={{ opacity: 0, scale: 0.8 }}
//                   whileInView={{ opacity: 1, scale: 1 }}
//                   transition={{ duration: 0.5, delay: index * 0.1 }}
//                   viewport={{ once: true }}
//                 >
//                   <Paper
//                     sx={{
//                       p: 3,
//                       textAlign: 'center',
//                       cursor: 'pointer',
//                       transition: 'transform 0.3s',
//                       border: `1px solid ${alpha(category.color, 0.2)}`,
//                       '&:hover': {
//                         transform: 'scale(1.05)',
//                         borderColor: category.color,
//                         boxShadow: `0 4px 12px ${alpha(category.color, 0.2)}`,
//                       },
//                     }}
//                     onClick={() => handleNavigation(`/crafts?category=${category.name}`)}
//                   >
//                     <Typography variant="h2" sx={{ fontSize: '3rem', mb: 1 }}>
//                       {category.icon}
//                     </Typography>
//                     <Typography variant="subtitle1" fontWeight={600}>
//                       {category.name}
//                     </Typography>
//                     <Typography variant="caption" color="text.secondary">
//                       {category.count} items
//                     </Typography>
//                   </Paper>
//                 </motion.div>
//               </Grid>
//             ))}
//           </Grid>
//         </Container>
//       </Box>

//       {/* Features */}
//       <Box
//         sx={{
//           py: { xs: 8, md: 12 },
//           bgcolor: alpha(theme.palette.primary.main, 0.02),
//         }}
//       >
//         <Container maxWidth="lg">
//           <Grid container spacing={4}>
//             {features.map((feature, index) => (
//               <Grid item xs={12} sm={6} md={3} key={index}>
//                 <motion.div
//                   initial={{ opacity: 0, y: 20 }}
//                   whileInView={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.5, delay: index * 0.1 }}
//                   viewport={{ once: true }}
//                 >
//                   <Box sx={{ textAlign: 'center' }}>
//                     <Box
//                       sx={{
//                         display: 'inline-flex',
//                         p: 2,
//                         borderRadius: 3,
//                         bgcolor: alpha(theme.palette.primary.main, 0.1),
//                         color: 'primary.main',
//                         mb: 2,
//                       }}
//                     >
//                       {feature.icon}
//                     </Box>
//                     <Typography variant="h6" fontWeight={600} gutterBottom>
//                       {feature.title}
//                     </Typography>
//                     <Typography variant="body2" color="text.secondary">
//                       {feature.description}
//                     </Typography>
//                   </Box>
//                 </motion.div>
//               </Grid>
//             ))}
//           </Grid>
//         </Container>
//       </Box>

//       {/* Testimonials */}
//       <Box component="section" sx={{ py: { xs: 8, md: 12 } }}>
//         <Container maxWidth="lg">
//           <Box sx={{ textAlign: 'center', mb: 6 }}>
//             <Typography
//               variant="h2"
//               sx={{
//                 fontSize: { xs: '2rem', md: '2.5rem' },
//                 fontWeight: 700,
//                 mb: 2,
//               }}
//             >
//               What Our Community Says
//             </Typography>
//             <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
//               Join satisfied customers and artisans
//             </Typography>
//           </Box>

//           <Box
//             sx={{
//               position: 'relative',
//               maxWidth: 800,
//               mx: 'auto',
//               minHeight: 250,
//             }}
//           >
//             <AnimatePresence mode="wait">
//               <motion.div
//                 key={activeTestimonial}
//                 initial={{ opacity: 0, x: 50 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 exit={{ opacity: 0, x: -50 }}
//                 transition={{ duration: 0.5 }}
//               >
//                 <Paper
//                   sx={{
//                     p: 4,
//                     textAlign: 'center',
//                     position: 'relative',
//                     borderRadius: 4,
//                   }}
//                 >
//                   <FormatQuote
//                     sx={{
//                       position: 'absolute',
//                       top: 20,
//                       left: 20,
//                       fontSize: 60,
//                       color: alpha(theme.palette.primary.main, 0.1),
//                     }}
//                   />
//                   <Avatar
//                     src={testimonials[activeTestimonial].avatar}
//                     sx={{
//                       width: 80,
//                       height: 80,
//                       mx: 'auto',
//                       mb: 2,
//                       border: `3px solid ${theme.palette.primary.main}`,
//                     }}
//                   />
//                   <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', maxWidth: 600, mx: 'auto' }}>
//                     "{testimonials[activeTestimonial].content}"
//                   </Typography>
//                   <Rating value={testimonials[activeTestimonial].rating} readOnly sx={{ mb: 2 }} />
//                   <Typography variant="h6" fontWeight={600}>
//                     {testimonials[activeTestimonial].name}
//                   </Typography>
//                   <Typography variant="body2" color="text.secondary">
//                     {testimonials[activeTestimonial].role}
//                   </Typography>
//                 </Paper>
//               </motion.div>
//             </AnimatePresence>

//             <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 2 }}>
//               {testimonials.map((_, index) => (
//                 <Box
//                   key={index}
//                   onClick={() => setActiveTestimonial(index)}
//                   sx={{
//                     width: 10,
//                     height: 10,
//                     borderRadius: '50%',
//                     bgcolor: index === activeTestimonial ? 'primary.main' : 'divider',
//                     cursor: 'pointer',
//                     transition: 'all 0.3s',
//                     '&:hover': {
//                       bgcolor: 'primary.light',
//                     },
//                   }}
//                 />
//               ))}
//             </Box>
//           </Box>
//         </Container>
//       </Box>

//       {/* CTA Section */}
//       <Box
//         sx={{
//           py: { xs: 8, md: 12 },
//           background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
//           color: 'white',
//         }}
//       >
//         <Container maxWidth="md" sx={{ textAlign: 'center' }}>
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6 }}
//             viewport={{ once: true }}
//           >
//             <Typography variant="h3" sx={{ fontSize: { xs: '2rem', md: '2.5rem' }, fontWeight: 700, mb: 2 }}>
//               Ready to Start Your Journey?
//             </Typography>
//             <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
//               Join our community of artisans and craft lovers today
//             </Typography>
//             <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
//               <Button
//                 variant="contained"
//                 size="large"
//                 onClick={() => handleNavigation('/register?type=artisan')}
//                 sx={{
//                   bgcolor: 'white',
//                   color: 'primary.main',
//                   py: 1.5,
//                   px: 4,
//                   '&:hover': {
//                     bgcolor: alpha('#fff', 0.9),
//                   },
//                 }}
//               >
//                 Become an Artisan
//               </Button>
//               <Button
//                 variant="outlined"
//                 size="large"
//                 onClick={() => handleNavigation('/crafts')}
//                 sx={{
//                   borderColor: 'white',
//                   color: 'white',
//                   py: 1.5,
//                   px: 4,
//                   '&:hover': {
//                     borderColor: 'white',
//                     bgcolor: alpha('#fff', 0.1),
//                   },
//                 }}
//               >
//                 Shop Now
//               </Button>
//             </Stack>
//           </motion.div>
//         </Container>
//       </Box>

//       {/* Footer */}
//       <Box
//         component="footer"
//         sx={{
//           py: 6,
//           bgcolor: mode === 'dark' ? '#0a0a0a' : '#f8fafc',
//           borderTop: `1px solid ${theme.palette.divider}`,
//         }}
//       >
//         <Container maxWidth="lg">
//           <Grid container spacing={4}>
//             <Grid item xs={12} md={4}>
//               <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
//                 <Box
//                   sx={{
//                     display: 'flex',
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                     width: 40,
//                     height: 40,
//                     borderRadius: 2,
//                     bgcolor: 'primary.main',
//                     color: 'white',
//                   }}
//                 >
//                   <ShoppingBag />
//                 </Box>
//                 <Typography variant="h6" fontWeight={700}>
//                   ArtisanMarket
//                 </Typography>
//               </Box>
//               <Typography variant="body2" color="text.secondary" paragraph>
//                 Connecting talented artisans with craft lovers country-wide. Discover unique, 
//                 handcrafted pieces that tell a story.
//               </Typography>
//               <Box sx={{ display: 'flex', gap: 1 }}>
//                 <IconButton size="small" sx={{ color: 'text.secondary' }}>
//                   <Facebook />
//                 </IconButton>
//                 <IconButton size="small" sx={{ color: 'text.secondary' }}>
//                   <Twitter />
//                 </IconButton>
//                 <IconButton size="small" sx={{ color: 'text.secondary' }}>
//                   <Instagram />
//                 </IconButton>
//                 <IconButton size="small" sx={{ color: 'text.secondary' }}>
//                   <LinkedIn />
//                 </IconButton>
//               </Box>
//             </Grid>

//             <Grid item xs={12} sm={6} md={2}>
//               <Typography variant="subtitle2" fontWeight={600} gutterBottom>
//                 Quick Links
//               </Typography>
//               <Stack spacing={1}>
//                 {['About Us', 'How It Works', 'FAQs', 'Contact'].map((item) => (
//                   <Button
//                     key={item}
//                     variant="text"
//                     size="small"
//                     sx={{
//                       justifyContent: 'flex-start',
//                       color: 'text.secondary',
//                       textTransform: 'none',
//                       p: 0,
//                       '&:hover': { color: 'primary.main' },
//                     }}
//                   >
//                     {item}
//                   </Button>
//                 ))}
//               </Stack>
//             </Grid>

//             <Grid item xs={12} sm={6} md={2}>
//               <Typography variant="subtitle2" fontWeight={600} gutterBottom>
//                 For Artisans
//               </Typography>
//               <Stack spacing={1}>
//                 {['Become an Artisan', 'Selling Guide', 'Artisan Resources', 'Success Stories'].map((item) => (
//                   <Button
//                     key={item}
//                     variant="text"
//                     size="small"
//                     sx={{
//                       justifyContent: 'flex-start',
//                       color: 'text.secondary',
//                       textTransform: 'none',
//                       p: 0,
//                       '&:hover': { color: 'primary.main' },
//                     }}
//                   >
//                     {item}
//                   </Button>
//                 ))}
//               </Stack>
//             </Grid>

//             <Grid item xs={12} md={4}>
//               <Typography variant="subtitle2" fontWeight={600} gutterBottom>
//                 Contact Us
//               </Typography>
//               <Stack spacing={2}>
//                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                   <Email fontSize="small" color="action" />
//                   <Typography variant="body2" color="text.secondary">
//                     support@menencrafts.com
//                   </Typography>
//                 </Box>
//                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                   <Phone fontSize="small" color="action" />
//                   <Typography variant="body2" color="text.secondary">
//                     +1 (555) 123-4567
//                   </Typography>
//                 </Box>
//                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                   <LocationOn fontSize="small" color="action" />
//                   <Typography variant="body2" color="text.secondary">
//                     Bole, Oromia Tower, Addis Ababa
//                   </Typography>
//                 </Box>
//               </Stack>
//             </Grid>
//           </Grid>

//           <Divider sx={{ my: 4 }} />

//           <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
//             <Typography variant="body2" color="text.secondary">
//               © 2026 MenenCrafts. All rights reserved.
//             </Typography>
//             <Box sx={{ display: 'flex', gap: 2 }}>
//               <Button variant="text" size="small" sx={{ color: 'text.secondary' }}>
//                 Privacy Policy
//               </Button>
//               <Button variant="text" size="small" sx={{ color: 'text.secondary' }}>
//                 Terms of Service
//               </Button>
//             </Box>
//           </Box>
//         </Container>
//       </Box>
//     </Box>
//   );
// };

// export default LandingPage;