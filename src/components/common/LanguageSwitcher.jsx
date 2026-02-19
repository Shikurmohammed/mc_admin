// src/components/common/LanguageSwitcher.jsx
import React, { useState } from 'react';
import {
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  IconButton,
  Tooltip,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Language as LanguageIcon,
  Check,
  Translate,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useLanguage, languages } from '../../context/LanguageContext'

const LanguageSwitcher = ({ variant = 'button', size = 'medium' }) => {
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const { language, changeLanguage } = useLanguage();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageChange = (langCode) => {
    i18n.changeLanguage(langCode);
    changeLanguage(langCode);
    handleClose();
  };

  const currentLanguage = languages[language] || languages.en;

  if (variant === 'icon') {
    return (
      <>
        <Tooltip title={t('settings.language')}>
          <IconButton
            onClick={handleClick}
            size={size}
            sx={{
              color: 'text.primary',
              '&:hover': {
                bgcolor: alpha(theme.palette.primary.main, 0.1),
              },
            }}
          >
            <Translate />
          </IconButton>
        </Tooltip>
        <LanguageMenu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          currentLanguage={currentLanguage}
          onLanguageChange={handleLanguageChange}
        />
      </>
    );
  }

  return (
    <>
      <Button
        onClick={handleClick}
        startIcon={<LanguageIcon />}
        size={size}
        sx={{
          color: 'text.primary',
          borderColor: 'divider',
          '&:hover': {
            borderColor: 'primary.main',
            bgcolor: alpha(theme.palette.primary.main, 0.1),
          },
        }}
        variant="outlined"
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <span>{currentLanguage.flag}</span>
          <Typography variant="body2">
            {currentLanguage.name}
          </Typography>
        </Box>
      </Button>
      <LanguageMenu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        currentLanguage={currentLanguage}
        onLanguageChange={handleLanguageChange}
      />
    </>
  );
};

const LanguageMenu = ({ anchorEl, open, onClose, currentLanguage, onLanguageChange }) => {
  const theme = useTheme();

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          mt: 1,
          minWidth: 200,
          borderRadius: 2,
          boxShadow: theme.shadows[4],
        },
      }}
    >
      {Object.values(languages).map((lang) => (
        <MenuItem
          key={lang.code}
          onClick={() => onLanguageChange(lang.code)}
          selected={currentLanguage.code === lang.code}
          sx={{
            py: 1.5,
            '&.Mui-selected': {
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              '&:hover': {
                bgcolor: alpha(theme.palette.primary.main, 0.15),
              },
            },
          }}
        >
          <ListItemIcon>
            <Typography variant="body1">{lang.flag}</Typography>
          </ListItemIcon>
          <ListItemText>
            <Box>
              <Typography variant="body2" fontWeight={500}>
                {lang.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {lang.nativeName}
              </Typography>
            </Box>
          </ListItemText>
          {currentLanguage.code === lang.code && (
            <ListItemIcon sx={{ justifyContent: 'flex-end' }}>
              <Check color="primary" fontSize="small" />
            </ListItemIcon>
          )}
        </MenuItem>
      ))}
    </Menu>
  );
};

export default LanguageSwitcher;