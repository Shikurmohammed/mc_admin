import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { DashboardProvider } from './context/DashboardContext';
import { SidebarProvider } from './context/SidebarContext';
import { MessageProvider } from './context/MessageContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/toastify.css';
import './locales/i18n';
import LanguageProvider from './context/LanguageContext';

// Layout
import DashboardLayout from './components/layout/DashboardLayout';

// Auth Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';

// Dashboard Pages
import Dashboard from './pages/Dashboard';
import CraftsPage from './pages/CraftsPage';
import OrdersPage from './pages/OrdersPage';
import UsersPage from './pages/UsersPage';
import ReviewsPage from './pages/ReviewsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';

// Craft Management
import MyCraftsPage from './pages/MyCraftsPage';
import AddCraftPage from './pages/AddCraftPage';
import EditCraftPage from './pages/EditCraftPage';
import CraftDetailPage from './pages/CraftDetailPage';

// User Management
import UserProfilePage from './pages/UserProfilePage';

// Messages & Help
import MessagesPage from './pages/MessagesPage';
import HelpPage from './pages/HelpPage';

// Public Pages
import LandingPage from './pages/LandingPage';
import CategoriesPage from './pages/CategoriesPage';
import { Box, CircularProgress } from '@mui/material';
import NotFoundPage from './pages/NotFoundPage';

// Loading Component
const LoadingSpinner = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <Box sx={{ display: 'flex' }}>
      <CircularProgress />
    </Box>
  </div>
);

// Protected Route Component
const ProtectedRoute = ({ children, roles = [] }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (roles.length > 0 && !roles.includes(user?.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Role-based route helper
const RoleRoute = ({ admin, artisan, customer, children }) => {
  const roles = [];
  if (admin) roles.push('ADMIN');
  if (artisan) roles.push('ARTISAN');
  if (customer) roles.push('CUSTOMER');

  return <ProtectedRoute roles={roles}>{children}</ProtectedRoute>;
};

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <ThemeProvider>
          <MessageProvider>
            <DashboardProvider>
              <SidebarProvider>
                <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                  <CssBaseline />
                  <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="colored"
                    limit={3}
                  />
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />

                    {/* Public Category/Craft Routes */}
                    <Route path="/categories" element={<CategoriesPage />} />
                    <Route path="/crafts/:id" element={<CraftDetailPage />} />

                    {/* Redirects */}
                    <Route path="/profile" element={<Navigate to="/dashboard/profile" replace />} />
                    <Route path="/settings" element={<Navigate to="/dashboard/settings" replace />} />

                    {/* Protected Dashboard Routes */}
                    <Route path="/dashboard" element={
                      <ProtectedRoute>
                        <DashboardLayout />
                      </ProtectedRoute>
                    }>
                      {/* Dashboard Home */}
                      <Route index element={<Dashboard />} />

                      {/* Crafts Routes */}
                      <Route path="crafts">
                        <Route index element={<CraftsPage />} />
                        <Route path=":id" element={<CraftDetailPage />} />
                      </Route>

                      {/* Orders Routes */}
                      <Route path="orders">
                        <Route index element={
                          <RoleRoute admin artisan>
                            <OrdersPage />
                          </RoleRoute>
                        } />
                        <Route path="all" element={
                          <RoleRoute admin>
                            <OrdersPage view="all" />
                          </RoleRoute>
                        } />
                        <Route path="pending" element={
                          <RoleRoute admin artisan>
                            <OrdersPage view="pending" />
                          </RoleRoute>
                        } />
                        <Route path="completed" element={
                          <RoleRoute admin artisan>
                            <OrdersPage view="completed" />
                          </RoleRoute>
                        } />
                        <Route path="my-orders" element={
                          <RoleRoute customer>
                            <OrdersPage view="my-orders" />
                          </RoleRoute>
                        } />
                      </Route>

                      {/* Users Routes */}
                      <Route path="users">
                        <Route index element={
                          <RoleRoute admin>
                            <UsersPage />
                          </RoleRoute>
                        } />
                        <Route path="all" element={
                          <RoleRoute admin>
                            <UsersPage view="all" />
                          </RoleRoute>
                        } />
                        <Route path="artisans" element={
                          <RoleRoute admin>
                            <UsersPage view="artisans" />
                          </RoleRoute>
                        } />
                        <Route path="customers" element={
                          <RoleRoute admin>
                            <UsersPage view="customers" />
                          </RoleRoute>
                        } />
                        <Route path=":id" element={
                          <RoleRoute admin>
                            <UserProfilePage />
                          </RoleRoute>
                        } />
                      </Route>

                      {/* Analytics Routes */}
                      <Route path="analytics">
                        <Route index element={
                          <RoleRoute admin artisan>
                            <AnalyticsPage />
                          </RoleRoute>
                        } />
                        <Route path="sales" element={
                          <RoleRoute admin artisan>
                            <AnalyticsPage view="sales" />
                          </RoleRoute>
                        } />
                        <Route path="crafts" element={
                          <RoleRoute admin artisan>
                            <AnalyticsPage view="crafts" />
                          </RoleRoute>
                        } />
                        <Route path="users" element={
                          <RoleRoute admin>
                            <AnalyticsPage view="users" />
                          </RoleRoute>
                        } />
                      </Route>

                      {/* Reviews Routes */}
                      <Route path="reviews">
                        <Route index element={
                          <RoleRoute admin artisan>
                            <ReviewsPage />
                          </RoleRoute>
                        } />
                      </Route>

                      {/* My Crafts Routes */}
                      <Route path="my-crafts">
                        <Route index element={
                          <RoleRoute artisan>
                            <MyCraftsPage />
                          </RoleRoute>
                        } />
                        <Route path="add" element={
                          <RoleRoute artisan>
                            <AddCraftPage />
                          </RoleRoute>
                        } />
                        <Route path="edit/:id" element={
                          <RoleRoute artisan>
                            <EditCraftPage />
                          </RoleRoute>
                        } />
                      </Route>

                      {/* Categories Routes */}
                      <Route path="categories">
                        <Route index element={
                          <RoleRoute admin>
                            <CategoriesPage />
                          </RoleRoute>
                        } />
                      </Route>

                      {/* Messages Routes */}
                      <Route path="messages">
                        <Route index element={
                          <RoleRoute admin artisan customer>
                            <MessagesPage />
                          </RoleRoute>
                        } />
                      </Route>

                      {/* Settings Routes */}
                      <Route path="settings">
                        <Route index element={<SettingsPage />} />
                        <Route path="profile" element={<ProfilePage />} />
                        <Route path="security" element={<SettingsPage tab="security" />} />
                        <Route path="notifications" element={<SettingsPage tab="notifications" />} />
                        <Route path="appearance" element={<SettingsPage tab="appearance" />} />
                        <Route path="admin" element={
                          <RoleRoute admin>
                            <SettingsPage tab="admin" />
                          </RoleRoute>
                        } />
                      </Route>

                      {/* Profile Route */}
                      <Route path="profile" element={<ProfilePage />} />

                      {/* Help Route */}
                      <Route path="help" element={<HelpPage />} />

                      {/* Dashboard catch-all */}
                      <Route path="*" element={<Navigate to="/dashboard" replace />} />
                    </Route>

                    {/* Global 404 */}
                    <Route path="/404" element={<NotFoundPage  />} />
                    <Route path="*" element={<Navigate to="/404" replace />} />
                  </Routes>
                </Router>
              </SidebarProvider>
            </DashboardProvider>
          </MessageProvider>
        </ThemeProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;