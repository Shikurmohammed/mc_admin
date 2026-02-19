import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button
} from '@mui/material';
import { Delete } from '@mui/icons-material';

const DeleteConfirmDialog = ({ open, onClose, onConfirm, user }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{ sx: { borderRadius: 2 } }}
    >
      <DialogTitle sx={{ py: 1.5, px: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Typography variant="subtitle1" fontWeight={600} sx={{ fontSize: '1rem' }}>
          Delete User
        </Typography>
      </DialogTitle>
      
      <DialogContent sx={{ p: 2 }}>
        <Box sx={{ textAlign: 'center' }}>
          <Delete sx={{ fontSize: 36, color: 'error.main', mb: 1 }} />
          <Typography variant="body2" gutterBottom sx={{ fontSize: '0.875rem' }}>
            Are you sure to delete this user?
          </Typography>
          {user && (
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem', display: 'block' }}>
              {user.firstName} {user.lastName} ({user.email})
            </Typography>
          )}
          <Typography variant="caption" color="error" sx={{ fontSize: '0.75rem', display: 'block', mt: 1 }}>
            This action cannot be undone.
          </Typography>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
        <Button 
          size="small"
          onClick={onClose} 
          sx={{ fontSize: '0.75rem', textTransform: 'none' }}
        >
          Cancel
        </Button>
        <Button
          size="small"
          onClick={onConfirm}
          variant="contained"
          color="error"
          sx={{ fontSize: '0.75rem', textTransform: 'none' }}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmDialog;