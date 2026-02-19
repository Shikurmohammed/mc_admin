import React, { useState } from 'react';
import {
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  PictureAsPdf,
  TableChart,
  FileDownload,
  Image,
  Share,
} from '@mui/icons-material';
import { dashboardAPI } from '../../../services/apiService';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf'; 


const ExportMenu = ({ targetId, data, chartType, fileName = 'export' }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const showMessage = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const exportToPDF = async () => {
    setLoading(true);
    try {
      const element = document.getElementById(targetId);
      if (!element) throw new Error('Export target not found');

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height],
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`${fileName}.pdf`);
      showMessage('PDF exported successfully');
    } catch (error) {
      showMessage('Failed to export PDF', 'error');
    } finally {
      setLoading(false);
      handleClose();
    }
  };

  const exportToExcel = async () => {
    setLoading(true);
    try {
      const response = await dashboardAPI.exportData('excel', {
        type: chartType,
        data,
        fileName: `${fileName}.xlsx`,
      });

      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${fileName}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      showMessage('Excel file exported successfully');
    } catch (error) {
      showMessage('Failed to export Excel file', 'error');
    } finally {
      setLoading(false);
      handleClose();
    }
  };

  const exportAsImage = async () => {
    setLoading(true);
    try {
      const element = document.getElementById(targetId);
      if (!element) throw new Error('Export target not found');

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const link = document.createElement('a');
      link.download = `${fileName}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

      showMessage('Image exported successfully');
    } catch (error) {
      showMessage('Failed to export image', 'error');
    } finally {
      setLoading(false);
      handleClose();
    }
  };

  const exportOptions = [
    {
      label: 'Export as PDF',
      icon: <PictureAsPdf />,
      onClick: exportToPDF,
      disabled: false,
    },
    {
      label: 'Export as Excel',
      icon: <TableChart />,
      onClick: exportToExcel,
      disabled: false,
    },
    {
      label: 'Export as Image',
      icon: <Image />,
      onClick: exportAsImage,
      disabled: false,
    },
    {
      label: 'Share Dashboard',
      icon: <Share />,
      onClick: () => {
        // Implement sharing logic
        showMessage('Share feature coming soon!', 'info');
        handleClose();
      },
      disabled: false,
    },
  ];

  return (
    <>
      <IconButton onClick={handleClick} disabled={loading}>
        {loading ? <CircularProgress size={24} /> : <FileDownload />}
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {exportOptions.map((option, index) => (
          <MenuItem
            key={index}
            onClick={option.onClick}
            disabled={option.disabled || loading}
          >
            <ListItemIcon>{option.icon}</ListItemIcon>
            <ListItemText>{option.label}</ListItemText>
          </MenuItem>
        ))}
      </Menu>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ExportMenu;