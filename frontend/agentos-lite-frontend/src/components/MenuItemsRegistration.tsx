import React, { useEffect } from 'react';
import { useMenu } from './menu/MenuContext';
import ThemeBuilder from '../themes/ThemeBuilder';
import AIProviderSelector from './providers/AIProviderSelector';

/**
 * Component that registers all available menu items
 * Add new menu items here as the app grows
 */
const MenuItemsRegistration: React.FC = () => {
  const { registerMenuItem } = useMenu();

  useEffect(() => {
    // Register theme builder menu item
    registerMenuItem({
      id: 'theme-builder',
      title: 'Theme Builder',
      icon: '🎨',
      component: <ThemeBuilder />
    });

    // Register AI provider selector menu item
    registerMenuItem({
      id: 'ai-provider',
      title: 'AI Provider',
      icon: '🤖',
      component: <AIProviderSelector />
    });
    
    // Additional menu items can be registered here in the future
    
  }, [registerMenuItem]);

  // This component doesn't render anything
  return null;
};

export default MenuItemsRegistration;
