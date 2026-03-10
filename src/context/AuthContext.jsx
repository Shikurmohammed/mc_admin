import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/authService';
import decodeToken from '../utils/decodeJwt';
import apiService from '../services/apiService';
import { getErrorMessage } from '../utils/errorHelper';
import { usersAPI } from '../services/usersService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const data = await authAPI.login(credentials);

      // Only user data is returned - tokens are in HTTP-only cookies
      const { user: userData } = data;

      if (!userData) throw new Error("No user data received");

      const loggedUser = {
        id: userData.id,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role,
        avatar: userData.avatar,
      };

      setUser(loggedUser);
      setIsAuthenticated(true);

      // NO localStorage for tokens - they're in HTTP-only cookies
      // Only store non-sensitive user data
      localStorage.setItem('user', JSON.stringify(loggedUser));

      return { success: true, user: loggedUser };
    } catch (err) {
      console.error("Login Error:", err);
      const friendlyMessage = getErrorMessage(err);
      return {
        success: false,
        error: friendlyMessage
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = useCallback(async () => {
    try {
      await authAPI.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('user');
      // No token cleanup needed - cookies are cleared by backend
    }
  }, []);

  const refreshToken = useCallback(async () => {
    try {
      // No need to send userId - backend gets refresh token from cookie
      const data = await authAPI.refreshTokens();

      if (data) {
        // Optionally, you might get updated user data
        // No need to store new tokens - they're in cookies

        return { success: true };
      } else {
        throw new Error("Invalid response from refresh");
      }
    } catch (err) {
      console.error('Token refresh failed:', err);
      await logout();
      return { success: false, error: err.message };
    }
  }, [logout]);

  const checkAuthStatus = useCallback(async () => {
    try {
      const data = await authAPI.checkAuth();
      if (data.authenticated && data.user) {
        setUser(data.user);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(data.user));
        return true;
      }
      return false;
    } catch (err) {
      console.error('Auth check failed:', err);
      return false;
    }
  }, []);

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);
      const savedUser = localStorage.getItem('user');
      const isDashboard = window.location.pathname.startsWith('/dashboard');

      if (savedUser) {
        setUser(JSON.parse(savedUser));
        setIsAuthenticated(true);
      } else if (!isDashboard) {
        // No user, not dashboard? Just stop loading.
        setLoading(false);
        return;
      }

      try {
        const isValid = await checkAuthStatus();
        if (!isValid && isDashboard) {
          throw new Error("Session invalid");
        }
      } catch (err) {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('user');

        if (isDashboard && window.location.pathname !== '/login') {
          window.location.replace('/login'); // Use replace to clear history
        }
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [checkAuthStatus]);

  // useEffect(() => {
  //   const initAuth = async () => {
  //     const savedUser = localStorage.getItem('user');

  //     if (savedUser) {
  //       // Optimistically set user from localStorage
  //       setUser(JSON.parse(savedUser));
  //       setIsAuthenticated(true);
  //     }

  //     // Verify with backend
  //     const isValid = await checkAuthStatus();

  //     if (!isValid) {
  //       // Backend says we're not authenticated, clear local state
  //       setUser(null);
  //       setIsAuthenticated(false);
  //       localStorage.removeItem('user');
  //     }

  //     setLoading(false);
  //   };

  //   initAuth();
  // }, [checkAuthStatus]);

  // Auto refresh token periodically
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(async () => {
      await refreshToken();
    }, 10 * 60 * 1000); // Refresh every 10 minutes (before 15min expiry)

    return () => clearInterval(interval);
  }, [isAuthenticated, refreshToken]);

  // const updateProfile = async (userData) => {
  //   try {
  //     const updatedUser = { ...user, ...userData };
  //     setUser(updatedUser);
  //     localStorage.setItem('user', JSON.stringify(updatedUser));
  //     return { success: true, user: updatedUser };
  //   } catch (err) {
  //     return { success: false, error: err.message };
  //   }
  // };
  //Reg
  const register = async (userData) => {
    setLoading(true);
    try {
      // 1. Call the API (Make sure authAPI.register is defined in your services)
      const data = await authAPI.register(userData);

      const { user: registeredUser } = data;

      if (!registeredUser) throw new Error("Registration succeeded but no user data returned");

      // 2. Update State
      setUser(registeredUser);
      setIsAuthenticated(true);

      // 3. Sync localStorage (Non-sensitive info only)
      localStorage.setItem('user', JSON.stringify(registeredUser));

      return { success: true, user: registeredUser };
    } catch (err) {
      console.error("Registration Error:", err);
      return {
        success: false,
        error: err.response?.data?.message || err.message || "Registration failed"
      };
    } finally {
      setLoading(false);
    }
  };


  const updateProfile = async (profileData) => {
    try {
      const updatedUser = await usersAPI.updateProfile(profileData);
      setUser(prev => ({ ...prev, ...updatedUser }));
      localStorage.setItem('user', JSON.stringify({ ...user, ...updatedUser }));
      return { success: true, user: updatedUser };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const uploadAvatar = async (file) => {
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const result = await usersAPI.uploadAvatar(formData);

      // Update user with new avatar URL
      setUser(prev => ({ ...prev, avatar: result.url }));
      localStorage.setItem('user', JSON.stringify({ ...user, avatar: result.url }));

      return { success: true, url: result.url };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const updateNotificationSettings = async (settings) => {
    try {
      const result = await usersAPI.updateNotificationSettings(settings);
      return { success: true, settings: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const updateSecuritySettings = async (settings) => {
    try {
      const result = await usersAPI.updateSecuritySettings(settings);
      return { success: true, settings: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

 const updateAppearanceSettings = async (settings) => {
    try {
      const result = await usersAPI.updateAppearanceSettings(settings);
      return { success: true, settings: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const updatePreferences = async (preferences) => {
    try {
      const result = await usersAPI.updatePreferences(preferences);
      return { success: true, preferences: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      await usersAPI.changePassword({ currentPassword, newPassword });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const getLoginHistory = async () => {
    try {
      return await usersAPI.getLoginHistory();
    } catch (error) {
      return [];
    }
  };

  const logoutAllDevices = async () => {
    try {
      await authAPI.logoutAllDevices(); // Usually an auth service method
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const deleteAccount = async () => {
    try {
      await usersAPI.deleteAccount();
      localStorage.clear();
      setUser(null);
      setIsAuthenticated(false);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const loadUserSettings = async () => {
    try {
      return await usersAPI.getUserSettings();
    } catch (error) {
      console.error('Failed to load settings:', error);
      return null;
    }
  };
const value = {
  user,
  role: user?.role || 'CUSTOMER',
  isAuthenticated,
  loading,
  login,
  logout,
  register,
  refreshToken,
  checkAuthStatus,
  updateProfile,
  uploadAvatar,
  updateNotificationSettings,
  updateSecuritySettings,
  updateAppearanceSettings,
  updatePreferences,
  changePassword,
  getLoginHistory,
  logoutAllDevices,
  deleteAccount,
  loadUserSettings,
  isAdmin: user?.role === 'ADMIN',
  isArtisan: user?.role === 'ARTISAN',
  isCustomer: user?.role === 'CUSTOMER',
};

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};