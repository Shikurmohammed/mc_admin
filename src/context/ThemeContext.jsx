import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import themeService from '../services/themeService';

const ThemeContext = createContext();

export const useThemeMode = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeMode must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [themeSettings, setThemeSettings] = useState(() => {
    const settings = themeService.loadThemeSettings();
    return settings;
  });

  // Create theme based on settings - no key needed
  const theme = useMemo(() => {
    const newTheme = themeService.createTheme(themeSettings);
    return newTheme;
  }, [themeSettings]);

  // Update CSS variables when theme changes
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--primary-color', theme.palette.primary.main);
    root.style.setProperty('--secondary-color', theme.palette.secondary.main);
    root.style.setProperty('--background-color', theme.palette.background.default);
    root.style.setProperty('--paper-color', theme.palette.background.paper);
  }, [theme]);

  const updateThemeSettings = (newSettings) => {
    setThemeSettings(prev => {
      const updated = { ...prev, ...newSettings };
      themeService.saveThemeSettings(updated);
      return updated;
    });
  };

  const toggleTheme = () => {
    const newMode = themeSettings.mode === 'light' ? 'dark' : 'light';
    updateThemeSettings({ mode: newMode });
  };

  const setThemeMode = (mode) => {
    updateThemeSettings({ mode });
  };

  const setColorScheme = (colorScheme) => {
    updateThemeSettings({ colorScheme });
  };

  const setFontSize = (fontSize) => {
    updateThemeSettings({ fontSize });
  };

  const setShape = (shape) => {
    updateThemeSettings({ shape });
  };

  const setDensity = (density) => {
    updateThemeSettings({ density });
  };

  const resetTheme = () => {
    const defaultSettings = {
      mode: 'light',
      colorScheme: 'default',
      fontSize: 'medium',
      shape: 'rounded',
      density: 'comfortable',
    };
    setThemeSettings(defaultSettings);
    themeService.saveThemeSettings(defaultSettings);
  };

  const value = {
    mode: themeSettings.mode,
    colorScheme: themeSettings.colorScheme,
    fontSize: themeSettings.fontSize,
    shape: themeSettings.shape,
    density: themeSettings.density,
    theme,
    toggleTheme,
    setThemeMode,
    setColorScheme,
    setFontSize,
    setShape,
    setDensity,
    resetTheme,
    updateThemeSettings,
    getAvailableThemes: themeService.getAvailableThemes,
    getAvailableColorSchemes: themeService.getAvailableColorSchemes,
    getAvailableFontSizes: themeService.getAvailableFontSizes,
    getAvailableShapes: themeService.getAvailableShapes,
    getAvailableDensities: themeService.getAvailableDensities,
  };

  return (
    <ThemeContext.Provider value={value}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};