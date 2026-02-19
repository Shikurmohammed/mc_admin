import {
  Dashboard as DashboardIcon,
  Analytics as AnalyticsIcon,
  CalendarToday as CalendarIcon,
  AccountBalance as FinanceIcon,
  Settings as SettingsIcon,
  Description as ReportsIcon,
  BarChart as InsightsIcon,
  Receipt as TransactionsIcon,
  AccountBalanceWallet as BudgetIcon,
  Person as ProfileIcon,
  Notifications as NotificationsIcon,
  Folder as FolderIcon,
  People as PeopleIcon,
  Help as HelpIcon,
  // Add these missing icons below:
  Brush as CraftsIcon,
  Inventory as InventoryIcon,
  ShoppingBag as OrdersIcon,
  Group as UsersIcon,
  Stars as ReviewsIcon,
  Storefront as MyCraftsIcon,
  Category as CategoryIcon,
  Chat as MessageIcon
} from '@mui/icons-material';

import UserRole from '../types/enums/user_role.ts';

export const menuService = {
 getMenuItems: (userRole = UserRole.CUSTOMER) => {
    const baseMenu = [
      {
        id: 'dashboard',
        title: 'Dashboard',
        icon: DashboardIcon,
        path: '/dashboard', // ✅ Updated from '/' to '/dashboard'
        exact: true,
        keywords: ['home', 'main', 'overview', 'stats'],
        roles: ['ADMIN', 'ARTISAN', 'CUSTOMER'],
      },
      {
        id: 'crafts',
        title: 'Crafts',
        icon: CraftsIcon,
        path: '/dashboard/crafts', // ✅ Updated to include /dashboard prefix
        keywords: ['products', 'items', 'handmade', 'art'],
        roles: ['ADMIN', 'ARTISAN', 'CUSTOMER'],
      },
    ];

    const adminMenu = [
      {
        id: 'admin-crafts',
        title: 'All Crafts',
        icon: InventoryIcon,
        path: '/dashboard/crafts', // ✅ Updated
        keywords: ['manage', 'products', 'inventory'],
        roles: ['ADMIN'],
      },
      {
        id: 'orders',
        title: 'Orders',
        icon: OrdersIcon,
        path: '/dashboard/orders', // ✅ Updated
        keywords: ['purchases', 'transactions'],
        roles: ['ADMIN', 'ARTISAN'],
        children: [
          {
            id: 'all-orders',
            title: 'All Orders',
            path: '/dashboard/orders/all', // ✅ Updated
            roles: ['ADMIN'],
          },
          {
            id: 'pending-orders',
            title: 'Pending Orders',
            path: '/dashboard/orders/pending', // ✅ Updated
            roles: ['ADMIN', 'ARTISAN'],
          },
          {
            id: 'completed-orders',
            title: 'Completed Orders',
            path: '/dashboard/orders/completed', // ✅ Updated
            roles: ['ADMIN', 'ARTISAN'],
          },
          {
            id: 'my-orders',
            title: 'My Orders',
            path: '/dashboard/orders/my-orders', // ✅ Updated
            roles: ['CUSTOMER'],
          },
        ],
      },
      {
        id: 'users',
        title: 'Users',
        icon: UsersIcon,
        path: '/dashboard/users', // ✅ Updated
        roles: ['ADMIN'],
        children: [
          {
            id: 'all-users',
            title: 'All Users',
            path: '/dashboard/users/all', // ✅ Updated
            roles: ['ADMIN'],
          },
          {
            id: 'artisans',
            title: 'Artisans',
            path: '/dashboard/users/artisans', // ✅ Updated
            roles: ['ADMIN'],
          },
          {
            id: 'customers',
            title: 'Customers',
            path: '/dashboard/users/customers', // ✅ Updated
            roles: ['ADMIN'],
          },
        ],
      },
      {
        id: 'analytics',
        title: 'Analytics',
        icon: AnalyticsIcon,
        path: '/dashboard/analytics', // ✅ Updated
        roles: ['ADMIN', 'ARTISAN'],
        children: [
          {
            id: 'sales-analytics',
            title: 'Sales Analytics',
            path: '/dashboard/analytics/sales', // ✅ Updated
            roles: ['ADMIN', 'ARTISAN'],
          },
          {
            id: 'craft-analytics',
            title: 'Craft Analytics',
            path: '/dashboard/analytics/crafts', // ✅ Updated
            roles: ['ADMIN', 'ARTISAN'],
          },
          {
            id: 'user-analytics',
            title: 'User Analytics',
            path: '/dashboard/analytics/users', // ✅ Updated
            roles: ['ADMIN'],
          },
        ],
      },
      {
        id: 'reviews',
        title: 'Reviews',
        icon: ReviewsIcon,
        path: '/dashboard/reviews', // ✅ Updated
        roles: ['ADMIN', 'ARTISAN'],
      },
      {
        id: 'my-crafts',
        title: 'My Crafts',
        icon: MyCraftsIcon,
        path: '/dashboard/my-crafts', // ✅ Updated
        roles: ['ARTISAN'],
        children: [
          {
            id: 'all-my-crafts',
            title: 'All My Crafts',
            path: '/dashboard/my-crafts/all', // ✅ Updated
            roles: ['ARTISAN'],
          },
          {
            id: 'add-craft',
            title: 'Add New Craft',
            path: '/dashboard/my-crafts/add', // ✅ Updated
            roles: ['ARTISAN'],
          },
          {
            id: 'drafts',
            title: 'Drafts',
            path: '/dashboard/my-crafts/drafts', // ✅ Updated
            roles: ['ARTISAN'],
          },
        ],
      },
      {
        id: 'categories',
        title: 'Categories',
        icon: CategoryIcon,
        path: '/dashboard/categories', // ✅ Updated
        roles: ['ADMIN'],
      },
      {
        id: 'messages',
        title: 'Messages',
        icon: MessageIcon,
        path: '/dashboard/messages', // ✅ Updated
        roles: ['ADMIN', 'ARTISAN', 'CUSTOMER'],
      },
      {
        id: 'settings',
        title: 'Settings',
        icon: SettingsIcon,
        path: '/dashboard/settings', // ✅ Updated
        roles: ['ADMIN', 'ARTISAN', 'CUSTOMER'],
        children: [
          {
            id: 'profile',
            title: 'Profile Settings',
            path: '/dashboard/settings/profile', // ✅ Updated
            roles: ['ADMIN', 'ARTISAN', 'CUSTOMER'],
          },
          {
            id: 'security',
            title: 'Security',
            path: '/dashboard/settings/security', // ✅ Updated
            roles: ['ADMIN', 'ARTISAN', 'CUSTOMER'],
          },
          {
            id: 'notifications',
            title: 'Notifications',
            path: '/dashboard/settings/notifications', // ✅ Updated
            roles: ['ADMIN', 'ARTISAN', 'CUSTOMER'],
          },
          {
            id: 'appearance',
            title: 'Appearance',
            path: '/dashboard/settings/appearance', // ✅ Updated
            roles: ['ADMIN', 'ARTISAN', 'CUSTOMER'],
          },
          {
            id: 'admin-settings',
            title: 'Admin Settings',
            path: '/dashboard/settings/admin', // ✅ Updated
            roles: ['ADMIN'],
          },
        ],
      },
      {
        id: 'help',
        title: 'Help & Support',
        icon: HelpIcon,
        path: '/dashboard/help', // ✅ Updated
        roles: ['ADMIN', 'ARTISAN', 'CUSTOMER'],
      },
    ];

    const filterByRole = (menu) =>
      menu
        .filter(item => !item.roles || item.roles.includes(userRole))
        .map(item => {
          const filteredChildren = item.children ? filterByRole(item.children) : undefined;
          return {
            ...item,
            children: filteredChildren && filteredChildren.length > 0 ? filteredChildren : undefined,
          };
        });

    return filterByRole([...baseMenu, ...adminMenu]);
  },

  // Global search function for crafts app
  search: function(query, userRole = UserRole.CUSTOMER) {
    if (!query || query.trim() === '') {
      return {
        menuItems: [],
        total: 0
      };
    }

    const searchTerm = query.toLowerCase().trim();
    const results = {
      menuItems: [],
    };

    // Search in menu items
    const searchMenuItems = (items, parent = null) => {
      items.forEach(item => {
        // Check if user has permission to see this item
        if (!item.roles || item.roles.includes(userRole)) {
          const titleMatch = item.title.toLowerCase().includes(searchTerm);
          const keywordMatch = item.keywords?.some(keyword => 
            keyword.toLowerCase().includes(searchTerm)
          );
          const pathMatch = item.path.toLowerCase().includes(searchTerm);
          
          if (titleMatch || keywordMatch || pathMatch) {
            results.menuItems.push({
              ...item,
              parentTitle: parent?.title,
              breadcrumb: parent ? `${parent.title} › ${item.title}` : item.title,
              relevance: this.calculateRelevance(item, searchTerm)
            });
          }

          if (item.children) {
            searchMenuItems(item.children, item);
          }
        }
      });
    };

    searchMenuItems(this.getMenuItems(userRole));

    // Sort by relevance
    results.menuItems.sort((a, b) => b.relevance - a.relevance);
    results.total = results.menuItems.length;

    return results;
  },

  calculateRelevance: function(item, searchTerm) {
    let score = 0;
    
    // Exact title match gets highest score
    if (item.title.toLowerCase() === searchTerm) {
      score += 100;
    }
    
    // Title contains search term
    if (item.title.toLowerCase().includes(searchTerm)) {
      score += 50;
    }
    
    // Path contains search term
    if (item.path.toLowerCase().includes(searchTerm)) {
      score += 30;
    }
    
    // Keyword matches
    if (item.keywords) {
      item.keywords.forEach(keyword => {
        if (keyword.toLowerCase().includes(searchTerm)) {
          score += 20;
        }
      });
    }
    
    // Shorter paths get slightly higher score (more direct access)
    score += Math.max(0, 10 - (item.path.split('/').length - 1));
    
    return score;
  },

  getFlatMenuItems: function(userRole = 'CUSTOMER') {
    const flatten = (items) => {
      let flat = [];
      items.forEach(item => {
        flat.push(item);
        if (item.children) {
          flat = flat.concat(flatten(item.children));
        }
      });
      return flat;
    };
    return flatten(this.getMenuItems(userRole));
  },
  
  findMenuItemByPath: function(path, userRole = 'CUSTOMER') {
    return this.getFlatMenuItems(userRole).find(item => item.path === path);
  },

  getRecentSearches: function() {
    const searches = localStorage.getItem('craftsAppRecentSearches');
    return searches ? JSON.parse(searches) : [];
  },

  addRecentSearch: function(query) {
    const searches = this.getRecentSearches();
    const newSearches = [query, ...searches.filter(s => s !== query)].slice(0, 5);
    localStorage.setItem('craftsAppRecentSearches', JSON.stringify(newSearches));
    return newSearches;
  },

  clearRecentSearches: function() {
    localStorage.removeItem('craftsAppRecentSearches');
    return [];
  },

  getPopularSearches: function() {
    return [
      'crafts',
      'orders',
      'dashboard',
      'analytics',
      'reviews',
      'settings',
      'add craft',
      'my crafts',
      'users',
      'messages'
    ];
  }
};