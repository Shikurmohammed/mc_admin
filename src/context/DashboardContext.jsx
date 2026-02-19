import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

const DashboardContext = createContext();

// Default layouts for different roles
const defaultLayouts = {
  ADMIN: [
    { id: 'stats-overview', type: 'stats-row', title: 'Key Metrics', size: 'full', enabled: true },
    { id: 'revenue-chart', type: 'chart', title: 'Revenue Overview', size: 'large', enabled: true },
    { id: 'recent-activity', type: 'activity', title: 'Recent Activity', size: 'medium', enabled: true },
    { id: 'top-artisans', type: 'top-artisans', title: 'Top Artisans', size: 'medium', enabled: true },
    { id: 'popular-categories', type: 'categories', title: 'Popular Categories', size: 'medium', enabled: true },
    { id: 'user-stats', type: 'stat', title: 'Total Users', value: '0', size: 'small', enabled: true },
    { id: 'craft-stats', type: 'stat', title: 'Total Crafts', value: '0', size: 'small', enabled: true },
    { id: 'order-stats', type: 'stat', title: 'Total Orders', value: '0', size: 'small', enabled: true },
    { id: 'revenue-stats', type: 'stat', title: 'Revenue', value: '$0', size: 'small', enabled: true },
  ],
  
  ARTISAN: [
    { id: 'stats-overview', type: 'stats-row', title: 'My Performance', size: 'full', enabled: true },
    { id: 'sales-chart', type: 'chart', title: 'Sales Overview', size: 'large', enabled: true },
    { id: 'recent-orders', type: 'orders', title: 'Recent Orders', size: 'medium', enabled: true },
    { id: 'craft-performance', type: 'craft-performance', title: 'Craft Performance', size: 'medium', enabled: true },
    { id: 'my-crafts', type: 'stat', title: 'My Crafts', value: '0', size: 'small', enabled: true },
    { id: 'avg-rating', type: 'stat', title: 'Average Rating', value: '0.0', size: 'small', enabled: true },
    { id: 'pending-orders', type: 'stat', title: 'Pending Orders', value: '0', size: 'small', enabled: true },
    { id: 'monthly-earnings', type: 'stat', title: 'Monthly Earnings', value: '$0', size: 'small', enabled: true },
  ],
  
  CUSTOMER: [
    { id: 'welcome-card', type: 'welcome', title: 'Welcome', size: 'full', enabled: true },
    { id: 'recent-orders', type: 'orders', title: 'My Recent Orders', size: 'large', enabled: true },
    { id: 'recommended-crafts', type: 'recommended', title: 'Recommended for You', size: 'medium', enabled: true },
    { id: 'recent-reviews', type: 'activity', title: 'My Reviews', size: 'medium', enabled: true },
    { id: 'wishlist', type: 'stat', title: 'Wishlist', value: '0', size: 'small', enabled: true },
    { id: 'saved-crafts', type: 'stat', title: 'Saved Crafts', value: '0', size: 'small', enabled: true },
    { id: 'total-spent', type: 'stat', title: 'Total Spent', value: '$0', size: 'small', enabled: true },
    { id: 'loyalty-points', type: 'stat', title: 'Loyalty Points', value: '0', size: 'small', enabled: true },
  ],
};

// Available widget types with metadata
export const widgetTypes = {
  'stats-row': {
    name: 'Statistics Row',
    description: 'Display key metrics in a row',
    component: 'StatsRow',
    sizes: ['full'],
  },
  chart: {
    name: 'Chart',
    description: 'Visualize data with charts',
    component: 'ChartWidget',
    sizes: ['small', 'medium', 'large'],
  },
  activity: {
    name: 'Activity Feed',
    description: 'Recent user activities',
    component: 'RecentActivity',
    sizes: ['small', 'medium'],
  },
  orders: {
    name: 'Orders List',
    description: 'Display recent orders',
    component: 'OrdersWidget',
    sizes: ['small', 'medium', 'large'],
  },
  'craft-performance': {
    name: 'Craft Performance',
    description: 'Performance metrics for crafts',
    component: 'CraftPerformanceWidget',
    sizes: ['medium', 'large'],
  },
  'top-artisans': {
    name: 'Top Artisans',
    description: 'Best performing artisans',
    component: 'TopArtisansWidget',
    sizes: ['medium'],
  },
  categories: {
    name: 'Categories',
    description: 'Popular craft categories',
    component: 'CategoriesWidget',
    sizes: ['medium'],
  },
  recommended: {
    name: 'Recommended Crafts',
    description: 'Personalized recommendations',
    component: 'RecommendedWidget',
    sizes: ['medium', 'large'],
  },
  welcome: {
    name: 'Welcome Card',
    description: 'Personalized welcome message',
    component: 'WelcomeWidget',
    sizes: ['full'],
  },
  stat: {
    name: 'Stat Card',
    description: 'Single metric display',
    component: 'StatWidget',
    sizes: ['small'],
  },
};

