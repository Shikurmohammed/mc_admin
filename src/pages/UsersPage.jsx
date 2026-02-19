import React, { useState, useEffect } from 'react';
import { Container, Box, Alert, Typography, Button, Paper } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ImportExport from '@mui/icons-material/ImportExport';
import Print from '@mui/icons-material/Print';
import PageHeader from '../components/common/PageHeader';
import { userAPI } from '../services/usersService';
import { useAuth } from '../context/AuthContext';
import notificationService from '../services/notificationService';
// Import components
import UserStats from '../components/users/UserStats';
import UserFilters from '../components/users/UserFilters';
import UserTable from '../components/users/UserTable';
import UserDetailsDialog from '../components/users/dialogs/UserDetailsDialog';
import UserFormDialog from '../components/users/dialogs/UserFormDialog';
import DeleteConfirmDialog from '../components/users/dialogs/DeleteConfirmDialog';
import BulkDeleteDialog from '../components/users/dialogs/BulkDeleteDialog';

const UsersPage = () => {
  const { user: currentUser } = useAuth();

  // Data states
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  // const [error, setError] = useState('');
  // const [success, setSuccess] = useState('');

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalUsers, setTotalUsers] = useState(0);

  // Filters
  const [filters, setFilters] = useState({
    search: '',
    role: '',
    status: '',
    dateRange: { start: '', end: '' }
  });

  // Sorting
  const [sort, setSort] = useState({
    field: 'createdAt',
    order: 'desc'
  });

  // Selection
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  // Dialog states
  const [dialogs, setDialogs] = useState({
    details: false,
    form: false,
    delete: false,
    bulkDelete: false
  });

  // Form state
  const [formMode, setFormMode] = useState('add');
  const [formData, setFormData] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    admin: 0,
    artisan: 0,
    customer: 0,
    active: 0,
    inactive: 0,
    verified: 0,
    unverified: 0
  });

  // Fetch users
  const fetchUsers = async () => {
    setLoading(true);

    try {
      const params = {
        page: page + 1,
        limit: rowsPerPage,
        sortBy: sort.field,
        sortOrder: sort.order.toUpperCase(),
        ...(filters.search && { search: filters.search }),
        ...(filters.role && { role: filters.role }),
        ...(filters.status && { status: filters.status }),
        ...(filters.dateRange.start && { startDate: filters.dateRange.start }),
        ...(filters.dateRange.end && { endDate: filters.dateRange.end }),
      };

    
      const response = await userAPI.getUsers(params);

      // If response is array, use it directly
      if (Array.isArray(response)) {
        console.log('Response is array, using directly');
        setUsers(response);
        setTotalUsers(response.length);
        calculateStats(response);
      }
      // If response has data property that's an array
      else if (response?.data && Array.isArray(response.data)) {
        console.log('Response has data array');
        setUsers(response.data);
        setTotalUsers(response.total || response.data.length);
        calculateStats(response.data);
      }
      //  If response has users property that's an array
      else if (response?.users && Array.isArray(response.users)) {
        console.log('Response has users array');
        setUsers(response.users);
        setTotalUsers(response.total || response.users.length);
        calculateStats(response.users);
      }
      else {
        console.log('Unexpected response format:', response);
        setUsers([]);
        setTotalUsers(0);
        calculateStats([]);
      }

    } catch (err) {
      notificationService.error(err.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };
  // Calculate statistics
  const calculateStats = (userList) => {
    setStats({
      total: userList.length,
      admin: userList.filter(u => u.role === 'ADMIN').length,
      artisan: userList.filter(u => u.role === 'ARTISAN').length,
      customer: userList.filter(u => u.role === 'CUSTOMER').length,
      active: userList.filter(u => u.isActive).length,
      inactive: userList.filter(u => !u.isActive).length,
      verified: userList.filter(u => u.isVerified).length,
      unverified: userList.filter(u => !u.isVerified).length
    });
  };

  useEffect(() => {
    fetchUsers();
  }, [page, rowsPerPage, filters.search, filters.role, filters.status, filters.dateRange, sort]);

  // Debounced search - prevents too many API calls while typing
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (filters.search !== undefined) {
        fetchUsers(); // This will use the current filters.search value
      }
    }, 500);
    return () => clearTimeout(timeout);
  }, [filters.search]);

  // Handlers
  const handlePageChange = (newPage) => setPage(newPage);
  const handleRowsPerPageChange = (value) => {
    setRowsPerPage(value);
    setPage(0);
  };

  const handleSort = (field) => {
    setSort({
      field,
      order: sort.field === field && sort.order === 'asc' ? 'desc' : 'asc'
    });
  };

  const handleFilterChange = (key, value) => {
    console.log(`Filter changed: ${key} = ${value}`);
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(0);
  };

  const handleDateRangeChange = (range) => {
    setFilters(prev => ({ ...prev, dateRange: range }));
    setPage(0);
  };

  const handleClearFilters = () => {
    setFilters({ search: '', role: '', status: '', dateRange: { start: '', end: '' } });
    setPage(0);
  };

  // Selection handlers
  const handleSelectAll = (checked) => {
    setSelectedUsers(checked ? users.map(user => user.id) : []);
  };

  const handleSelectUser = (userId, checked) => {
    setSelectedUsers(prev =>
      checked ? [...prev, userId] : prev.filter(id => id !== userId)
    );
  };

  // Dialog handlers
  const openDialog = (name, user = null) => {
    if (user) setSelectedUser(user);
    setDialogs(prev => ({ ...prev, [name]: true }));
  };

  const closeDialog = (name) => {
    setDialogs(prev => ({ ...prev, [name]: false }));
    if (name !== 'details') {
      setSelectedUser(null);
      setFormData(null);
      setFormErrors({});
    }
  };

  // Form handlers
  const handleAddUser = () => {
    setFormMode('add');
    setFormData({
      firstName: '', lastName: '', email: '', password: '', confirmPassword: '',
      role: 'CUSTOMER', phone: '', address: '', city: '', state: '', zipCode: '', country: '',
      isActive: true, isVerified: true
    });
    openDialog('form');
  };

  const handleEditUser = (user) => {
    setFormMode('edit');
    setFormData({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      password: '', confirmPassword: '',
      role: user.role || 'CUSTOMER',
      phone: user.phone || '',
      address: user.address || '',
      city: user.city || '',
      state: user.state || '',
      zipCode: user.zipCode || '',
      country: user.country || '',
      isActive: user.isActive ?? true,
      isVerified: user.isVerified ?? true
    });
    setSelectedUser(user);
    openDialog('form');
  };

  const handleSubmitUser = async (userData) => {
    setLoading(true);
    //   setError('');

    try {
      //1. Crate a copy
      const payload = { ...userData };
      if (formMode === 'edit') {
        //Remove password if it is empty(not modified)
        if (!payload.password || payload.password.trim() === '') {
          delete payload.password;//Remove the key so NestJS ignores it
        }
        //Always remove confirmPassword as it's not a database field
        delete payload.confirmPassword;
      }
      else {
        if (!payload.password || payload.password.trim() === '') {
          throw new Error('Password is required for new users.');
        }
        //Always delete confirmPassword as it's not a database field
        delete payload.confirmPassword;
      }
      if (formMode === 'add') {
        await userAPI.createUser(userData);
        //setSuccess('User created successfully');
        notificationService.success('User created successfully');
      } else {
        await userAPI.updateUser(selectedUser.id, userData);
        //setSuccess('User updated successfully');
        notificationService.success('User updated successfully');
      }

      closeDialog('form');
      fetchUsers();
      // setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      //setError(err.response?.data?.message || `Failed to ${formMode} user`);
      notificationService.error(err.response?.data?.message || `Failed to ${formMode} user`);

    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    try {
      await userAPI.deleteUser(selectedUser.id);
      // setSuccess('User deleted successfully');
      notificationService.success('User deleted successfully');
      closeDialog('delete');
      fetchUsers();
      // setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      // setError(err.response?.data?.message || 'Failed to delete user');
      notificationService.error(err.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleBulkDelete = async () => {
    try {
      await Promise.all(selectedUsers.map(id => userAPI.deleteUser(id)));
      //setSuccess(`${selectedUsers.length} users deleted successfully`);
      notificationService.success(`${selectedUsers.length} users deleted successfully`);
      setSelectedUsers([]);
      closeDialog('bulkDelete');
      fetchUsers();
      // setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      //setError(err.response?.data?.message || 'Failed to delete users');
      notificationService.error(err.response?.data?.message || 'Failed to delete users');
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      await userAPI.updateUser(userId, { isActive: !currentStatus });
      //setSuccess('User status updated');
      notificationService.compact.success('Status updated');
      fetchUsers();
      // setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      //setError(err.response?.data?.message || 'Failed to update status');
      notificationService.compact.error('Failed to update status');
    }
  };

  const handleToggleVerify = async (userId, currentStatus) => {
    try {
      await userAPI.updateUser(userId, { isVerified: !currentStatus });
      //setSuccess('User verification updated');
      notificationService.compact.success('Verification updated');
      fetchUsers();
      // setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      //setError(err.response?.data?.message || 'Failed to update verification');
      notificationService.compact.error('Failed to update verification');
    }
  };

  const handleExport = () => {
    const csv = users.map(user => ({
      ID: user.id,
      Name: `${user.firstName} ${user.lastName}`,
      Email: user.email,
      Role: user.role,
      Status: user.isActive ? 'Active' : 'Inactive',
      Verified: user.isVerified ? 'Yes' : 'No',
      Joined: new Date(user.createdAt).toLocaleDateString()
    }));
    //console.log('Export CSV:', csv);
    notificationService.info('Export started. Your file will download shortly.');
  };

  return (
    <Container maxWidth="xl">
      <PageHeader
        title="User Management"
        subtitle="Manage all users in the system"
        breadcrumbs={true}
        actions={[
          {
            label: 'New User',
            icon: <AddIcon />,
            onClick: handleAddUser,
            variant: 'contained',
            color: 'primary'
          },
          {
            label: 'Export',
            icon: <ImportExport />,
            onClick: handleExport,
            variant: 'outlined'
          },
          {
            label: 'Print',
            icon: <Print />,
            onClick: () => window.print(),
            variant: 'outlined'
          }
        ]}
      />

      {/* {success && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>{success}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>} */}

      <UserStats stats={stats} />

      {selectedUsers.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Paper sx={{ p: 1.5, bgcolor: 'primary.light', borderRadius: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography color="white" sx={{ fontSize: '0.875rem' }}>
                {selectedUsers.length} selected
              </Typography>
              <Box sx={{ display: 'flex', gap: 0.5, ml: 'auto' }}>
                <Button
                  size="small"
                  color="error"
                  variant="contained"
                  onClick={() => openDialog('bulkDelete')}
                  sx={{ textTransform: 'none', fontSize: '0.75rem', py: 0.25 }}
                >
                  Delete
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => setSelectedUsers([])}
                  sx={{ textTransform: 'none', fontSize: '0.75rem', py: 0.25, color: 'white', borderColor: 'white' }}
                >
                  Clear
                </Button>
              </Box>
            </Box>
          </Paper>
        </Box>
      )}

      <UserFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onDateRangeChange={handleDateRangeChange}
        onClearFilters={handleClearFilters}
        onRefresh={fetchUsers}
        loading={loading}
      />

      <UserTable
        users={users}
        loading={loading}
        selectedUsers={selectedUsers}
        onSelectAll={handleSelectAll}
        onSelectUser={handleSelectUser}
        sort={sort}
        onSort={handleSort}
        onView={(user) => openDialog('details', user)}
        onEdit={handleEditUser}
        onDelete={(user) => openDialog('delete', user)}
        onToggleStatus={handleToggleStatus}
        onToggleVerify={handleToggleVerify}
        currentUser={currentUser}
        page={page}
        rowsPerPage={rowsPerPage}
        totalUsers={totalUsers}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
      />

      {/* Dialogs */}
      <UserDetailsDialog
        open={dialogs.details}
        onClose={() => closeDialog('details')}
        user={selectedUser}
        onEdit={() => {
          closeDialog('details');
          handleEditUser(selectedUser);
        }}
      />

      <UserFormDialog
        open={dialogs.form}
        onClose={() => closeDialog('form')}
        mode={formMode}
        initialData={formData}
        errors={formErrors}
        onSubmit={handleSubmitUser}
        loading={loading}
      />

      <DeleteConfirmDialog
        open={dialogs.delete}
        onClose={() => closeDialog('delete')}
        onConfirm={handleDeleteUser}
        user={selectedUser}
      />

      <BulkDeleteDialog
        open={dialogs.bulkDelete}
        onClose={() => closeDialog('bulkDelete')}
        onConfirm={handleBulkDelete}
        count={selectedUsers.length}
      />
    </Container>
  );
};

export default UsersPage;