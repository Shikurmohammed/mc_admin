import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  InputAdornment,
  IconButton,
  Link,
  Grid,
  Divider,
  alpha,
  Stepper,
  Step,
  StepLabel,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Checkbox,
  Tooltip,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Person,
  Phone,
  ShoppingBag,
  ArrowForward,
  ArrowBack,
  CheckCircle,
  Storefront,
  PersonAdd,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link as RouterLink } from 'react-router-dom';

const steps = ['Account Type', 'Personal Info', 'Complete'];

const RegisterPage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    accountType: 'customer',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    agreeToTerms: false,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 0:
        if (!formData.accountType) newErrors.accountType = 'Please select an account type';
        break;
      case 1:
        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!formData.email.trim()) {
          newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          newErrors.email = 'Please enter a valid email';
        }
        if (!formData.password) newErrors.password = 'Password is required';
        else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
        if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = 'Passwords do not match';
        }
        break;
      case 2:
        if (!formData.agreeToTerms) newErrors.agreeToTerms = 'You must agree to the terms';
        break;
      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      if (activeStep === steps.length - 1) {
        handleSubmit();
      } else {
        setActiveStep(prev => prev + 1);
      }
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        role: formData.accountType === 'artisan' ? 'ARTISAN' : 'CUSTOMER',
        phone: formData.phone || undefined,
      };

      const result = await register(userData);

      if (result.success) {
        setSuccess(true);
        setTimeout(() => navigate('/'), 2000);
      } else {
        setError(result.error || 'Registration failed.');
      }
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ mt: 2 }}>
            <FormControl component="fieldset" fullWidth>
              <FormLabel
                component="legend"
                sx={{
                  mb: 2,
                  fontWeight: 600,
                  color: 'text.primary',
                  fontSize: '0.875rem'
                }}
              >
                Choose Your Account Type
              </FormLabel>
              <RadioGroup
                name="accountType"
                value={formData.accountType}
                onChange={handleChange}
              >
                <Grid container spacing={2}>
                  {[
                    {
                      value: 'customer',
                      label: 'Customer',
                      icon: <ShoppingBag />,
                      desc: 'Browse and purchase handmade crafts'
                    },
                    {
                      value: 'artisan',
                      label: 'Artisan',
                      icon: <Storefront />,
                      desc: 'Sell your crafts and manage your shop'
                    }
                  ].map((type) => (
                    <Grid item xs={12} sm={6} key={type.value}>
                      <Paper
                        sx={{
                          p: 2,
                          border: '2px solid',
                          borderColor: formData.accountType === type.value
                            ? 'primary.main'
                            : 'divider',
                          borderRadius: 2,
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          bgcolor: formData.accountType === type.value
                            ? alpha('#4f46e5', 0.04)
                            : 'transparent',
                          '&:hover': {
                            borderColor: 'primary.main',
                            bgcolor: alpha('#4f46e5', 0.02),
                          },
                        }}
                        onClick={() => setFormData(prev => ({
                          ...prev,
                          accountType: type.value
                        }))}
                      >
                        <FormControlLabel
                          value={type.value}
                          control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: 20 } }} />}
                          label={
                            <Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                {type.icon}
                                <Typography variant="subtitle2" fontWeight={600}>
                                  {type.label}
                                </Typography>
                              </Box>
                              <Typography variant="caption" color="text.secondary">
                                {type.desc}
                              </Typography>
                            </Box>
                          }
                          sx={{
                            alignItems: 'flex-start',
                            m: 0,
                            '& .MuiFormControlLabel-label': { width: '100%' }
                          }}
                        />
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </RadioGroup>
              {errors.accountType && (
                <Typography color="error" variant="caption" sx={{ mt: 1, display: 'block' }}>
                  {errors.accountType}
                </Typography>
              )}
            </FormControl>
          </Box>
        );

      case 1:
        return (
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  error={!!errors.firstName}
                  helperText={errors.firstName}
                  disabled={loading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  error={!!errors.lastName}
                  helperText={errors.lastName}
                  disabled={loading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={!!errors.email}
                  helperText={errors.email}
                  disabled={loading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  label="Phone Number (Optional)"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={loading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  error={!!errors.password}
                  helperText={errors.password}
                  disabled={loading}
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
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Confirm Password"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword}
                  disabled={loading}
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
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
                            <VisibilityOff fontSize="small" />
                          ) : (
                            <Visibility fontSize="small" />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        );

      case 2:
        return (
          <Box sx={{ mt: 2 }}>
            {success ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Box
                  sx={{
                    display: 'inline-flex',
                    p: 2,
                    borderRadius: '50%',
                    bgcolor: 'success.main',
                    color: 'white',
                    mb: 2,
                  }}
                >
                  <CheckCircle sx={{ fontSize: 40 }} />
                </Box>
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  Registration Successful!
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 3 }}>
                  Your account has been created successfully.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Redirecting to dashboard...
                </Typography>
              </Box>
            ) : (
              <Box>
                <Typography
                  variant="subtitle2"
                  fontWeight={600}
                  gutterBottom
                  sx={{ fontSize: '0.875rem' }}
                >
                  Terms and Conditions
                </Typography>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    maxHeight: 150,
                    overflow: 'auto',
                    mb: 2,
                    bgcolor: 'background.default',
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="body2" color="text.secondary" paragraph>
                    By creating an account, you agree to our Terms of Service and Privacy Policy.
                    You will receive account-related emails. You can unsubscribe at any time.
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    For artisans: You agree to provide accurate information about your crafts
                    and maintain professional conduct with customers. All crafts must meet
                    our quality guidelines and authenticity standards.
                  </Typography>
                </Paper>

                <FormControlLabel
                  control={
                    <Checkbox
                      size="small"
                      checked={formData.agreeToTerms}
                      onChange={handleChange}
                      name="agreeToTerms"
                      sx={{ '& .MuiSvgIcon-root': { fontSize: 20 } }}
                    />
                  }
                  label={
                    <Typography variant="body2">
                      I agree to the{' '}
                      <Link component="span" sx={{ cursor: 'pointer' }}>
                        Terms and Conditions
                      </Link>{' '}
                      and{' '}
                      <Link component="span" sx={{ cursor: 'pointer' }}>
                        Privacy Policy
                      </Link>
                    </Typography>
                  }
                />
                {errors.agreeToTerms && (
                  <Typography color="error" variant="caption" sx={{ mt: 1, display: 'block' }}>
                    {errors.agreeToTerms}
                  </Typography>
                )}
              </Box>
            )}
          </Box>
        );
      default:
        return null;
    }
  };
  const handleNavigate = async (path) => {
    navigate(path);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        minHeight: '100vh',
        background: (theme) =>
          `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, 
          ${alpha(theme.palette.background.default, 1)} 100%)`,
        py: { xs: 4, md: 0 }
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={{ xs: 4, md: 8 }} alignItems="center" justifyContent="center">

          {/* Left Side: Branding */}
          <Grid item xs={12} md={6} sx={{ textAlign: { xs: 'center', md: 'left' } }}>
            <Box sx={{ display: 'inline-flex', p: 1.5, borderRadius: 3, bgcolor: 'primary.main', mb: 3 }}>
              <Tooltip title="Go to Home" placement="top">
                <ShoppingBag sx={{ color: 'white', fontSize: 32 }} onClick={() => handleNavigate('/')} />
              </Tooltip>
            </Box>
            <Typography variant="h6" fontWeight={700} color="white" sx={{ ml: 1, cursor: 'pointer' }} onClick={() => handleNavigate('/')}>
              Go to Home
            </Typography>
            <Divider sx={{ my: 2 }}></Divider>
            <Typography
              variant="h2"
              fontWeight={800}
              color="text.primary"
              sx={{ fontSize: { xs: '2.5rem', md: '3.5rem' }, mb: 2, letterSpacing: '-0.02em' }}
            >
              Join The <br />
              <Typography component="span" variant="inherit" color="primary">
                Artisans' Community
              </Typography>
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{
                fontWeight: 400,
                maxWidth: 450,
                mx: { xs: 'auto', md: 0 }
              }}
            >
              {formData.accountType === 'artisan'
                ? 'Showcase your crafts and connect with buyers worldwide.'
                : 'Discover unique handmade creations from talented artisans.'}
            </Typography>

          </Grid>


          {/* Right Side: Registration Card */}
          <Grid item xs={12} md={5} lg={4}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Paper
                elevation={0}
                sx={{
                  width: 400,
                  p: 3,
                  border: '1px solid',
                  borderColor: 'divider',
                  boxShadow: '0 15px 35px rgba(0,0,0,0.05)',
                  borderRadius: 2,
                }}
              >
                {/* Header */}
                <Box sx={{ mb: 2, textAlign: 'center' }}>
                  <Typography variant="h6" fontWeight={700}>
                    Create Account
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {activeStep === 0 && "Select your account type"}
                    {activeStep === 1 && "Tell us about yourself"}
                    {activeStep === 2 && "Almost there!"}
                  </Typography>
                </Box>

                {/* Stepper */}
                <Stepper
                  activeStep={activeStep}
                  sx={{
                    mb: 3,
                    '& .MuiStepLabel-label': {
                      fontSize: '0.75rem',
                      mt: 0.5
                    },
                    '& .MuiStepIcon-root': {
                      width: 20,
                      height: 20
                    }
                  }}
                >
                  {steps.map(label => (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>

                {error && !success && (
                  <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
                    {error}
                  </Alert>
                )}

                {renderStepContent(activeStep)}

                {!success && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                    <Button
                      size="small"
                      disabled={activeStep === 0 || loading}
                      onClick={handleBack}
                      startIcon={<ArrowBack fontSize="small" />}
                      sx={{ textTransform: 'none' }}
                    >
                      Back
                    </Button>
                    <Button
                      size="small"
                      variant="contained"
                      onClick={handleNext}
                      disabled={loading}
                      endIcon={
                        activeStep === steps.length - 1
                          ? <CheckCircle fontSize="small" />
                          : <ArrowForward fontSize="small" />
                      }
                      sx={{ textTransform: 'none' }}
                    >
                      {activeStep === steps.length - 1 ? 'Complete' : 'Continue'}
                    </Button>
                  </Box>
                )}

                <Divider sx={{ my: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    Already have an account?
                  </Typography>
                </Divider>

                <Box sx={{ textAlign: 'center' }}>
                  <Button
                    component={RouterLink}
                    to="/login"
                    size="small"
                    variant="outlined"
                    startIcon={<PersonAdd fontSize="small" />}
                    sx={{ textTransform: 'none' }}
                  >
                    Sign In Instead
                  </Button>
                </Box>
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default RegisterPage;