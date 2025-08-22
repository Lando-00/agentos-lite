import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

export type MenuItem = {
  id: string;
  title: string;
  icon?: string;
  component: React.ReactNode;
};

interface MenuContextType {
  menuItems: MenuItem[];
  isMenuOpen: boolean;
  registerMenuItem: (item: MenuItem) => void;
  removeMenuItem: (itemId: string) => void;
  openMenu: () => void;
  closeMenu: () => void;
}

const MenuContext = createContext<MenuContextType>({
  menuItems: [],
  isMenuOpen: false,
  registerMenuItem: () => {},
  removeMenuItem: () => {},
  openMenu: () => {},
  closeMenu: () => {},
});

export const useMenu = () => useContext(MenuContext);

export const MenuProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const registerMenuItem = (item: MenuItem) => {
    setMenuItems(prev => {
      // Check if item with same ID already exists
      if (prev.some(existingItem => existingItem.id === item.id)) {
        return prev;
      }
      return [...prev, item];
    });
  };

  const removeMenuItem = (itemId: string) => {
    setMenuItems(prev => prev.filter(item => item.id !== itemId));
  };

  const openMenu = () => setIsMenuOpen(true);
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <MenuContext.Provider 
      value={{ 
        menuItems, 
        isMenuOpen, 
        registerMenuItem, 
        removeMenuItem, 
        openMenu, 
        closeMenu 
      }}
    >
      {children}
    </MenuContext.Provider>
  );
};

export default MenuProvider;
