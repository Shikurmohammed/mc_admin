import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  LinearProgress,
  alpha,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  MoreVert,
} from '@mui/icons-material';
import { Icon } from '@mui/material';

const StatCard = ({ title, value, change, icon, color = 'primary', progress, subtitle }) => {
  const isPositive = change && !change.startsWith('-');

  const colorMap = {
    primary: '#4f46e5',
    secondary: '#10b981',
    warning: '#f59e0b',
    success: '#10b981',
    error: '#ef4444',
    info: '#3b82f6',
  };

  const cardColor = colorMap[color] || colorMap.primary;

  return (
    <Card
      sx={{
        position: 'relative',
        overflow: 'hidden',
        '&:hover': {
          transform: 'translateY(-4px)',
          transition: 'transform 0.2s ease-in-out',
        },
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ textTransform: 'uppercase', fontWeight: 600, letterSpacing: 0.5 }}
            >
              {title}
            </Typography>
            <Typography variant="h4" component="div" sx={{ mt: 1, fontWeight: 700 }}>
              {value}
            </Typography>
            
            {subtitle && (
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                {subtitle}
              </Typography>
            )}

            {change && (
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                {isPositive ? (
                  <TrendingUp sx={{ fontSize: 16, color: 'success.main', mr: 0.5 }} />
                ) : (
                  <TrendingDown sx={{ fontSize: 16, color: 'error.main', mr: 0.5 }} />
                )}
                <Typography
                  variant="caption"
                  sx={{
                    color: isPositive ? 'success.main' : 'error.main',
                    fontWeight: 600,
                  }}
                >
                  {change}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
                  from last month
                </Typography>
              </Box>
            )}
          </Box>

          <Box>
            <IconButton size="small" sx={{ mb: 1 }}>
              <MoreVert fontSize="small" />
            </IconButton>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: alpha(cardColor, 0.1),
              }}
            >
              <Icon sx={{ color: cardColor, fontSize: 24 }}>
                {icon}
              </Icon>
            </Box>
          </Box>
        </Box>

        {progress !== undefined && (
          <Box sx={{ mt: 2 }}>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 6,
                borderRadius: 3,
                backgroundColor: alpha(cardColor, 0.2),
                '& .MuiLinearProgress-bar': {
                  backgroundColor: cardColor,
                  borderRadius: 3,
                },
              }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
              <Typography variant="caption" color="text.secondary">
                Progress
              </Typography>
              <Typography variant="caption" fontWeight={600}>
                {progress}%
              </Typography>
            </Box>
          </Box>
        )}
      </CardContent>

      {/* Decorative element */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: 100,
          height: 100,
          background: `radial-gradient(circle at top right, ${alpha(cardColor, 0.2)} 0%, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />
    </Card>
  );
};

export default StatCard;