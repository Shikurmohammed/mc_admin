import React, { useState } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  Tooltip,
  Box,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  LinearProgress,
  CircularProgress,
  Card,
  CardContent,
  Grid,
  
} from '@mui/material';
import {
  Visibility,
  Edit,
  Delete,
  CheckCircle,
  LocalShipping,
  Cancel,
  Refresh,
  MoreVert,
  Receipt,
  Print,
  Email,
  Schedule,
} from '@mui/icons-material';
import { format } from 'date-fns';
import OrderDetailsDialog from './OrderDetailsDialog';
import UpdateStatusDialog from './UpdateStatusDialog';
import notificationService from '../../services/notificationService';

const statusConfig = {
  PENDING: {
    color: 'warning',
    icon: <Schedule sx={{ fontSize: '0.875rem' }} />,
    label: 'Pending',
    next: ['PROCESSING', 'CANCELLED']
  },
  PROCESSING: {
    color: 'info',
    icon: <Refresh sx={{ fontSize: '0.875rem' }} />,
    label: 'Processing',
    next: ['SHIPPED', 'CANCELLED']
  },
  SHIPPED: {
    color: 'primary',
    icon: <LocalShipping sx={{ fontSize: '0.875rem' }} />,
    label: 'Shipped',
    next: ['DELIVERED', 'CANCELLED']
  },
  DELIVERED: {
    color: 'success',
    icon: <CheckCircle sx={{ fontSize: '0.875rem' }} />,
    label: 'Delivered',
    next: ['REFUNDED']
  },
  CANCELLED: {
    color: 'error',
    icon: <Cancel sx={{ fontSize: '0.875rem' }} />,
    label: 'Cancelled',
    next: []
  },
  REFUNDED: {
    color: 'default',
    icon: <Cancel sx={{ fontSize: '0.875rem' }} />,
    label: 'Refunded',
    next: []
  }
};

const OrdersTable = ({
  orders,
  loading,
  userRole,
  pagination,
  onPageChange,
  onRowsPerPageChange,
  onRefresh,
}) => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuOrder, setMenuOrder] = useState(null);

  const handleMenuOpen = (event, order) => {
    setAnchorEl(event.currentTarget);
    setMenuOrder(order);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuOrder(null);
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setDetailsDialogOpen(true);
    handleMenuClose();
  };

  const handleUpdateStatus = (order) => {
    setSelectedOrder(order);
    setStatusDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      // await ordersAPI.deleteOrder(orderId);
      notificationService.success('Order deleted successfully');
      onRefresh();
    } catch (err) {
      notificationService.error('Failed to delete order');
    }
    handleMenuClose();
  };

  const handlePrintInvoice = (order) => {
    console.log('Print invoice for order:', order.id);
    handleMenuClose();
  };

  const handleEmailCustomer = (order) => {
    console.log('Email customer for order:', order.id);
    handleMenuClose();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (loading && orders.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading orders...</Typography>
      </Paper>
    );
  }

  return (
    <>
      <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 2 }}>
        {loading && <LinearProgress />}
        
        <TableContainer sx={{ maxHeight: 'calc(100vh - 350px)' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Order</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Customer</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Items</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Total</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Payment</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Receipt sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                      <Typography color="text.secondary">
                        No orders found
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => (
                  <TableRow
                    key={order.id}
                    hover
                    sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}
                    onClick={() => handleViewDetails(order)}
                  >
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight={600}>
                          #{order.orderNumber || `ORD-${order.id}`}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          ID: {order.id}
                        </Typography>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar
                          src={order.user?.avatar}
                          sx={{ width: 32, height: 32 }}
                        >
                          {order.user?.firstName?.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2">
                            {order.user?.firstName} {order.user?.lastName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {order.user?.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2">
                        {format(new Date(order.createdAt), 'MMM dd, yyyy')}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {format(new Date(order.createdAt), 'hh:mm a')}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={`${order.items?.length || 0} items`}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2" fontWeight={600} color="primary.main">
                        {formatCurrency(order.totalAmount)}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={statusConfig[order.status]?.label || order.status}
                        color={statusConfig[order.status]?.color}
                        icon={statusConfig[order.status]?.icon}
                        size="small"
                        sx={{ fontWeight: 500 }}
                      />
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={order.paymentMethod || 'N/A'}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>

                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMenuOpen(e, order);
                        }}
                      >
                        <MoreVert />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={pagination.total}
          rowsPerPage={pagination.rowsPerPage}
          page={pagination.page}
          onPageChange={(e, p) => onPageChange(p)}
          onRowsPerPageChange={(e) => onRowsPerPageChange(e.target.value)}
          showFirstButton
          showLastButton
        />
      </Paper>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: { minWidth: 200, borderRadius: 2 }
        }}
      >
        <MenuItem onClick={() => handleViewDetails(menuOrder)}>
          <ListItemIcon>
            <Visibility fontSize="small" />
          </ListItemIcon>
          <ListItemText>View Details</ListItemText>
        </MenuItem>

        {(userRole === 'ADMIN' || userRole === 'ARTISAN') && (
          <MenuItem onClick={() => handleUpdateStatus(menuOrder)}>
            <ListItemIcon>
              <Edit fontSize="small" />
            </ListItemIcon>
            <ListItemText>Update Status</ListItemText>
          </MenuItem>
        )}

        <MenuItem onClick={() => handlePrintInvoice(menuOrder)}>
          <ListItemIcon>
            <Print fontSize="small" />
          </ListItemIcon>
          <ListItemText>Print Invoice</ListItemText>
        </MenuItem>

        <MenuItem onClick={() => handleEmailCustomer(menuOrder)}>
          <ListItemIcon>
            <Email fontSize="small" />
          </ListItemIcon>
          <ListItemText>Email Customer</ListItemText>
        </MenuItem>

        {(userRole === 'ADMIN') && (
          <MenuItem
            onClick={() => handleDeleteOrder(menuOrder?.id)}
            sx={{ color: 'error.main' }}
          >
            <ListItemIcon>
              <Delete fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText>Delete Order</ListItemText>
          </MenuItem>
        )}
      </Menu>

      {/* Dialogs */}
      <OrderDetailsDialog
        open={detailsDialogOpen}
        onClose={() => setDetailsDialogOpen(false)}
        order={selectedOrder}
        onUpdateStatus={() => {
          setDetailsDialogOpen(false);
          handleUpdateStatus(selectedOrder);
        }}
      />

      <UpdateStatusDialog
        open={statusDialogOpen}
        onClose={() => setStatusDialogOpen(false)}
        order={selectedOrder}
        onSuccess={() => {
          setStatusDialogOpen(false);
          onRefresh();
        }}
      />
    </>
  );
};

export default OrdersTable;