export const DashboardProvider = ({ children }) => {
  const { user, isAdmin, isArtisan, isCustomer } = useAuth();
  const [widgets, setWidgets] = useState([]);
  const [stats, setStats] = useState({});
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Load saved layout or use default based on role
  useEffect(() => {
    if (!user) return;

    const savedLayout = localStorage.getItem(`dashboard_layout_${user.role}_${user.id}`);
    
    if (savedLayout) {
      setWidgets(JSON.parse(savedLayout));
    } else {
      // Get default layout based on role
      const roleLayout = isAdmin ? defaultLayouts.ADMIN :
                        isArtisan ? defaultLayouts.ARTISAN :
                        defaultLayouts.CUSTOMER;
      setWidgets(roleLayout);
    }
    
    setLoading(false);
  }, [user]);

  // Save layout to localStorage
  useEffect(() => {
    if (user && widgets.length > 0) {
      localStorage.setItem(`dashboard_layout_${user.role}_${user.id}`, JSON.stringify(widgets));
    }
  }, [widgets, user]);

  // Fetch dashboard stats
  const fetchStats = async () => {
    try {
      setLoading(true);
      // API calls would go here
      // Mock data for now
      const mockStats = {
        totalUsers: 1234,
        totalCrafts: 567,
        totalOrders: 890,
        totalRevenue: 45678,
        myCrafts: 23,
        averageRating: 4.8,
        pendingOrders: 5,
        myReviews: 12,
        favoriteCrafts: 8,
        totalSpent: 3456,
        wishlist: 15,
        savedCrafts: 10,
        loyaltyPoints: 450,
      };
      setStats(mockStats);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [user]);

  // Widget management functions
  const moveWidget = (sourceId, targetId) => {
    const sourceIndex = widgets.findIndex(w => w.id === sourceId);
    const targetIndex = widgets.findIndex(w => w.id === targetId);
    
    if (sourceIndex === -1 || targetIndex === -1) return;

    const newWidgets = [...widgets];
    const [movedWidget] = newWidgets.splice(sourceIndex, 1);
    newWidgets.splice(targetIndex, 0, movedWidget);
    
    setWidgets(newWidgets);
  };

  const updateWidget = (widgetId, updates) => {
    setWidgets(prev =>
      prev.map(widget =>
        widget.id === widgetId ? { ...widget, ...updates } : widget
      )
    );
  };

  const addWidget = (widgetType) => {
    const newWidget = {
      id: `${widgetType}-${Date.now()}`,
      type: widgetType,
      title: widgetTypes[widgetType]?.name || 'New Widget',
      size: 'medium',
      enabled: true,
    };
    setWidgets(prev => [...prev, newWidget]);
  };

  const removeWidget = (widgetId) => {
    setWidgets(prev => prev.filter(widget => widget.id !== widgetId));
  };

  const resetLayout = () => {
    const roleLayout = isAdmin ? defaultLayouts.ADMIN :
                      isArtisan ? defaultLayouts.ARTISAN :
                      defaultLayouts.CUSTOMER;
    setWidgets(roleLayout);
  };

  const value = {
    widgets,
    stats,
    loading,
    error,
    isDragging,
    setIsDragging,
    moveWidget,
    updateWidget,
    addWidget,
    removeWidget,
    resetLayout,
    fetchStats,
    widgetTypes,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};