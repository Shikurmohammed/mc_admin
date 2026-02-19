import React, { useState } from 'react';
import { Container, Paper, TextField, Button, Typography, Box, Alert, InputAdornment, IconButton, Link, Grid, Divider, alpha, FormControlLabel, Checkbox } from '@mui/material';
import { Visibility, VisibilityOff, Email, Lock, Login, Google, Facebook, ShoppingBag, RememberMe } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const LoginPage = () => {
  const { t } = useTranslation();

  const [credentials, setCredentials] = useState({ email: '', password: '', rememberMe: false });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Remove the undefined rememberMe property
    const result = await login(credentials);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error || 'Login failed. Please check your credentials.');
    }
    setLoading(false);
  };



  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        background: (theme) => `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.background.default, 1)} 100%)`,
        py: { xs: 4, md: 0 }
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={{ xs: 4, md: 8 }} alignItems="center" justifyContent="center">

          {/* Left Side: Branding & Visuals (Hidden on small mobile if needed, or centered) */}
          <Grid item xs={12} md={6} sx={{ textAlign: { xs: 'center', md: 'left' } }}>
            <Box sx={{ display: 'inline-flex', p: 1.5, borderRadius: 3, bgcolor: 'primary.main', mb: 3 }}>
              <ShoppingBag sx={{ color: 'white', fontSize: 32 }} />
            </Box>
            <Typography
              variant="h2"
              fontWeight={800}
              color="text.primary"
              sx={{ fontSize: { xs: '2.5rem', md: '3.5rem' }, mb: 2, letterSpacing: '-0.02em' }}
            >
              The Artisans' <br />
              <Typography component="span" variant="inherit" color="primary">Marketplace</Typography>
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400, maxWidth: 450, mx: { xs: 'auto', md: 0 } }}>
              Connect with unique creators and manage your craft collection with ease.
            </Typography>
          </Grid>

          {/* Right Side: Login Card */}
          <Grid item xs={12} md={5} lg={4}>
            <Box
              sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Paper
                elevation={0}
                sx={{
                  width: 360, // reduced width
                  p: 3,
                  border: '1px solid',
                  borderColor: 'divider',
                  boxShadow: '0 15px 35px rgba(0,0,0,0.05)'
                }}
              >
                {/* Header */}
                <Box sx={{ mb: 2, textAlign: 'center' }}>
                  <Typography variant="h6" fontWeight={700}>
                    {t('auth.signIn')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('auth.welcomeBack')}
                  </Typography>
                </Box>

                {error && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                  </Alert>
                )}

                <form onSubmit={handleSubmit}>
                  {/* Wrapper to reduce input width */}
                  <Box sx={{ width: '100%', mx: 'auto' }}>
                    <TextField
                      fullWidth
                      size="small"
                      label={t('auth.email')}
                      margin="dense"
                      value={credentials.email}
                      onChange={(e) =>
                        setCredentials({ ...credentials, email: e.target.value })
                      }
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Email fontSize="small" />
                          </InputAdornment>
                        ),
                      }}
                    />

                    <TextField
                      fullWidth
                      size="small"
                      label={t('auth.password')}
                      type={showPassword ? 'text' : 'password'}
                      margin="dense"
                      value={credentials.password}
                      onChange={(e) =>
                        setCredentials({ ...credentials, password: e.target.value })
                      }
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock fontSize="small" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              size="small"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <VisibilityOff fontSize="small" />
                              ) : (
                                <Visibility fontSize="small" />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />

                    {/* Remember + Forgot */}
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mt: 1
                      }}
                    >
                      <FormControlLabel
                        control={
                          <Checkbox
                            size="small"
                            checked={credentials.rememberMe}
                            onChange={(e) =>
                              setCredentials({
                                ...credentials,
                                rememberMe: e.target.checked
                              })
                            }
                          />
                        }
                        label={<Typography variant="body2"> {t('auth.rememberMe')}</Typography>}
                      />

                      <Link
                        component={RouterLink}
                        to="/forgot-password"
                        variant="body2"
                      >
                        Forgot?
                      </Link>
                    </Box>

                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      size="medium"
                      disabled={loading}
                      sx={{
                        mt: 2,
                        py: 1,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 600
                      }}
                    >
                      {loading ? 'Signing in...' : 'Sign In'}
                    </Button>

                    <Typography
                      variant="body2"
                      align="center"
                      sx={{ mt: 2 }}
                    >
                      {t('auth.dontHaveAccount')}{' '}
                      <Link component={RouterLink} to="/register" fontWeight={600}>
                        {t('auth.register')}
                      </Link>
                    </Typography>
                  </Box>
                </form>
              </Paper>
            </Box>
          </Grid>


        </Grid>
      </Container>
    </Box>
  );
};

export default LoginPage;
