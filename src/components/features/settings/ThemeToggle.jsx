import React from 'react';
import {
  Box,
  Typography,
  Switch,
  FormControlLabel,
  Paper,
  useTheme,
  Radio,
  RadioGroup,
} from '@mui/material';
import {
  Brightness4,
  Brightness7,
  TextFields,
  Square,
  Circle,
  DensitySmall,
  DensityMedium,
  DensityLarge,
} from '@mui/icons-material';
import { useThemeMode } from '../../../context/ThemeContext';

const ThemeToggle = () => {
  // Move useThemeMode inside the component
  const { 
    mode, 
    colorScheme, 
    fontSize, 
    shape, 
    density,
    setThemeMode, 
    setColorScheme, 
    setFontSize, 
    setShape, 
    setDensity,
    resetTheme,
    getAvailableThemes,
    getAvailableColorSchemes,
    getAvailableFontSizes,
    getAvailableShapes,
    getAvailableDensities,
  } = useThemeMode();
  
  const theme = useTheme();

  // Define themes array INSIDE the component
  const themes = [
    { id: 'light', name: 'Light', icon: <Brightness7 />, color: '#f8fafc' },
    { id: 'dark', name: 'Dark', icon: <Brightness4 />, color: '#0f172a' },
  ];

  // Get color schemes from service and map them
  const colorSchemes = getAvailableColorSchemes().map(id => ({
    id,
    name: id.charAt(0).toUpperCase() + id.slice(1),
    primary: id === 'default' ? '#4f46e5' : 
             id === 'blue' ? '#3b82f6' : 
             id === 'purple' ? '#8b5cf6' : '#10b981',
    secondary: id === 'default' ? '#10b981' :
               id === 'blue' ? '#8b5cf6' :
               id === 'purple' ? '#ec4899' : '#f59e0b',
  }));

  // Define font sizes array
  const fontSizes = getAvailableFontSizes().map(id => ({
    id,
    name: id.charAt(0).toUpperCase() + id.slice(1),
    icon: id === 'small' ? <TextFields fontSize="small" /> :
          id === 'large' ? <TextFields fontSize="large" /> :
          <TextFields />,
  }));

  // Define shapes array
  const shapes = getAvailableShapes().map(id => ({
    id,
    name: id.charAt(0).toUpperCase() + id.slice(1),
    icon: id === 'rounded' ? <Circle /> : <Square />,
  }));

  // Define densities array
  const densities = getAvailableDensities().map(id => ({
    id,
    name: id.charAt(0).toUpperCase() + id.slice(1),
    icon: id === 'compact' ? <DensitySmall /> :
          id === 'spacious' ? <DensityLarge /> :
          <DensityMedium />,
  }));

  return (
    <Box>
      <Typography variant="h6" gutterBottom fontWeight={600}>
        Theme Settings
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Customize the appearance of your dashboard
      </Typography>

      {/* Theme Mode */}
      <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Typography variant="subtitle1" gutterBottom fontWeight={600}>
          Theme Mode
        </Typography>
        <RadioGroup 
          row 
          value={mode} 
          onChange={(e) => setThemeMode(e.target.value)}
          sx={{ justifyContent: 'space-around' }}
        >
          {themes.map((themeOption) => (
            <Paper
              key={themeOption.id}
              elevation={mode === themeOption.id ? 3 : 0}
              sx={{
                p: 2,
                borderRadius: 2,
                cursor: 'pointer',
                border: `2px solid ${mode === themeOption.id ? theme.palette.primary.main : 'transparent'}`,
                backgroundColor: mode === themeOption.id ? 'action.selected' : 'transparent',
                textAlign: 'center',
                flex: 1,
                mx: 0.5,
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              }}
              onClick={() => setThemeMode(themeOption.id)}
            >
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  margin: '0 auto 1rem',
                  background: themeOption.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: mode === themeOption.id ? 'primary.main' : 'text.secondary',
                }}
              >
                {themeOption.icon}
              </Box>
              <Typography variant="body2" fontWeight={600}>
                {themeOption.name}
              </Typography>
            </Paper>
          ))}
        </RadioGroup>
      </Paper>

      {/* Color Scheme */}
      <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Typography variant="subtitle1" gutterBottom fontWeight={600}>
          Color Scheme
        </Typography>
        <RadioGroup 
          row 
          value={colorScheme} 
          onChange={(e) => setColorScheme(e.target.value)}
          sx={{ justifyContent: 'space-around' }}
        >
          {colorSchemes.map((scheme) => (
            <Paper
              key={scheme.id}
              elevation={colorScheme === scheme.id ? 3 : 0}
              sx={{
                p: 2,
                borderRadius: 2,
                cursor: 'pointer',
                border: `2px solid ${colorScheme === scheme.id ? theme.palette.primary.main : 'transparent'}`,
                textAlign: 'center',
                flex: 1,
                mx: 0.5,
                '&:hover': {
                  borderColor: 'primary.main',
                },
              }}
              onClick={() => setColorScheme(scheme.id)}
            >
              <Box sx={{ display: 'flex', mb: 1 }}>
                <Box
                  sx={{
                    flex: 1,
                    height: 40,
                    backgroundColor: scheme.primary,
                    borderTopLeftRadius: 8,
                    borderBottomLeftRadius: 8,
                  }}
                />
                <Box
                  sx={{
                    flex: 1,
                    height: 40,
                    backgroundColor: scheme.secondary,
                    borderTopRightRadius: 8,
                    borderBottomRightRadius: 8,
                  }}
                />
              </Box>
              <Typography variant="caption" display="block">
                {scheme.name}
              </Typography>
            </Paper>
          ))}
        </RadioGroup>
      </Paper>

      {/* Font Size */}
      <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Typography variant="subtitle1" gutterBottom fontWeight={600}>
          Font Size
        </Typography>
        <RadioGroup 
          row 
          value={fontSize} 
          onChange={(e) => setFontSize(e.target.value)}
          sx={{ justifyContent: 'space-around' }}
        >
          {fontSizes.map((size) => (
            <Paper
              key={size.id}
              elevation={fontSize === size.id ? 3 : 0}
              sx={{
                p: 2,
                borderRadius: 2,
                cursor: 'pointer',
                border: `2px solid ${fontSize === size.id ? theme.palette.primary.main : 'transparent'}`,
                textAlign: 'center',
                flex: 1,
                mx: 0.5,
                '&:hover': {
                  borderColor: 'primary.main',
                },
              }}
              onClick={() => setFontSize(size.id)}
            >
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                {size.icon}
              </Box>
              <Typography variant="caption" display="block">
                {size.name}
              </Typography>
            </Paper>
          ))}
        </RadioGroup>
      </Paper>

      {/* Shape */}
      <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Typography variant="subtitle1" gutterBottom fontWeight={600}>
          Component Shape
        </Typography>
        <RadioGroup 
          row 
          value={shape} 
          onChange={(e) => setShape(e.target.value)}
          sx={{ justifyContent: 'space-around' }}
        >
          {shapes.map((s) => (
            <Paper
              key={s.id}
              elevation={shape === s.id ? 3 : 0}
              sx={{
                p: 2,
                borderRadius: 2,
                cursor: 'pointer',
                border: `2px solid ${shape === s.id ? theme.palette.primary.main : 'transparent'}`,
                textAlign: 'center',
                flex: 1,
                mx: 0.5,
                '&:hover': {
                  borderColor: 'primary.main',
                },
              }}
              onClick={() => setShape(s.id)}
            >
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                {s.icon}
              </Box>
              <Typography variant="caption" display="block">
                {s.name}
              </Typography>
            </Paper>
          ))}
        </RadioGroup>
      </Paper>

      {/* Density */}
      <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Typography variant="subtitle1" gutterBottom fontWeight={600}>
          Layout Density
        </Typography>
        <RadioGroup 
          row 
          value={density} 
          onChange={(e) => setDensity(e.target.value)}
          sx={{ justifyContent: 'space-around' }}
        >
          {densities.map((d) => (
            <Paper
              key={d.id}
              elevation={density === d.id ? 3 : 0}
              sx={{
                p: 2,
                borderRadius: 2,
                cursor: 'pointer',
                border: `2px solid ${density === d.id ? theme.palette.primary.main : 'transparent'}`,
                textAlign: 'center',
                flex: 1,
                mx: 0.5,
                '&:hover': {
                  borderColor: 'primary.main',
                },
              }}
              onClick={() => setDensity(d.id)}
            >
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                {d.icon}
              </Box>
              <Typography variant="caption" display="block">
                {d.name}
              </Typography>
            </Paper>
          ))}
        </RadioGroup>
      </Paper>

      {/* Additional Settings */}
      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="subtitle1" gutterBottom fontWeight={600}>
          Additional Settings
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <FormControlLabel
            control={<Switch defaultChecked />}
            label="High contrast mode"
          />
          <FormControlLabel
            control={<Switch defaultChecked />}
            label="Reduce animations"
          />
          <FormControlLabel
            control={<Switch />}
            label="Compact sidebar"
          />
          <FormControlLabel
            control={<Switch defaultChecked />}
            label="Show shadows"
          />
        </Box>
        
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Paper
            sx={{ 
              p: 1.5, 
              px: 3, 
              borderRadius: 2, 
              cursor: 'pointer',
              bgcolor: 'action.hover',
              '&:hover': { bgcolor: 'action.selected' }
            }}
            onClick={resetTheme}
          >
            <Typography variant="body2" fontWeight={600}>
              Reset to Default
            </Typography>
          </Paper>
        </Box>
      </Paper>
    </Box>
  );
};

export default ThemeToggle;