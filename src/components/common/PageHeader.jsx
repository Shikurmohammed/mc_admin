import React from 'react';
import {
  Box,
  Typography,
  Breadcrumbs,
  Link,
  Button,
  IconButton,
  Chip,
  AvatarGroup,
  Avatar,
  Tooltip,
} from '@mui/material';
import {
  NavigateNext,
  Add,
  Refresh,
  Download,
  FilterList,
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';


const PageHeader = ({
  title,
  subtitle,
  breadcrumbs = true,
  actions = [],
  onRefresh,
  onAdd,
  onDownload,
  onFilter,
  tags = [],
  collaborators = [],
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Generate breadcrumbs from URL
  const pathnames = location.pathname.split('/').filter((x) => x);

  const formatName = (string) => {
    return string
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <Box sx={{ mb: 4 }}>
      {/* Breadcrumbs Section */}
      {breadcrumbs && (
        <Breadcrumbs
          separator={<NavigateNext fontSize="small" />}
          aria-label="breadcrumb"
          sx={{ mb: 1 }}
        >
          <Link
            underline="hover"
            color="inherit"
            onClick={() => navigate('/')}
            sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center', fontSize: '0.875rem' }}
          >
            Dashboard
          </Link>
          {pathnames.map((name, index) => {
            const isLast = index === pathnames.length - 1;
            const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;

            return isLast ? (
              <Typography 
                key={name} 
                variant="body2" 
                color="text.primary" 
                sx={{ fontWeight: 500 }}
              >
                {formatName(name)}
              </Typography>
            ) : (
              <Link
                key={name}
                underline="hover"
                color="inherit"
                onClick={() => navigate(routeTo)}
                sx={{ cursor: 'pointer', fontSize: '0.875rem' }}
              >
                {formatName(name)}
              </Link>
            );
          })}
        </Breadcrumbs>
      )}

      {/* Title and Actions Section */}
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start', 
          flexWrap: 'wrap', 
          gap: 2 
        }}
      >
        <Box>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 800, mb: 0.5 }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body1" color="text.secondary" sx={{ mb: 1.5 }}>
              {subtitle}
            </Typography>
          )}
          
          {(tags.length > 0 || collaborators.length > 0) && (
            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', flexWrap: 'wrap', mt: 1 }}>
              {tags.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  size="small"
                  sx={{ borderRadius: 1, fontWeight: 500 }}
                />
              ))}
              
              {collaborators.length > 0 && (
                <AvatarGroup max={4}>
                  {collaborators.map((collab, index) => (
                    <Tooltip key={index} title={collab.name}>
                      <Avatar
                        alt={collab.name}
                        src={collab.avatar}
                        sx={{ width: 28, height: 28, border: '2px solid white' }}
                      >
                        {collab.name.charAt(0)}
                      </Avatar>
                    </Tooltip>
                  ))}
                </AvatarGroup>
              )}
            </Box>
          )}
        </Box>

        {/* Action Buttons Section */}
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          {onFilter && (
            <Tooltip title="Filter">
              <IconButton onClick={onFilter} size="small" sx={{ border: '1px solid', borderColor: 'divider' }}>
                <FilterList fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          
          {onDownload && (
            <Tooltip title="Download">
              <IconButton onClick={onDownload} size="small" sx={{ border: '1px solid', borderColor: 'divider' }}>
                <Download fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          
          {onRefresh && (
            <Tooltip title="Refresh">
              <IconButton onClick={onRefresh} size="small" sx={{ border: '1px solid', borderColor: 'divider' }}>
                <Refresh fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          
          {onAdd && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={onAdd}
              sx={{ borderRadius: 1.5, textTransform: 'none', fontWeight: 600, px: 2 }}
            >
              Add New
            </Button>
          )}
          
          {actions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant || 'outlined'}
              startIcon={action.icon}
              onClick={action.onClick}
              sx={{ borderRadius: 1.5, textTransform: 'none', fontWeight: 600, px: 2 }}
            >
              {action.label}
            </Button>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default PageHeader;
