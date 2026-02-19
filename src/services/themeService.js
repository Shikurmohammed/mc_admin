import { createTheme } from '@mui/material/styles';

const themeService = {
  themes: {
    light: {
      palette: {
        mode: 'light',
        primary: { main: '#4f46e5', light: '#818cf8', dark: '#3730a3' },
        secondary: { main: '#10b981', light: '#34d399', dark: '#059669' },
        success: { main: '#10b981', light: '#34d399', dark: '#059669' },
        warning: { main: '#f59e0b', light: '#fbbf24', dark: '#d97706' },
        error: { main: '#ef4444', light: '#f87171', dark: '#dc2626' },
        info: { main: '#3b82f6', light: '#60a5fa', dark: '#2563eb' },
        background: { default: '#f8fafc', paper: '#ffffff' },
        text: { primary: '#0f172a', secondary: '#475569' },
        divider: '#e2e8f0',
      },
    },
    dark: {
      palette: {
        mode: 'dark',
        primary: { main: '#818cf8', light: '#a5b4fc', dark: '#6366f1' },
        secondary: { main: '#34d399', light: '#6ee7b7', dark: '#10b981' },
        success: { main: '#34d399', light: '#6ee7b7', dark: '#10b981' },
        warning: { main: '#fbbf24', light: '#fcd34d', dark: '#f59e0b' },
        error: { main: '#f87171', light: '#fca5a5', dark: '#ef4444' },
        info: { main: '#60a5fa', light: '#93c5fd', dark: '#3b82f6' },
        background: { default: '#0f172a', paper: '#1e293b' },
        text: { primary: '#f1f5f9', secondary: '#94a3b8' },
        divider: '#334155',
      },
    },
  },

  colorSchemes: {
    default: {
      primary: { main: '#4f46e5', light: '#818cf8', dark: '#3730a3' },
      secondary: { main: '#10b981', light: '#34d399', dark: '#059669' },
    },
    blue: {
      primary: { main: '#3b82f6', light: '#60a5fa', dark: '#2563eb' },
      secondary: { main: '#8b5cf6', light: '#a78bfa', dark: '#7c3aed' },
    },
    purple: {
      primary: { main: '#8b5cf6', light: '#a78bfa', dark: '#7c3aed' },
      secondary: { main: '#ec4899', light: '#f472b6', dark: '#db2777' },
    },
    green: {
      primary: { main: '#10b981', light: '#34d399', dark: '#059669' },
      secondary: { main: '#f59e0b', light: '#fbbf24', dark: '#d97706' },
    },
  },

  fontSizes: {
    small: {
      typography: {
        fontSize: 14,
        h1: { fontSize: '2rem' },
        h2: { fontSize: '1.75rem' },
        h3: { fontSize: '1.5rem' },
        h4: { fontSize: '1.25rem' },
        h5: { fontSize: '1.125rem' },
        h6: { fontSize: '1rem' },
      },
    },
    medium: {
      typography: {
        fontSize: 16,
        h1: { fontSize: '2.5rem' },
        h2: { fontSize: '2rem' },
        h3: { fontSize: '1.75rem' },
        h4: { fontSize: '1.5rem' },
        h5: { fontSize: '1.25rem' },
        h6: { fontSize: '1.125rem' },
      },
    },
    large: {
      typography: {
        fontSize: 18,
        h1: { fontSize: '3rem' },
        h2: { fontSize: '2.5rem' },
        h3: { fontSize: '2rem' },
        h4: { fontSize: '1.75rem' },
        h5: { fontSize: '1.5rem' },
        h6: { fontSize: '1.25rem' },
      },
    },
  },

  shapes: {
    rounded: {
      shape: { borderRadius: 12 },
      components: {
        MuiButton: { styleOverrides: { root: { borderRadius: 8 } } },
        MuiCard: { styleOverrides: { root: { borderRadius: 12 } } },
        MuiPaper: { styleOverrides: { root: { borderRadius: 12 } } },
      },
    },
    square: {
      shape: { borderRadius: 4 },
      components: {
        MuiButton: { styleOverrides: { root: { borderRadius: 4 } } },
        MuiCard: { styleOverrides: { root: { borderRadius: 4 } } },
        MuiPaper: { styleOverrides: { root: { borderRadius: 4 } } },
      },
    },
  },

  densities: {
    compact: {
      spacing: 8,
      components: {
        MuiButton: { styleOverrides: { root: { padding: '4px 12px', minHeight: 32 } } },
        MuiTextField: { styleOverrides: { root: { marginBottom: 8 } } },
        MuiListItem: { styleOverrides: { root: { paddingTop: 4, paddingBottom: 4 } } },
      },
    },
    comfortable: {
      spacing: 10,
      components: {
        MuiButton: { styleOverrides: { root: { padding: '6px 16px', minHeight: 36 } } },
        MuiTextField: { styleOverrides: { root: { marginBottom: 12 } } },
        MuiListItem: { styleOverrides: { root: { paddingTop: 6, paddingBottom: 6 } } },
      },
    },
    spacious: {
      spacing: 12,
      components: {
        MuiButton: { styleOverrides: { root: { padding: '8px 22px', minHeight: 40 } } },
        MuiTextField: { styleOverrides: { root: { marginBottom: 16 } } },
        MuiListItem: { styleOverrides: { root: { paddingTop: 8, paddingBottom: 8 } } },
      },
    },
  },

  getThemeConfig(mode = 'light', colorScheme = 'default', fontSize = 'medium', shape = 'rounded', density = 'comfortable') {
    // Start with base theme (light/dark)
    const baseTheme = this.themes[mode] || this.themes.light;

    // Get color scheme overrides
    const scheme = this.colorSchemes[colorScheme] || this.colorSchemes.default;

    // Create palette by merging base with color scheme
    const palette = {
      ...baseTheme.palette,
      primary: {
        ...baseTheme.palette.primary,
        ...scheme.primary,
      },
      secondary: {
        ...baseTheme.palette.secondary,
        ...scheme.secondary,
      },
    };

    const fontSizeConfig = this.fontSizes[fontSize] || this.fontSizes.medium;
    const shapeConfig = this.shapes[shape] || this.shapes.rounded;
    const densityConfig = this.densities[density] || this.densities.comfortable;

    // Build components object carefully
    const components = {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            scrollbarColor: `${palette.divider} transparent`,
            '&::-webkit-scrollbar, & *::-webkit-scrollbar': { width: 8, height: 8 },
            '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
              backgroundColor: palette.divider,
              borderRadius: 4,
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 600,
            ...shapeConfig.components.MuiButton?.styleOverrides?.root,
            ...densityConfig.components.MuiButton?.styleOverrides?.root,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow: mode === 'dark'
              ? '0 1px 3px 0 rgb(0 0 0 / 0.3), 0 1px 2px -1px rgb(0 0 0 / 0.3)'
              : '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
            ...shapeConfig.components.MuiCard?.styleOverrides?.root,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            ...shapeConfig.components.MuiPaper?.styleOverrides?.root,
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: { 
            ...densityConfig.components.MuiTextField?.styleOverrides?.root 
          },
        },
      },
      MuiListItem: {
        styleOverrides: {
          root: { 
            ...densityConfig.components.MuiListItem?.styleOverrides?.root 
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: 'background.paper',
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: 'background.paper',
            color: 'text.primary',
          },
        },
      },
      MuiTable: {
        styleOverrides: {
          root: {
            backgroundColor: 'background.paper',
          },
        },
      },
      MuiTableHead: {
        styleOverrides: {
          root: {
            backgroundColor: 'action.hover',
            '& .MuiTableCell-root': {
              color: 'text.primary',
              fontWeight: 600,
            },
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderBottom: '1px solid',
            borderColor: 'divider',
            color: 'text.primary',
          },
        },
      },
    };

    return {
      palette,
      typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        ...fontSizeConfig.typography,
      },
      shape: shapeConfig.shape,
      spacing: densityConfig.spacing,
      components,
    };
  },

  createTheme(config = {}) {
    const themeConfig = this.getThemeConfig(
      config.mode,
      config.colorScheme,
      config.fontSize,
      config.shape,
      config.density
    );
    return createTheme(themeConfig);
  },

  getAvailableThemes() { return Object.keys(this.themes); },
  getAvailableColorSchemes() { return Object.keys(this.colorSchemes); },
  getAvailableFontSizes() { return Object.keys(this.fontSizes); },
  getAvailableShapes() { return Object.keys(this.shapes); },
  getAvailableDensities() { return Object.keys(this.densities); },

  saveThemeSettings(settings) {
    localStorage.setItem('themeSettings', JSON.stringify(settings));
  },

  loadThemeSettings() {
    const saved = localStorage.getItem('themeSettings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse theme settings:', e);
      }
    }
    return {
      mode: 'light',
      colorScheme: 'default',
      fontSize: 'medium',
      shape: 'rounded',
      density: 'comfortable'
    };
  }
};

export default themeService;