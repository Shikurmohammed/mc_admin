import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  useTheme,
} from '@mui/material';

export const ThemeAwareTableContainer = ({ children, ...props }) => {
  const theme = useTheme();
  
  return (
    <TableContainer 
      component={Paper} 
      sx={{ 
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        border: `1px solid ${theme.palette.divider}`,
        ...props.sx 
      }} 
      {...props}
    >
      {children}
    </TableContainer>
  );
};

export const ThemeAwareTableCell = ({ children, ...props }) => {
  const theme = useTheme();
  
  return (
    <TableCell 
      sx={{ 
        color: theme.palette.text.primary,
        borderBottom: `1px solid ${theme.palette.divider}`,
        ...props.sx 
      }} 
      {...props}
    >
      {children}
    </TableCell>
  );
};

export const ThemeAwareTableRow = ({ children, ...props }) => {
  const theme = useTheme();
  
  return (
    <TableRow 
      sx={{ 
        '&:hover': {
          backgroundColor: theme.palette.action.hover,
        },
        ...props.sx 
      }} 
      {...props}
    >
      {children}
    </TableRow>
  );
};