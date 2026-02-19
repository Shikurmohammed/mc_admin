import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { menuService } from '../services/menuService';

export const useMenu = () => {
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState(null);
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const [flatMenu, setFlatMenu] = useState([]);

  useEffect(() => {
    const items = menuService.getFlatMenuItems();
    setFlatMenu(items);
  }, []);

  useEffect(() => {
    const findActiveMenu = () => {
      const items = menuService.getFlatMenuItems();
      const activeItem = items.find(item => 
        location.pathname === item.path || 
        location.pathname.startsWith(item.path + '/')
      );
      
      setActiveMenu(activeItem || null);
      
      // Build breadcrumbs
      if (activeItem) {
        const breadcrumbItems = [];
        let currentItem = activeItem;
        
        while (currentItem) {
          breadcrumbItems.unshift(currentItem);
          // In a real app, you would find parent items
          currentItem = null;
        }
        
        setBreadcrumbs(breadcrumbItems);
      }
    };

    findActiveMenu();
  }, [location.pathname]);

  const getMenuItems = () => menuService.getMenuItems();
  const getFlatMenuItems = () => flatMenu;
  const findMenuItemByPath = (path) => menuService.findMenuItemByPath(path);

  return {
    activeMenu,
    breadcrumbs,
    getMenuItems,
    getFlatMenuItems,
    findMenuItemByPath,
  };
};