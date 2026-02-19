






import React, { useState } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Box,
  Chip,
  IconButton,
  Rating,
  Button,
  Avatar,
  Tooltip,
  Badge,
  Divider,
  alpha,
  useTheme,
  Collapse,
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  ShoppingCart,
  Visibility,
  Share,
  Store,
  LocalShipping,
  LocationOn,
  Coffee,
  ExpandMore,
  ExpandLess,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// Ethiopian traditional colors
const ethiopianColors = {
  green: '#078930',
  yellow: '#FCDD09',
  red: '#DA121A',
  gold: '#B8860B',
  brown: '#8B4513',
};

const CraftCard = ({ craft, onFavorite, onAddToCart }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    if (onFavorite) onFavorite(craft.id, !isFavorite);
  };

  const handleAddToCart = () => {
    if (onAddToCart) onAddToCart(craft);
  };

  const handleViewDetails = () => {
    navigate(`/crafts/${craft.id}`);
  };

  const handleArtisanClick = (e) => {
    e.stopPropagation();
    navigate(`/artisans/${craft.artisan?.id}`);
  };

  // Format price in Ethiopian Birr
  const formatPrice = (price) => {
    return new Intl.NumberFormat('am-ET', {
      style: 'currency',
      currency: 'ETB',
      minimumFractionDigits: 2,
    }).format(price);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
    >
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          transition: 'all 0.3s ease',
          borderRadius: 2,
          overflow: 'hidden',
          border: '1px solid',
          borderColor: 'divider',
          '&:hover': {
            boxShadow: theme.shadows[8],
            borderColor: alpha(ethiopianColors.green, 0.3),
          },
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Ethiopian Flag Stripe */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: `linear-gradient(90deg, ${ethiopianColors.green} 0%, ${ethiopianColors.yellow} 50%, ${ethiopianColors.red} 100%)`,
            zIndex: 2,
          }}
        />

        {/* Favorite Button */}
        <IconButton
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            zIndex: 1,
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 1)',
            },
          }}
          onClick={handleFavorite}
        >
          {isFavorite ? (
            <Favorite sx={{ color: ethiopianColors.red }} />
          ) : (
            <FavoriteBorder />
          )}
        </IconButton>

        {/* Cultural Badges */}
        {craft.isTraditional && (
          <Chip
            label="ባህላዊ (Traditional)"
            size="small"
            sx={{
              position: 'absolute',
              top: 12,
              left: 12,
              bgcolor: alpha(ethiopianColors.gold, 0.9),
              color: 'white',
              fontWeight: 600,
              zIndex: 1,
            }}
          />
        )}

        {/* Craft Image */}
        <Box sx={{ position: 'relative', height: 220, overflow: 'hidden' }}>
          <CardMedia
            component="img"
            height="220"
            image={craft.images?.[0] || 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=400'}
            alt={craft.title}
            sx={{
              objectFit: 'cover',
              transition: 'transform 0.5s ease',
              ...(isHovered && { transform: 'scale(1.1)' }),
            }}
          />
          
          {/* Quick Actions Overlay */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              display: 'flex',
              justifyContent: 'center',
              padding: '8px',
              gap: '8px',
            }}
          >
            <Tooltip title="ዝርዝሮች (Details)">
              <IconButton
                size="small"
                onClick={handleViewDetails}
                sx={{ color: 'white', '&:hover': { color: ethiopianColors.yellow } }}
              >
                <Visibility fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="ግዛ (Buy)">
              <IconButton
                size="small"
                onClick={handleAddToCart}
                sx={{ color: 'white', '&:hover': { color: ethiopianColors.green } }}
                disabled={craft.stock === 0}
              >
                <ShoppingCart fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="አጋራ (Share)">
              <IconButton size="small" sx={{ color: 'white', '&:hover': { color: ethiopianColors.red } }}>
                <Share fontSize="small" />
              </IconButton>
            </Tooltip>
          </motion.div>

          {/* Stock Badge */}
          {craft.stock <= 3 && craft.stock > 0 && (
            <Chip
              label={`የቀረው ${craft.stock} ብቻ (Only ${craft.stock} left)`}
              color="warning"
              size="small"
              sx={{
                position: 'absolute',
                bottom: 12,
                right: 12,
                fontWeight: 600,
              }}
            />
          )}

          {craft.stock === 0 && (
            <Chip
              label="አልቀረም (Out of Stock)"
              color="error"
              size="small"
              sx={{
                position: 'absolute',
                bottom: 12,
                right: 12,
                fontWeight: 600,
              }}
            />
          )}
        </Box>

        <CardContent sx={{ flexGrow: 1, p: 2 }}>
          {/* Region Badge */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
            <LocationOn sx={{ fontSize: '0.875rem', color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary">
              {craft.region || 'Addis Ababa'}
            </Typography>
          </Box>

          {/* Title */}
          <Typography
            variant="h6"
            component="h3"
            sx={{
              fontWeight: 600,
              fontSize: '1rem',
              mb: 1,
              lineHeight: 1.3,
              height: 40,
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {craft.title}
          </Typography>

          {/* Categories */}
          {craft.categories && craft.categories.length > 0 && (
            <Box sx={{ display: 'flex', gap: 0.5, mb: 1, flexWrap: 'wrap' }}>
              {craft.categories.slice(0, 2).map((category, index) => (
                <Chip
                  key={index}
                  label={category.name}
                  size="small"
                  sx={{
                    fontSize: '0.6rem',
                    height: 20,
                    bgcolor: alpha(ethiopianColors.green, 0.1),
                    color: ethiopianColors.green,
                  }}
                />
              ))}
            </Box>
          )}

          {/* Rating */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Rating
              value={craft.averageRating || 4.5}
              readOnly
              precision={0.5}
              size="small"
            />
            <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
              ({craft.reviewCount || 0})
            </Typography>
          </Box>

          {/* Artisan Info */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              mb: 1,
              cursor: 'pointer',
              '&:hover': { opacity: 0.8 },
            }}
            onClick={handleArtisanClick}
          >
            <Avatar
              src={craft.artisan?.avatar}
              sx={{ width: 24, height: 24, mr: 1 }}
            >
              {craft.artisan?.firstName?.charAt(0)}
            </Avatar>
            <Typography variant="caption" fontWeight={500}>
              {craft.artisan?.firstName} {craft.artisan?.lastName}
            </Typography>
            {craft.artisan?.isVerified && (
              <Tooltip title="የተረጋገጠ የእጅ ባለሙያ (Verified Artisan)">
                <Badge
                  sx={{
                    ml: 0.5,
                    '& .MuiBadge-badge': {
                      bgcolor: ethiopianColors.green,
                      color: 'white',
                      fontSize: '0.5rem',
                    }
                  }}
                  badgeContent="✓"
                  overlap="circular"
                />
              </Tooltip>
            )}
          </Box>

          {/* Expandable Description */}
          <Box sx={{ mt: 1 }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: expanded ? 10 : 2,
                WebkitBoxOrient: 'vertical',
              }}
            >
              {craft.description}
            </Typography>
            <Button
              size="small"
              onClick={() => setExpanded(!expanded)}
              sx={{ textTransform: 'none', fontSize: '0.7rem', mt: 0.5 }}
            >
              {expanded ? 'Show less' : 'Read more'}
              {expanded ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
            </Button>
          </Box>
        </CardContent>

        <Divider />

        <CardActions sx={{ p: 2, pt: 1.5, justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h6" color="primary" fontWeight={700}>
              {formatPrice(craft.price)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {craft.stock} በክምችት (in stock)
            </Typography>
          </Box>
          
          <Button
            variant="contained"
            size="small"
            startIcon={<ShoppingCart />}
            onClick={handleAddToCart}
            disabled={craft.stock === 0}
            sx={{
              borderRadius: 2,
              bgcolor: ethiopianColors.green,
              '&:hover': {
                bgcolor: ethiopianColors.green,
                opacity: 0.9,
              },
            }}
          >
            {craft.stock === 0 ? 'አልቀረም' : 'ግዛ (Buy)'}
          </Button>
        </CardActions>

        {/* Delivery Info */}
        {craft.freeDelivery && (
          <Box
            sx={{
              p: 1,
              bgcolor: alpha(ethiopianColors.yellow, 0.1),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 0.5,
            }}
          >
            <LocalShipping sx={{ fontSize: '0.875rem', color: ethiopianColors.green }} />
            <Typography variant="caption" color="text.secondary">
              ነፃ መላኪያ በኢትዮጵያ (Free Delivery in Ethiopia)
            </Typography>
          </Box>
        )}
      </Card>
    </motion.div>
  );
};
export default CraftCard;



// import React from 'react';
// import {
//   Card,
//   CardMedia,
//   CardContent,
//   CardActions,
//   Typography,
//   Box,
//   Chip,
//   IconButton,
//   Rating,
//   Button,
//   Avatar,
//   Tooltip,
//   Badge,
// } from '@mui/material';
// import {
//   Favorite,
//   FavoriteBorder,
//   ShoppingCart,
//   Visibility,
//   Share,
//   MoreVert,
//   Store,
// } from '@mui/icons-material';
// import { useNavigate } from 'react-router-dom';
// import { craftsAPI } from '../../services/apiService';



// const CraftCard = ({ craft, onFavorite, onAddToCart }) => {
//   const navigate = useNavigate();
//   const [isFavorite, setIsFavorite] = React.useState(false);
//   const [isHovered, setIsHovered] = React.useState(false);

//   const handleFavorite = async () => {
//     try {
//       setIsFavorite(!isFavorite);
//       if (onFavorite) {
//         onFavorite(craft.id, !isFavorite);
//       }
//     } catch (error) {
//       console.error('Failed to toggle favorite:', error);
//       setIsFavorite(!isFavorite); // Revert on error
//     }
//   };

//   const handleAddToCart = () => {
//     if (onAddToCart) {
//       onAddToCart(craft);
//     }
//   };

//   const handleViewDetails = () => {
//     navigate(`/crafts/${craft.id}`);
//   };

//   const handleArtisanClick = () => {
//     navigate(`/artisans/${craft.artisan.id}`);
//   };

//   return (
//     <Card
//       sx={{
//         height: '100%',
//         display: 'flex',
//         flexDirection: 'column',
//         position: 'relative',
//         transition: 'all 0.3s ease',
//         '&:hover': {
//           transform: 'translateY(-8px)',
//           boxShadow: 6,
//         },
//       }}
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//     >
//       {/* Favorite Button */}
//       <IconButton
//         sx={{
//           position: 'absolute',
//           top: 8,
//           right: 8,
//           backgroundColor: 'rgba(255, 255, 255, 0.9)',
//           zIndex: 1,
//           '&:hover': {
//             backgroundColor: 'rgba(255, 255, 255, 1)',
//           },
//         }}
//         onClick={handleFavorite}
//       >
//         {isFavorite ? (
//           <Favorite color="error" />
//         ) : (
//           <FavoriteBorder />
//         )}
//       </IconButton>

//       {/* Stock Badge */}
//       {craft.stock <= 5 && craft.stock > 0 && (
//         <Chip
//           label={`Only ${craft.stock} left`}
//           color="warning"
//           size="small"
//           sx={{
//             position: 'absolute',
//             top: 8,
//             left: 8,
//             zIndex: 1,
//           }}
//         />
//       )}

//       {craft.stock === 0 && (
//         <Chip
//           label="Out of Stock"
//           color="error"
//           size="small"
//           sx={{
//             position: 'absolute',
//             top: 8,
//             left: 8,
//             zIndex: 1,
//           }}
//         />
//       )}

//       {/* Craft Image */}
//       <Box sx={{ position: 'relative', height: 200 }}>
//         <CardMedia
//           component="img"
//           height="200"
//           image={craft.images?.[0] || '/api/placeholder/400/200'}
//           alt={craft.title}
//           sx={{
//             objectFit: 'cover',
//             transition: 'transform 0.3s ease',
//             ...(isHovered && { transform: 'scale(1.05)' }),
//           }}
//         />
        
//         {/* Quick Actions on Hover */}
//         {isHovered && (
//           <Box
//             sx={{
//               position: 'absolute',
//               bottom: 0,
//               left: 0,
//               right: 0,
//               backgroundColor: 'rgba(0, 0, 0, 0.7)',
//               display: 'flex',
//               justifyContent: 'center',
//               py: 1,
//               gap: 1,
//             }}
//           >
//             <Tooltip title="View Details">
//               <IconButton
//                 size="small"
//                 onClick={handleViewDetails}
//                 sx={{ color: 'white' }}
//               >
//                 <Visibility fontSize="small" />
//               </IconButton>
//             </Tooltip>
//             <Tooltip title="Add to Cart">
//               <IconButton
//                 size="small"
//                 onClick={handleAddToCart}
//                 sx={{ color: 'white' }}
//                 disabled={craft.stock === 0}
//               >
//                 <ShoppingCart fontSize="small" />
//               </IconButton>
//             </Tooltip>
//             <Tooltip title="Share">
//               <IconButton size="small" sx={{ color: 'white' }}>
//                 <Share fontSize="small" />
//               </IconButton>
//             </Tooltip>
//           </Box>
//         )}
//       </Box>

//       <CardContent sx={{ flexGrow: 1, p: 2 }}>
//         {/* Categories */}
//         {craft.categories && craft.categories.length > 0 && (
//           <Box sx={{ display: 'flex', gap: 0.5, mb: 1, flexWrap: 'wrap' }}>
//             {craft.categories.slice(0, 2).map((category, index) => (
//               <Chip
//                 key={index}
//                 label={category.name}
//                 size="small"
//                 variant="outlined"
//                 sx={{ fontSize: '0.7rem' }}
//               />
//             ))}
//             {craft.categories.length > 2 && (
//               <Chip
//                 label={`+${craft.categories.length - 2}`}
//                 size="small"
//                 variant="outlined"
//                 sx={{ fontSize: '0.7rem' }}
//               />
//             )}
//           </Box>
//         )}

//         {/* Craft Title */}
//         <Typography
//           variant="h6"
//           component="h3"
//           gutterBottom
//           sx={{
//             fontWeight: 600,
//             fontSize: '1rem',
//             lineHeight: 1.3,
//             height: 40,
//             overflow: 'hidden',
//             display: '-webkit-box',
//             WebkitLineClamp: 2,
//             WebkitBoxOrient: 'vertical',
//           }}
//         >
//           {craft.title}
//         </Typography>

//         {/* Craft Description */}
//         <Typography
//           variant="body2"
//           color="text.secondary"
//           sx={{
//             mb: 2,
//             height: 40,
//             overflow: 'hidden',
//             display: '-webkit-box',
//             WebkitLineClamp: 2,
//             WebkitBoxOrient: 'vertical',
//           }}
//         >
//           {craft.description}
//         </Typography>

//         {/* Rating */}
//         <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
//           <Rating
//             value={craft.averageRating || 0}
//             readOnly
//             precision={0.5}
//             size="small"
//           />
//           <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
//             ({craft.reviewCount || 0} reviews)
//           </Typography>
//         </Box>

//         {/* Artisan Info */}
//         <Box
//           sx={{
//             display: 'flex',
//             alignItems: 'center',
//             mb: 2,
//             cursor: 'pointer',
//             '&:hover': { opacity: 0.8 },
//           }}
//           onClick={handleArtisanClick}
//         >
//           <Avatar
//             src={craft.artisan?.avatar}
//             sx={{ width: 32, height: 32, mr: 1 }}
//           >
//             {craft.artisan?.firstName?.charAt(0)}
//           </Avatar>
//           <Box sx={{ flex: 1 }}>
//             <Typography variant="caption" fontWeight={600}>
//               {craft.artisan?.firstName} {craft.artisan?.lastName}
//             </Typography>
//             <Typography variant="caption" color="text.secondary" display="block">
//               Artisan
//             </Typography>
//           </Box>
//         </Box>
//       </CardContent>

//       <CardActions sx={{ p: 2, pt: 0, justifyContent: 'space-between' }}>
//         <Box>
//           <Typography variant="h6" color="primary" fontWeight={700}>
//             ${parseFloat(craft.price).toFixed(2)}
//           </Typography>
//           <Typography variant="caption" color="text.secondary">
//             {craft.stock} in stock
//           </Typography>
//         </Box>
        
//         <Button
//           variant="contained"
//           size="small"
//           startIcon={<ShoppingCart />}
//           onClick={handleAddToCart}
//           disabled={craft.stock === 0}
//           sx={{ borderRadius: 2 }}
//         >
//           {craft.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
//         </Button>
//       </CardActions>
//     </Card>
//   );
// };

// export default CraftCard;