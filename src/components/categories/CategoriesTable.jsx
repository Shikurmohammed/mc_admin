import React from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Chip,
  Avatar,
  Box,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';
import {
  Edit,
  Delete,
  Visibility,
  Inventory,
  Image as ImageIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const CategoriesTable = ({ categories, onEdit, onDelete, onViewCrafts, isAdmin }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleViewCrafts = (category) => {
    if (category.crafts?.length > 0) {
      onViewCrafts(category);
    } else {
      navigate(`/crafts?category=${category.id}`);
    }
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 2 }}>
      <TableContainer>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>{t('categories.image')}</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>{t('categories.name')}</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>{t('categories.description')}</TableCell>
              <TableCell align="center" sx={{ fontWeight: 600 }}>
                {t('categories.craftsCount')}
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 600 }}>
                {t('categories.crafts')}
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>
                {t('common.actions')}
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {categories.map((category) => {
              const craftCount = category.crafts?.length || 0;
              const hasCrafts = craftCount > 0;

              return (
                <TableRow key={category.id} hover>
                  <TableCell>
                    <Avatar
                      src={category.image}
                      variant="rounded"
                      sx={{ width: 40, height: 40 }}
                    >
                      <ImageIcon fontSize="small" />
                    </Avatar>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2" fontWeight={500}>
                      {category.name}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        maxWidth: 300,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {category.description || '-'}
                    </Typography>
                  </TableCell>

                  <TableCell align="center">
                    <Chip
                      label={craftCount}
                      size="small"
                      color={hasCrafts ? 'primary' : 'default'}
                      variant={hasCrafts ? 'filled' : 'outlined'}
                    />
                  </TableCell>

                  <TableCell align="center">
                    <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center', flexWrap: 'wrap' }}>
                      {category.crafts?.slice(0, 3).map((craft) => (
                        <Chip
                          key={craft.id}
                          label={craft.title}
                          size="small"
                          sx={{ fontSize: '0.6rem', height: 20 }}
                          onClick={() => navigate(`/crafts/${craft.id}`)}
                        />
                      ))}
                      {craftCount > 3 && (
                        <Chip
                          label={`+${craftCount - 3}`}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: '0.6rem', height: 20 }}
                        />
                      )}
                    </Box>
                  </TableCell>

                  <TableCell align="right">
                    <Tooltip title={t('categories.viewCrafts')}>
                      <IconButton
                        size="small"
                        onClick={() => handleViewCrafts(category)}
                        color={hasCrafts ? 'primary' : 'default'}
                      >
                        <Inventory fontSize="small" />
                      </IconButton>
                    </Tooltip>

                    {isAdmin && (
                      <>
                        <Tooltip title={t('common.edit')}>
                          <IconButton
                            size="small"
                            onClick={() => onEdit(category)}
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title={t('common.delete')}>
                          <IconButton
                            size="small"
                            onClick={() => onDelete(category)}
                            color="error"
                            disabled={hasCrafts}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default CategoriesTable;