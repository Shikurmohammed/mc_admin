import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/authService';
import decodeToken from '../utils/decodeJwt';
import apiService from '../services/apiService';
import { getErrorMessage } from '../utils/errorHelper';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(!!user);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const data = await authAPI.login(credentials);
      const { access_token, refresh_token, user: userData } = data;

      if (!access_token) throw new Error("No token received");

      const decoded = decodeToken(access_token);
      const loggedUser = {
        id: userData.id,
        email: userData.email,
        role: userData.role,
        exp: decoded?.exp,
      };

      setUser(loggedUser);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(loggedUser));
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);

      return { success: true, user: loggedUser };
    } catch (err) {

      console.error("Login Error:", err);

      // Use the helper to get a clean message
      const friendlyMessage = getErrorMessage(err);

      return {
        success: false,
        error: friendlyMessage
      };
      // console.log(err)
      // const backendMessage = err.response?.data?.message;
      // return { 
      //   success: false, 
      //   error: Array.isArray(backendMessage) 
      //     ? backendMessage.join(', ') 
      //     : backendMessage || "Invalid email or password" 
      // };
    } finally {
      setLoading(false);
    }
  };

  const logout = useCallback(async () => {
    try {
      const userId = user?.id || JSON.parse(localStorage.getItem('user'))?.id;
      if (userId) {
        console.log("Good Bye to user with ID...", userId)
        await authAPI.logout(userId);
      }
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.clear();
    }
  }, [user?.id]);

  const refreshToken = useCallback(async () => {
    const currentUserId = user?.id || JSON.parse(localStorage.getItem('user') || '{}')?.id;

    if (!currentUserId) {
      throw new Error('No user ID');
    }

    try {
      // Don't send refresh token in body - it's in HTTP-only cookie
      const data = await authAPI.refreshTokens({ userId: Number(currentUserId) });

      if (data && data.access_token) {
        localStorage.setItem('access_token', data.access_token);
        if (data.refresh_token) {
          localStorage.setItem('refresh_token', data.refresh_token);
        }

        const decoded = decodeToken(data.access_token);
        setUser(prev => ({
          ...prev,
          ...decoded,
          exp: decoded?.exp
        }));

        return { success: true };
      } else {
        throw new Error("Invalid response format from refresh");
      }
    } catch (err) {
      console.error('Token refresh failed:', err);
      await logout();
      return { success: false, error: err.message };
    }
  }, [user?.id, logout]);

  const checkTokenExpiration = useCallback(async () => {
    const token = localStorage.getItem('access_token');
    if (!token) return false;

    try {
      const decoded = decodeToken(token);
      if (!decoded || !decoded.exp) return false;

      const now = Date.now() / 1000;
      const timeUntilExpiry = decoded.exp - now;

      if (timeUntilExpiry < 300) { // Less than 5 minutes
        console.log('Token expiring soon, refreshing...');
        const result = await refreshToken();
        return result.success;
      }
      return true;
    } catch (err) {
      console.error('Token validation failed:', err);
      return false;
    }
  }, [refreshToken]);

  // Initialize auth state - check with a protected endpoint
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('access_token');
      const savedUser = localStorage.getItem('user');

      if (token && savedUser) {
        try {
          // Verify token is still valid by making a lightweight request
          // Use a protected endpoint that just checks auth status
          await authAPI.getProfile();

          setUser(JSON.parse(savedUser));
          setIsAuthenticated(true);
        } catch (err) {
          // Token is invalid or expired, try to refresh
          if (err.response?.status === 401) {
            const refreshResult = await refreshToken();
            if (refreshResult.success) {
              setIsAuthenticated(true);
            } else {
              // Refresh failed, clear everything
              localStorage.clear();
            }
          } else {
            // Other error, clear everything
            localStorage.clear();
          }
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [refreshToken]);

  // Auto refresh token periodically
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(() => {
      checkTokenExpiration();
    }, 4 * 60 * 1000); // Check every 4 minutes

    return () => clearInterval(interval);
  }, [isAuthenticated, checkTokenExpiration]);

  const updateProfile = async (userData) => {
    try {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return { success: true, user: updatedUser };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const value = {
    user,
    role: user?.role || 'CUSTOMER',
    isAuthenticated,
    loading,
    login,
    logout,
    refreshToken,
    updateProfile,
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