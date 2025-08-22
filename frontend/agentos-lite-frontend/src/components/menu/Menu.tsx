import React from 'react';
import { useMenu } from './MenuContext';
import type { MenuItem } from './MenuContext';
import { usePage } from '../page/PageContext';
import './Menu.css';

// Menu button that toggles the menu
export const MenuButton: React.FC = () => {
  const { isMenuOpen, openMenu, closeMenu } = useMenu();

  const toggleMenu = () => {
    if (isMenuOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  };

  return (
    <button
      className={`menu-button ${isMenuOpen ? 'active' : ''}`}
      onClick={toggleMenu}
      aria-label="Toggle menu"
      aria-expanded={isMenuOpen}
    >
      <span className="menu-icon">☰</span>
    </button>
  );
};

// Menu sidebar that displays when open
export const MenuSidebar: React.FC = () => {
  const { menuItems, isMenuOpen, closeMenu } = useMenu();
  const { setActivePage } = usePage();

  if (!isMenuOpen) return null;

  const handleMenuItemClick = (item: MenuItem) => {
    // Set the active page to the selected menu item
    setActivePage('menu-item', item.component, item.title);
    // Close the menu
    closeMenu();
  };

  return (
    <aside className={`menu-sidebar ${isMenuOpen ? 'open' : ''}`}>
      <ul className="menu-list">
        {menuItems.map(item => (
          <li 
            key={item.id} 
            className="menu-item"
            onClick={() => handleMenuItemClick(item)}
          >
            {item.icon && <span className="menu-item-icon">{item.icon}</span>}
            <span className="menu-item-title">{item.title}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
};

// Menu overlay that covers the rest of the app
export const MenuOverlay: React.FC = () => {
  const { isMenuOpen, closeMenu } = useMenu();

  if (!isMenuOpen) return null;

  return <div className="menu-overlay" onClick={closeMenu}></div>;
};

// Complete menu system combining all components
const Menu: React.FC = () => {
  return (
    <>
      <MenuSidebar />
      <MenuOverlay />
    </>
  );
};

export default Menu;
