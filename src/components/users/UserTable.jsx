import React from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Checkbox,
  LinearProgress,
  CircularProgress,
  Typography,
  Box
} from '@mui/material';
import UserTableRow from './UserTableRow';

const UserTable = ({
  users,
  loading,
  selectedUsers,
  onSelectAll,
  onSelectUser,
  sort,
  onSort,
  onView,
  onEdit,
  onDelete,
  onToggleStatus,
  onToggleVerify,
  currentUser,
  page,
  rowsPerPage,
  totalUsers,
  onPageChange,
  onRowsPerPageChange
}) => {
  const headCells = [
    { id: 'name', label: 'User', sortable: true, field: 'firstName' },
    { id: 'email', label: 'Email', sortable: true, field: 'email' },
    { id: 'role', label: 'Role', sortable: true, field: 'role' },
    { id: 'status', label: 'Status', sortable: false },
    { id: 'verified', label: 'Verified', sortable: false },
    { id: 'joined', label: 'Joined', sortable: true, field: 'createdAt' },
    { id: 'actions', label: 'Actions', sortable: false, align: 'right' }
  ];

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 1.5 }}>
      <TableContainer sx={{ maxHeight: 'calc(100vh - 300px)' }}>
        {loading && <LinearProgress sx={{ height: 2 }} />}
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox" sx={{ py: 0.75 }}>
                <Checkbox
                  size="small"
                  indeterminate={selectedUsers.length > 0 && selectedUsers.length < users.length}
                  checked={users.length > 0 && selectedUsers.length === users.length}
                  onChange={(e) => onSelectAll(e.target.checked)}
                  sx={{ p: 0.5 }}
                />
              </TableCell>
              {headCells.map((headCell) => (
                <TableCell
                  key={headCell.id}
                  align={headCell.align || 'left'}
                  sx={{ py: 0.75, fontSize: '0.75rem', fontWeight: 600 }}
                >
                  {headCell.sortable ? (
                    <TableSortLabel
                      active={sort.field === headCell.field}
                      direction={sort.field === headCell.field ? sort.order : 'asc'}
                      onClick={() => onSort(headCell.field)}
                      sx={{ '& .MuiTableSortLabel-icon': { fontSize: '1rem' } }}
                    >
                      {headCell.label}
                    </TableSortLabel>
                  ) : (
                    headCell.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {loading && users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                  <CircularProgress size={24} />
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                    No users found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <UserTableRow
                  key={user.id}
                  user={user}
                  selected={selectedUsers.includes(user.id)}
                  onSelect={(checked) => onSelectUser(user.id, checked)}
                  onView={() => onView(user)}
                  onEdit={() => onEdit(user)}
                  onDelete={() => onDelete(user)}
                  onToggleStatus={() => onToggleStatus(user.id, user.isActive)}
                  onToggleVerify={() => onToggleVerify(user.id, user.isVerified)}
                  disabled={user.id === currentUser?.id}
                />
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={totalUsers}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(e, p) => onPageChange(p)}
        onRowsPerPageChange={(e) => onRowsPerPageChange(e.target.value)}
        sx={{
          '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
            fontSize: '0.75rem'
          },
          '& .MuiTablePagination-select': {
            fontSize: '0.75rem',
            py: 0.5
          },
          '& .MuiTablePagination-actions button': {
            p: 0.5
          }
        }}
      />
    </Paper>
  );
};

export default UserTable;