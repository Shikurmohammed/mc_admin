// UserTableRow.jsx
import React from 'react';
import {
  TableCell,
  TableRow,
  Box,
  Typography,
  Avatar,
  Chip,
  IconButton,
  Tooltip,
  Checkbox,
  Badge
} from '@mui/material';
import {
  Visibility,
  Edit,
  Delete,
  Block,
  CheckCircle,
  Verified,
  Warning,
  AdminPanelSettings,
  Storefront,
  Person,
  CalendarToday
} from '@mui/icons-material';

const UserTableRow = ({ 
  user, 
  selected, 
  onSelect, 
  onView, 
  onEdit, 
  onDelete, 
  onToggleStatus, 
  onToggleVerify, 
  disabled 
}) => {
  const roleColors = {
    ADMIN: 'error',
    ARTISAN: 'warning',
    CUSTOMER: 'success',
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <TableRow 
      hover
      selected={selected}
      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
    >
      <TableCell padding="checkbox" sx={{ py: 0.5 }}>
        <Checkbox
          size="small"
          checked={selected}
          onChange={(e) => onSelect(e.target.checked)}
          sx={{ p: 0.5 }}
        />
      </TableCell>
      
      <TableCell sx={{ py: 0.5, fontSize: '0.875rem' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            badgeContent={
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: user.isActive ? 'success.main' : 'error.main',
                  border: '1px solid white'
                }}
              />
            }
          >
            <Avatar
              src={user.avatar}
              sx={{ width: 28, height: 28, fontSize: '0.75rem' }}
            >
              {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
            </Avatar>
          </Badge>
          <Box>
            <Typography variant="body2" fontWeight={500} sx={{ fontSize: '0.875rem', lineHeight: 1.2 }}>
              {user.firstName} {user.lastName}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.675rem' }}>
              ID: {user.id}
            </Typography>
          </Box>
        </Box>
      </TableCell>
      
      <TableCell sx={{ py: 0.5, fontSize: '0.875rem' }}>
        <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
          {user.email}
        </Typography>
      </TableCell>
      
      <TableCell sx={{ py: 0.5 }}>
        <Chip
          label={user.role}
          size="small"
          color={roleColors[user.role]}
          icon={
            user.role === 'ADMIN' ? <AdminPanelSettings sx={{ fontSize: '0.875rem' }} /> :
            user.role === 'ARTISAN' ? <Storefront sx={{ fontSize: '0.875rem' }} /> :
            <Person sx={{ fontSize: '0.875rem' }} />
          }
          sx={{ 
            height: 20, 
            fontSize: '0.675rem', 
            fontWeight: 500,
            '& .MuiChip-label': { px: 1 }
          }}
        />
      </TableCell>
      
      <TableCell sx={{ py: 0.5 }}>
        <Chip
          label={user.isActive ? 'Active' : 'Inactive'}
          size="small"
          color={user.isActive ? 'success' : 'default'}
          variant={user.isActive ? 'filled' : 'outlined'}
          sx={{ 
            height: 20, 
            fontSize: '0.675rem',
            '& .MuiChip-label': { px: 1 }
          }}
        />
      </TableCell>
      
      <TableCell sx={{ py: 0.5 }}>
        <Chip
          label={user.isVerified ? 'Verified' : 'Unverified'}
          size="small"
          color={user.isVerified ? 'success' : 'warning'}
          variant={user.isVerified ? 'filled' : 'outlined'}
          icon={user.isVerified ? <Verified sx={{ fontSize: '0.875rem' }} /> : <Warning sx={{ fontSize: '0.875rem' }} />}
          sx={{ 
            height: 20, 
            fontSize: '0.675rem',
            '& .MuiChip-label': { px: 1 }
          }}
        />
      </TableCell>
      
      <TableCell sx={{ py: 0.5, fontSize: '0.875rem' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <CalendarToday sx={{ fontSize: '0.75rem', color: 'text.secondary' }} />
          <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
            {formatDate(user.createdAt)}
          </Typography>
        </Box>
      </TableCell>
      
      <TableCell align="right" sx={{ py: 0.5 }}>
        <Box sx={{ display: 'flex', gap: 0.25, justifyContent: 'flex-end' }}>
          <Tooltip title="View" arrow placement="top">
            <IconButton size="small" onClick={onView} sx={{ p: 0.5 }}>
              <Visibility sx={{ fontSize: '1rem' }} />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Edit" arrow placement="top">
            <IconButton size="small" onClick={onEdit} sx={{ p: 0.5 }}>
              <Edit sx={{ fontSize: '1rem' }} />
            </IconButton>
          </Tooltip>
          
          <Tooltip title={user.isActive ? 'Deactivate' : 'Activate'} arrow placement="top">
            <IconButton
              size="small"
              color={user.isActive ? 'warning' : 'success'}
              onClick={onToggleStatus}
              disabled={disabled}
              sx={{ p: 0.5 }}
            >
              {user.isActive ? <Block sx={{ fontSize: '1rem' }} /> : <CheckCircle sx={{ fontSize: '1rem' }} />}
            </IconButton>
          </Tooltip>
          
          <Tooltip title={user.isVerified ? 'Unverify' : 'Verify'} arrow placement="top">
            <IconButton
              size="small"
              color={user.isVerified ? 'warning' : 'success'}
              onClick={onToggleVerify}
              sx={{ p: 0.5 }}
            >
              {user.isVerified ? <Warning sx={{ fontSize: '1rem' }} /> : <Verified sx={{ fontSize: '1rem' }} />}
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Delete" arrow placement="top">
            <IconButton
              size="small"
              color="error"
              onClick={onDelete}
              disabled={disabled}
              sx={{ p: 0.5 }}
            >
              <Delete sx={{ fontSize: '1rem' }} />
            </IconButton>
          </Tooltip>
        </Box>
      </TableCell>
    </TableRow>
  );
};
export default UserTableRow;