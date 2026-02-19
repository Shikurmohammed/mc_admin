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

const BulkDeleteDialog = ({ open, onClose, onConfirm, count }) => {
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
          Delete Selected Users
        </Typography>
      </DialogTitle>
      
      <DialogContent sx={{ p: 2 }}>
        <Box sx={{ textAlign: 'center' }}>
          <Delete sx={{ fontSize: 36, color: 'error.main', mb: 1 }} />
          <Typography variant="body2" gutterBottom sx={{ fontSize: '0.875rem' }}>
            Delete {count} user(s)?
          </Typography>
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
          Delete {count} Users
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BulkDeleteDialog;