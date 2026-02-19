import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Tabs,
  Tab,
  Paper,
  Typography,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Alert,
  Snackbar,
  Divider,
  Grid,
  Avatar,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Slider,
  RadioGroup,
  Radio,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  Badge,
  Tooltip,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Person,
  Notifications,
  Security,
  Palette,
  Language,
  Upload,
  Save,
  Visibility,
  VisibilityOff,
  Delete,
  CheckCircle,
  Warning,
  Email,
  Phone,
  LocationOn,
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  GitHub,
  DarkMode,
  LightMode,
  Computer,
  Translate,
  Lock,
  Fingerprint,
  History,
  NotificationsActive,
  NotificationsOff,
  VolumeUp,
  VolumeOff,
  CreditCard,
  Payment,
  Receipt,
  Logout,
  Help,
  Info,
} from '@mui/icons-material';
import PageHeader from '../components/common/PageHeader';
import { useAuth } from '../context/AuthContext';
import { useThemeMode } from '../context/ThemeContext';
import { useLanguage, languages } from '../context/LanguageContext'
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const SettingsPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user, updateProfile, uploadAvatar, logout } = useAuth();
  const { mode, setThemeMode, toggleTheme } = useThemeMode();
  const { language, changeLanguage, languages: availableLanguages } = useLanguage();
  const { t, i18n } = useTranslation();
  
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar);
  const [confirmDialog, setConfirmDialog] = useState({ open: false, action: null });
  const [passwordDialog, setPasswordDialog] = useState(false);
  const [deleteAccountDialog, setDeleteAccountDialog] = useState(false);
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
    address: user?.address || '',
    city: user?.city || '',
    state: user?.state || '',
    zipCode: user?.zipCode || '',
    country: user?.country || '',
    socialLinks: {
      facebook: user?.socialLinks?.facebook || '',
      twitter: user?.socialLinks?.twitter || '',
      instagram: user?.socialLinks?.instagram || '',
      linkedin: user?.socialLinks?.linkedin || '',
    },
  });

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState(() => {
    const saved = localStorage.getItem('notificationSettings');
    return saved ? JSON.parse(saved) : {
      emailNotifications: true,
      pushNotifications: true,
      orderUpdates: true,
      newMessages: true,
      promotions: false,
      newsletter: true,
      reviewResponses: true,
      priceAlerts: false,
      weeklyDigest: true,
      soundEnabled: true,
      desktopNotifications: false,
      notificationFrequency: 'instant', // instant, daily, weekly
    };
  });

  // Security settings
  const [securitySettings, setSecuritySettings] = useState(() => {
    const saved = localStorage.getItem('securitySettings');
    return saved ? JSON.parse(saved) : {
      twoFactorAuth: false,
      loginAlerts: true,
      saveLoginHistory: true,
      sessionTimeout: 30, // minutes
      requirePasswordOnPurchase: true,
      showOnlineStatus: true,
      publicProfile: false,
    };
  });

  // Appearance settings
  const [appearanceSettings, setAppearanceSettings] = useState(() => {
    const saved = localStorage.getItem('appearanceSettings');
    return saved ? JSON.parse(saved) : {
      theme: mode,
      compactMode: false,
      fontSize: 'medium', // small, medium, large
      animations: true,
      reducedMotion: false,
      highContrast: false,
      colorScheme: 'default',
    };
  });

  // Preferences
  const [preferences, setPreferences] = useState(() => {
    const saved = localStorage.getItem('userPreferences');
    return saved ? JSON.parse(saved) : {
      currency: 'ETB',
      timezone: 'Africa/Addis_Ababa',
      dateFormat: 'MM/DD/YYYY',
      measurementSystem: 'metric', // metric or imperial
      language: language,
    };
  });

  // Password change form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [passwordErrors, setPasswordErrors] = useState({});

  // Login history (mock data)
  const [loginHistory] = useState([
    {
      id: 1,
      device: 'Chrome on Windows',
      location: 'Addis Ababa, Ethiopia',
      ip: '196.188.123.45',
      time: '2024-02-19T10:30:00',
      successful: true,
    },
    {
      id: 2,
      device: 'Safari on iPhone',
      location: 'Addis Ababa, Ethiopia',
      ip: '196.188.67.89',
      time: '2024-02-18T22:15:00',
      successful: true,
    },
    {
      id: 3,
      device: 'Firefox on Linux',
      location: 'Unknown location',
      ip: '45.67.89.123',
      time: '2024-02-17T14:20:00',
      successful: false,
    },
  ]);

  const tabs = [
    { label: t('settings.profile'), icon: <Person /> },
    { label: t('settings.notifications'), icon: <Notifications /> },
    { label: t('settings.security'), icon: <Security /> },
    { label: t('settings.appearance'), icon: <Palette /> },
    { label: t('settings.preferences'), icon: <SettingsIcon /> },
  ];

  useEffect(() => {
    // Save settings to localStorage when they change
    localStorage.setItem('notificationSettings', JSON.stringify(notificationSettings));
    localStorage.setItem('securitySettings', JSON.stringify(securitySettings));
    localStorage.setItem('appearanceSettings', JSON.stringify(appearanceSettings));
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
  }, [notificationSettings, securitySettings, appearanceSettings, preferences]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSocialLinkChange = (platform) => (e) => {
    setProfileForm(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: e.target.value,
      },
    }));
  };

  const handleNotificationChange = (setting) => (e) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: e.target.checked,
    }));
  };

  const handleSecurityChange = (setting) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setSecuritySettings(prev => ({
      ...prev,
      [setting]: value,
    }));
  };

  const handleAppearanceChange = (setting) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setAppearanceSettings(prev => ({
      ...prev,
      [setting]: value,
    }));
    
    // Apply theme changes immediately
    if (setting === 'theme') {
      setThemeMode(value);
    }
  };

  const handlePreferenceChange = (setting) => (e) => {
    const value = e.target.value;
    setPreferences(prev => ({
      ...prev,
      [setting]: value,
    }));

    // Apply language change immediately
    if (setting === 'language') {
      i18n.changeLanguage(value);
      changeLanguage(value);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('File must be an image');
      return;
    }

    // Preview image
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Upload to server
    setLoading(true);
    try {
      const result = await uploadAvatar(file);
      if (result.success) {
        setSuccess('Avatar updated successfully');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to upload avatar');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await updateProfile(profileForm);
      if (result.success) {
        setSuccess('Profile updated successfully');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const validatePassword = () => {
    const errors = {};
    
    if (!passwordForm.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }
    
    if (!passwordForm.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (passwordForm.newPassword.length < 6) {
      errors.newPassword = 'Password must be at least 6 characters';
    }
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    return errors;
  };

  const handleChangePassword = async () => {
    const errors = validatePassword();
    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      // API call to change password
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      setSuccess('Password changed successfully');
      setPasswordDialog(false);
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err) {
      setError('Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    try {
      // API call to delete account
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      await logout();
      navigate('/');
    } catch (err) {
      setError('Failed to delete account');
      setLoading(false);
    }
  };

  const handleLogoutAllDevices = async () => {
    setLoading(true);
    try {
      // API call to logout from all devices
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      setSuccess('Logged out from all other devices');
    } catch (err) {
      setError('Failed to logout from other devices');
    } finally {
      setLoading(false);
      setConfirmDialog({ open: false, action: null });
    }
  };

  const renderProfileTab = () => (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom fontWeight={600}>
        {t('settings.profileInformation')}
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        {t('settings.profileDescription')}
      </Typography>

      {/* Avatar Upload */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          badgeContent={
            <Tooltip title="Upload new photo">
              <IconButton
                size="small"
                component="label"
                htmlFor="avatar-upload"
                sx={{
                  bgcolor: 'primary.main',
                  color: 'white',
                  '&:hover': { bgcolor: 'primary.dark' },
                }}
              >
                <Upload fontSize="small" />
              </IconButton>
            </Tooltip>
          }
        >
          <Avatar
            src={avatarPreview}
            sx={{ width: 100, height: 100 }}
          >
            {user?.firstName?.charAt(0)}
          </Avatar>
        </Badge>
        <Box>
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="avatar-upload"
            type="file"
            onChange={handleAvatarUpload}
            disabled={loading}
          />
          <Typography variant="body2" fontWeight={500}>
            {t('settings.profilePhoto')}
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block">
            {t('settings.photoRequirements')}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Profile Form */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label={t('auth.firstName')}
            name="firstName"
            value={profileForm.firstName}
            onChange={handleProfileChange}
            disabled={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label={t('auth.lastName')}
            name="lastName"
            value={profileForm.lastName}
            onChange={handleProfileChange}
            disabled={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label={t('auth.email')}
            name="email"
            type="email"
            value={profileForm.email}
            onChange={handleProfileChange}
            disabled={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label={t('auth.phone')}
            name="phone"
            value={profileForm.phone}
            onChange={handleProfileChange}
            disabled={loading}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label={t('profile.bio')}
            name="bio"
            value={profileForm.bio}
            onChange={handleProfileChange}
            multiline
            rows={4}
            disabled={loading}
            placeholder={t('profile.bioPlaceholder')}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            {t('profile.address')}
          </Typography>
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            fullWidth
            label={t('profile.streetAddress')}
            name="address"
            value={profileForm.address}
            onChange={handleProfileChange}
            size="small"
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label={t('profile.city')}
            name="city"
            value={profileForm.city}
            onChange={handleProfileChange}
            size="small"
          />
        </Grid>
        
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            label={t('profile.state')}
            name="state"
            value={profileForm.state}
            onChange={handleProfileChange}
            size="small"
          />
        </Grid>
        
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            label={t('profile.zipCode')}
            name="zipCode"
            value={profileForm.zipCode}
            onChange={handleProfileChange}
            size="small"
          />
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            fullWidth
            label={t('profile.country')}
            name="country"
            value={profileForm.country}
            onChange={handleProfileChange}
            size="small"
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle2" fontWeight={600} gutterBottom sx={{ mt: 2 }}>
            {t('profile.socialLinks')}
          </Typography>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Facebook"
            value={profileForm.socialLinks.facebook}
            onChange={handleSocialLinkChange('facebook')}
            size="small"
            InputProps={{
              startAdornment: <Facebook sx={{ mr: 1, fontSize: 20, color: '#1877f2' }} />,
            }}
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Twitter"
            value={profileForm.socialLinks.twitter}
            onChange={handleSocialLinkChange('twitter')}
            size="small"
            InputProps={{
              startAdornment: <Twitter sx={{ mr: 1, fontSize: 20, color: '#1da1f2' }} />,
            }}
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Instagram"
            value={profileForm.socialLinks.instagram}
            onChange={handleSocialLinkChange('instagram')}
            size="small"
            InputProps={{
              startAdornment: <Instagram sx={{ mr: 1, fontSize: 20, color: '#e4405f' }} />,
            }}
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="LinkedIn"
            value={profileForm.socialLinks.linkedin}
            onChange={handleSocialLinkChange('linkedin')}
            size="small"
            InputProps={{
              startAdornment: <LinkedIn sx={{ mr: 1, fontSize: 20, color: '#0077b5' }} />,
            }}
          />
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
        <Button
          variant="contained"
          startIcon={<Save />}
          onClick={handleSaveProfile}
          disabled={loading}
        >
          {loading ? t('common.saving') : t('common.saveChanges')}
        </Button>
      </Box>
    </Paper>
  );

  const renderNotificationsTab = () => (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom fontWeight={600}>
        {t('settings.notificationPreferences')}
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        {t('settings.notificationDescription')}
      </Typography>

      <Divider sx={{ my: 3 }} />

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            {t('settings.notificationChannels')}
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4 }}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Email color="primary" />
                  <Box>
                    <Typography variant="body2" fontWeight={500}>
                      {t('settings.emailNotifications')}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {t('settings.emailNotificationsDesc')}
                    </Typography>
                  </Box>
                </Box>
                <Switch
                  checked={notificationSettings.emailNotifications}
                  onChange={handleNotificationChange('emailNotifications')}
                />
              </Box>
            </Paper>

            <Paper variant="outlined" sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <NotificationsActive color="primary" />
                  <Box>
                    <Typography variant="body2" fontWeight={500}>
                      {t('settings.pushNotifications')}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {t('settings.pushNotificationsDesc')}
                    </Typography>
                  </Box>
                </Box>
                <Switch
                  checked={notificationSettings.pushNotifications}
                  onChange={handleNotificationChange('pushNotifications')}
                />
              </Box>
            </Paper>

            <Paper variant="outlined" sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  {notificationSettings.soundEnabled ? (
                    <VolumeUp color="primary" />
                  ) : (
                    <VolumeOff color="action" />
                  )}
                  <Box>
                    <Typography variant="body2" fontWeight={500}>
                      {t('settings.soundEnabled')}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {t('settings.soundEnabledDesc')}
                    </Typography>
                  </Box>
                </Box>
                <Switch
                  checked={notificationSettings.soundEnabled}
                  onChange={handleNotificationChange('soundEnabled')}
                />
              </Box>
            </Paper>

            <Paper variant="outlined" sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Computer color="primary" />
                  <Box>
                    <Typography variant="body2" fontWeight={500}>
                      {t('settings.desktopNotifications')}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {t('settings.desktopNotificationsDesc')}
                    </Typography>
                  </Box>
                </Box>
                <Switch
                  checked={notificationSettings.desktopNotifications}
                  onChange={handleNotificationChange('desktopNotifications')}
                />
              </Box>
            </Paper>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            {t('settings.notificationTypes')}
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={notificationSettings.orderUpdates}
                  onChange={handleNotificationChange('orderUpdates')}
                />
              }
              label={
                <Box>
                  <Typography variant="body2">{t('settings.orderUpdates')}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {t('settings.orderUpdatesDesc')}
                  </Typography>
                </Box>
              }
              sx={{ alignItems: 'flex-start' }}
            />

            <FormControlLabel
              control={
                <Switch
                  checked={notificationSettings.newMessages}
                  onChange={handleNotificationChange('newMessages')}
                />
              }
              label={
                <Box>
                  <Typography variant="body2">{t('settings.newMessages')}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {t('settings.newMessagesDesc')}
                  </Typography>
                </Box>
              }
              sx={{ alignItems: 'flex-start' }}
            />

            <FormControlLabel
              control={
                <Switch
                  checked={notificationSettings.reviewResponses}
                  onChange={handleNotificationChange('reviewResponses')}
                />
              }
              label={
                <Box>
                  <Typography variant="body2">{t('settings.reviewResponses')}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {t('settings.reviewResponsesDesc')}
                  </Typography>
                </Box>
              }
              sx={{ alignItems: 'flex-start' }}
            />

            <FormControlLabel
              control={
                <Switch
                  checked={notificationSettings.priceAlerts}
                  onChange={handleNotificationChange('priceAlerts')}
                />
              }
              label={
                <Box>
                  <Typography variant="body2">{t('settings.priceAlerts')}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {t('settings.priceAlertsDesc')}
                  </Typography>
                </Box>
              }
              sx={{ alignItems: 'flex-start' }}
            />

            <FormControlLabel
              control={
                <Switch
                  checked={notificationSettings.promotions}
                  onChange={handleNotificationChange('promotions')}
                />
              }
              label={
                <Box>
                  <Typography variant="body2">{t('settings.promotions')}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {t('settings.promotionsDesc')}
                  </Typography>
                </Box>
              }
              sx={{ alignItems: 'flex-start' }}
            />

            <FormControlLabel
              control={
                <Switch
                  checked={notificationSettings.weeklyDigest}
                  onChange={handleNotificationChange('weeklyDigest')}
                />
              }
              label={
                <Box>
                  <Typography variant="body2">{t('settings.weeklyDigest')}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {t('settings.weeklyDigestDesc')}
                  </Typography>
                </Box>
              }
              sx={{ alignItems: 'flex-start' }}
            />
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Divider sx={{ my: 2 }} />
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Typography variant="body2" color="text.secondary">
              {t('settings.notificationFrequency')}:
            </Typography>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <Select
                value={notificationSettings.notificationFrequency}
                onChange={(e) => setNotificationSettings(prev => ({
                  ...prev,
                  notificationFrequency: e.target.value
                }))}
              >
                <MenuItem value="instant">{t('settings.instant')}</MenuItem>
                <MenuItem value="daily">{t('settings.daily')}</MenuItem>
                <MenuItem value="weekly">{t('settings.weekly')}</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
        <Button
          variant="contained"
          startIcon={<Save />}
          onClick={() => setSuccess(t('settings.notificationsSaved'))}
        >
          {t('common.saveSettings')}
        </Button>
      </Box>
    </Paper>
  );

  const renderSecurityTab = () => (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom fontWeight={600}>
        {t('settings.securitySettings')}
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        {t('settings.securityDescription')}
      </Typography>

      <Divider sx={{ my: 3 }} />

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            {t('settings.authentication')}
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4 }}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="body2" fontWeight={500}>
                    {t('settings.twoFactorAuth')}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {t('settings.twoFactorAuthDesc')}
                  </Typography>
                </Box>
                <Switch
                  checked={securitySettings.twoFactorAuth}
                  onChange={handleSecurityChange('twoFactorAuth')}
                />
              </Box>
            </Paper>

            <Paper variant="outlined" sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="body2" fontWeight={500}>
                    {t('settings.loginAlerts')}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {t('settings.loginAlertsDesc')}
                  </Typography>
                </Box>
                <Switch
                  checked={securitySettings.loginAlerts}
                  onChange={handleSecurityChange('loginAlerts')}
                />
              </Box>
            </Paper>

            <Paper variant="outlined" sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="body2" fontWeight={500}>
                    {t('settings.showOnlineStatus')}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {t('settings.showOnlineStatusDesc')}
                  </Typography>
                </Box>
                <Switch
                  checked={securitySettings.showOnlineStatus}
                  onChange={handleSecurityChange('showOnlineStatus')}
                />
              </Box>
            </Paper>

            <Paper variant="outlined" sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="body2" fontWeight={500}>
                    {t('settings.publicProfile')}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {t('settings.publicProfileDesc')}
                  </Typography>
                </Box>
                <Switch
                  checked={securitySettings.publicProfile}
                  onChange={handleSecurityChange('publicProfile')}
                />
              </Box>
            </Paper>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            {t('settings.session')}
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4 }}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="body2" fontWeight={500}>
                    {t('settings.sessionTimeout')}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {t('settings.sessionTimeoutDesc')}
                  </Typography>
                </Box>
                <FormControl size="small" sx={{ minWidth: 100 }}>
                  <Select
                    value={securitySettings.sessionTimeout}
                    onChange={handleSecurityChange('sessionTimeout')}
                  >
                    <MenuItem value={15}>15 {t('common.minutes')}</MenuItem>
                    <MenuItem value={30}>30 {t('common.minutes')}</MenuItem>
                    <MenuItem value={60}>1 {t('common.hour')}</MenuItem>
                    <MenuItem value={120}>2 {t('common.hours')}</MenuItem>
                    <MenuItem value={240}>4 {t('common.hours')}</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Paper>

            <Paper variant="outlined" sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="body2" fontWeight={500}>
                    {t('settings.requirePasswordOnPurchase')}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {t('settings.requirePasswordOnPurchaseDesc')}
                  </Typography>
                </Box>
                <Switch
                  checked={securitySettings.requirePasswordOnPurchase}
                  onChange={handleSecurityChange('requirePasswordOnPurchase')}
                />
              </Box>
            </Paper>

            <Paper variant="outlined" sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="body2" fontWeight={500}>
                    {t('settings.saveLoginHistory')}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {t('settings.saveLoginHistoryDesc')}
                  </Typography>
                </Box>
                <Switch
                  checked={securitySettings.saveLoginHistory}
                  onChange={handleSecurityChange('saveLoginHistory')}
                />
              </Box>
            </Paper>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            {t('settings.password')}
          </Typography>
          
          <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="body2" fontWeight={500}>
                  {t('settings.changePassword')}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {t('settings.changePasswordDesc')}
                </Typography>
              </Box>
              <Button
                variant="outlined"
                onClick={() => setPasswordDialog(true)}
                startIcon={<Lock />}
              >
                {t('settings.changePassword')}
              </Button>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            {t('settings.loginHistory')}
          </Typography>
          
          <Paper variant="outlined">
            <List>
              {loginHistory.map((entry, index) => (
                <React.Fragment key={entry.id}>
                  {index > 0 && <Divider />}
                  <ListItem>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {entry.successful ? (
                            <CheckCircle color="success" fontSize="small" />
                          ) : (
                            <Warning color="error" fontSize="small" />
                          )}
                          <Typography variant="body2" fontWeight={500}>
                            {entry.device}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <>
                          <Typography variant="caption" display="block">
                            {entry.location} • IP: {entry.ip}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(entry.time).toLocaleString()}
                          </Typography>
                        </>
                      }
                    />
                    <ListItemSecondaryAction>
                      {!entry.successful && (
                        <Button size="small" color="error">
                          {t('common.report')}
                        </Button>
                      )}
                    </ListItemSecondaryAction>
                  </ListItem>
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
            <Button
              variant="outlined"
              color="warning"
              startIcon={<Logout />}
              onClick={() => setConfirmDialog({
                open: true,
                action: 'logoutAll',
                title: t('settings.logoutAllDevices'),
                message: t('settings.logoutAllDevicesConfirm'),
              })}
            >
              {t('settings.logoutAllDevices')}
            </Button>
            
            <Button
              variant="outlined"
              color="error"
              startIcon={<Delete />}
              onClick={() => setDeleteAccountDialog(true)}
            >
              {t('settings.deleteAccount')}
            </Button>
            
            <Button
              variant="contained"
              startIcon={<Save />}
              onClick={() => setSuccess(t('settings.securitySaved'))}
            >
              {t('common.saveSettings')}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );

  const renderAppearanceTab = () => (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom fontWeight={600}>
        {t('settings.appearanceSettings')}
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        {t('settings.appearanceDescription')}
      </Typography>

      <Divider sx={{ my: 3 }} />

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            {t('settings.theme')}
          </Typography>
          
          <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
            <RadioGroup
              value={appearanceSettings.theme}
              onChange={handleAppearanceChange('theme')}
            >
              <FormControlLabel
                value="light"
                control={<Radio />}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <LightMode color="warning" />
                    <Box>
                      <Typography variant="body2">{t('settings.lightMode')}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {t('settings.lightModeDesc')}
                      </Typography>
                    </Box>
                  </Box>
                }
              />
              <FormControlLabel
                value="dark"
                control={<Radio />}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <DarkMode color="primary" />
                    <Box>
                      <Typography variant="body2">{t('settings.darkMode')}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {t('settings.darkModeDesc')}
                      </Typography>
                    </Box>
                  </Box>
                }
              />
              <FormControlLabel
                value="system"
                control={<Radio />}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Computer color="action" />
                    <Box>
                      <Typography variant="body2">{t('settings.systemDefault')}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {t('settings.systemDefaultDesc')}
                      </Typography>
                    </Box>
                  </Box>
                }
              />
            </RadioGroup>
          </Paper>

          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            {t('settings.colorScheme')}
          </Typography>
          
          <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              {['default', 'blue', 'purple', 'green', 'orange', 'red'].map((scheme) => (
                <Tooltip key={scheme} title={t(`settings.colors.${scheme}`)}>
                  <Box
                    onClick={() => handleAppearanceChange('colorScheme')({ target: { value: scheme } })}
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      cursor: 'pointer',
                      border: appearanceSettings.colorScheme === scheme ? '3px solid' : 'none',
                      borderColor: 'primary.main',
                      bgcolor: scheme === 'default' ? '#4f46e5' :
                               scheme === 'blue' ? '#3b82f6' :
                               scheme === 'purple' ? '#8b5cf6' :
                               scheme === 'green' ? '#10b981' :
                               scheme === 'orange' ? '#f59e0b' : '#ef4444',
                    }}
                  />
                </Tooltip>
              ))}
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            {t('settings.fontSize')}
          </Typography>
          
          <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
            <RadioGroup
              value={appearanceSettings.fontSize}
              onChange={handleAppearanceChange('fontSize')}
            >
              <FormControlLabel
                value="small"
                control={<Radio />}
                label={
                  <Box>
                    <Typography variant="body2">{t('settings.small')}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {t('settings.smallDesc')}
                    </Typography>
                  </Box>
                }
              />
              <FormControlLabel
                value="medium"
                control={<Radio />}
                label={
                  <Box>
                    <Typography variant="body2">{t('settings.medium')}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {t('settings.mediumDesc')}
                    </Typography>
                  </Box>
                }
              />
              <FormControlLabel
                value="large"
                control={<Radio />}
                label={
                  <Box>
                    <Typography variant="body2">{t('settings.large')}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {t('settings.largeDesc')}
                    </Typography>
                  </Box>
                }
              />
            </RadioGroup>
          </Paper>

          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            {t('settings.accessibility')}
          </Typography>
          
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={appearanceSettings.compactMode}
                    onChange={handleAppearanceChange('compactMode')}
                  />
                }
                label={
                  <Box>
                    <Typography variant="body2">{t('settings.compactMode')}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {t('settings.compactModeDesc')}
                    </Typography>
                  </Box>
                }
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={appearanceSettings.animations}
                    onChange={handleAppearanceChange('animations')}
                  />
                }
                label={
                  <Box>
                    <Typography variant="body2">{t('settings.animations')}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {t('settings.animationsDesc')}
                    </Typography>
                  </Box>
                }
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={appearanceSettings.reducedMotion}
                    onChange={handleAppearanceChange('reducedMotion')}
                  />
                }
                label={
                  <Box>
                    <Typography variant="body2">{t('settings.reducedMotion')}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {t('settings.reducedMotionDesc')}
                    </Typography>
                  </Box>
                }
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={appearanceSettings.highContrast}
                    onChange={handleAppearanceChange('highContrast')}
                  />
                }
                label={
                  <Box>
                    <Typography variant="body2">{t('settings.highContrast')}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {t('settings.highContrastDesc')}
                    </Typography>
                  </Box>
                }
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
        <Button
          variant="contained"
          startIcon={<Save />}
          onClick={() => setSuccess(t('settings.appearanceSaved'))}
        >
          {t('common.saveSettings')}
        </Button>
      </Box>
    </Paper>
  );

  const renderPreferencesTab = () => (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom fontWeight={600}>
        {t('settings.preferences')}
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        {t('settings.preferencesDescription')}
      </Typography>

      <Divider sx={{ my: 3 }} />

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            {t('settings.language')}
          </Typography>
          
          <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Translate color="primary" />
              <FormControl fullWidth size="small">
                <Select
                  value={preferences.language}
                  onChange={handlePreferenceChange('language')}
                >
                  {Object.values(availableLanguages).map((lang) => (
                    <MenuItem key={lang.code} value={lang.code}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <span>{lang.flag}</span>
                        <Typography variant="body2">{lang.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          ({lang.nativeName})
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Paper>

          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            {t('settings.currency')}
          </Typography>
          
          <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Payment color="primary" />
              <FormControl fullWidth size="small">
                <Select
                  value={preferences.currency}
                  onChange={handlePreferenceChange('currency')}
                >
                  <MenuItem value="ETB">ETB - Ethiopian Birr</MenuItem>
                  <MenuItem value="USD">USD - US Dollar</MenuItem>
                  <MenuItem value="EUR">EUR - Euro</MenuItem>
                  <MenuItem value="GBP">GBP - British Pound</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            {t('settings.timezone')}
          </Typography>
          
          <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <History color="primary" />
              <FormControl fullWidth size="small">
                <Select
                  value={preferences.timezone}
                  onChange={handlePreferenceChange('timezone')}
                >
                  <MenuItem value="Africa/Addis_Ababa">Addis Ababa (GMT+3)</MenuItem>
                  <MenuItem value="Africa/Nairobi">Nairobi (GMT+3)</MenuItem>
                  <MenuItem value="Africa/Cairo">Cairo (GMT+2)</MenuItem>
                  <MenuItem value="Europe/London">London (GMT+0)</MenuItem>
                  <MenuItem value="America/New_York">New York (GMT-5)</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Paper>

          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            {t('settings.dateFormat')}
          </Typography>
          
          <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Receipt color="primary" />
              <FormControl fullWidth size="small">
                <Select
                  value={preferences.dateFormat}
                  onChange={handlePreferenceChange('dateFormat')}
                >
                  <MenuItem value="MM/DD/YYYY">MM/DD/YYYY</MenuItem>
                  <MenuItem value="DD/MM/YYYY">DD/MM/YYYY</MenuItem>
                  <MenuItem value="YYYY-MM-DD">YYYY-MM-DD</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Paper>

          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            {t('settings.measurementSystem')}
          </Typography>
          
          <Paper variant="outlined" sx={{ p: 2 }}>
            <RadioGroup
              value={preferences.measurementSystem}
              onChange={handlePreferenceChange('measurementSystem')}
            >
              <FormControlLabel
                value="metric"
                control={<Radio />}
                label={t('settings.metric')}
              />
              <FormControlLabel
                value="imperial"
                control={<Radio />}
                label={t('settings.imperial')}
              />
            </RadioGroup>
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
        <Button
          variant="contained"
          startIcon={<Save />}
          onClick={() => setSuccess(t('settings.preferencesSaved'))}
        >
          {t('common.saveSettings')}
        </Button>
      </Box>
    </Paper>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 0: return renderProfileTab();
      case 1: return renderNotificationsTab();
      case 2: return renderSecurityTab();
      case 3: return renderAppearanceTab();
      case 4: return renderPreferencesTab();
      default: return null;
    }
  };

  return (
    <Container maxWidth="lg">
      <PageHeader
        title={t('settings.title')}
        subtitle={t('settings.subtitle')}
        breadcrumbs={true}
      />

      {loading && <LinearProgress sx={{ mb: 2 }} />}

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          {tabs.map((tab, index) => (
            <Tab
              key={index}
              label={tab.label}
              icon={tab.icon}
              iconPosition="start"
            />
          ))}
        </Tabs>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      {renderTabContent()}

      {/* Change Password Dialog */}
      <Dialog
        open={passwordDialog}
        onClose={() => setPasswordDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{t('settings.changePassword')}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label={t('settings.currentPassword')}
              type={showPassword.current ? 'text' : 'password'}
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
              error={!!passwordErrors.currentPassword}
              helperText={passwordErrors.currentPassword}
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={() => setShowPassword({ ...showPassword, current: !showPassword.current })}
                    edge="end"
                  >
                    {showPassword.current ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                ),
              }}
            />
            
            <TextField
              fullWidth
              label={t('settings.newPassword')}
              type={showPassword.new ? 'text' : 'password'}
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              error={!!passwordErrors.newPassword}
              helperText={passwordErrors.newPassword}
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={() => setShowPassword({ ...showPassword, new: !showPassword.new })}
                    edge="end"
                  >
                    {showPassword.new ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                ),
              }}
            />
            
            <TextField
              fullWidth
              label={t('settings.confirmNewPassword')}
              type={showPassword.confirm ? 'text' : 'password'}
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
              error={!!passwordErrors.confirmPassword}
              helperText={passwordErrors.confirmPassword}
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={() => setShowPassword({ ...showPassword, confirm: !showPassword.confirm })}
                    edge="end"
                  >
                    {showPassword.confirm ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                ),
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPasswordDialog(false)}>{t('common.cancel')}</Button>
          <Button
            onClick={handleChangePassword}
            variant="contained"
            disabled={loading}
          >
            {loading ? t('common.changing') : t('settings.changePassword')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Account Dialog */}
      <Dialog
        open={deleteAccountDialog}
        onClose={() => setDeleteAccountDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ color: 'error.main' }}>{t('settings.deleteAccount')}</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            {t('settings.deleteAccountWarning')}
          </Alert>
          <Typography variant="body2" paragraph>
            {t('settings.deleteAccountConfirm')}
          </Typography>
          <Typography variant="body2" color="error">
            {t('settings.deleteAccountIrreversible')}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteAccountDialog(false)}>
            {t('common.cancel')}
          </Button>
          <Button
            onClick={handleDeleteAccount}
            variant="contained"
            color="error"
            disabled={loading}
          >
            {loading ? t('common.deleting') : t('settings.deleteAccount')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, action: null })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{confirmDialog.title}</DialogTitle>
        <DialogContent>
          <Typography>{confirmDialog.message}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog({ open: false, action: null })}>
            {t('common.cancel')}
          </Button>
          <Button
            onClick={handleLogoutAllDevices}
            variant="contained"
            color="warning"
          >
            {t('common.confirm')}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!success}
        autoHideDuration={3000}
        onClose={() => setSuccess('')}
      >
        <Alert severity="success" onClose={() => setSuccess('')}>
          {success}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default SettingsPage;