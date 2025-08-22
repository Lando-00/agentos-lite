import React from 'react';
import { useTheme } from '../themes/ThemeContext';
import { MenuButton } from './menu/Menu';
import { usePage } from './page/PageContext';
import BackButton from './page/BackButton';
import './AppLayout.css';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { theme } = useTheme();
  const { activePage, activeComponent, activeTitle } = usePage();
  
  return (
    <div className="app-layout" style={{ backgroundColor: theme.colors.background }}>
      <div className="app-layout-menu-column">
        <div className="menu-button-container">
          {activePage === 'chat' ? (
            <MenuButton />
          ) : (
            <BackButton />
          )}
        </div>
      </div>
      <div className="app-layout-content-column">
        {activePage === 'chat' ? (
          children
        ) : (
          <div className="menu-page-content">
            {activeTitle && (
              <h2 className="menu-page-title" style={{ color: theme.colors.text.primary }}>
                {activeTitle}
              </h2>
            )}
            <div className="menu-page-component-container">
              {activeComponent}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppLayout;
