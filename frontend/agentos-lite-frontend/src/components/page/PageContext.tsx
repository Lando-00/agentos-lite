import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

export type PageType = 'chat' | 'menu-item';

interface PageContextType {
  activePage: PageType;
  activeComponent: React.ReactNode | null;
  activeTitle: string;
  setActivePage: (page: PageType, component?: React.ReactNode, title?: string) => void;
  returnToChat: () => void;
}

const PageContext = createContext<PageContextType>({
  activePage: 'chat',
  activeComponent: null,
  activeTitle: '',
  setActivePage: () => {},
  returnToChat: () => {},
});

export const usePage = () => useContext(PageContext);

export const PageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activePage, setActivePage] = useState<PageType>('chat');
  const [activeComponent, setActiveComponent] = useState<React.ReactNode | null>(null);
  const [activeTitle, setActiveTitle] = useState<string>('');

  const handleSetActivePage = (
    page: PageType, 
    component: React.ReactNode | null = null,
    title: string = ''
  ) => {
    setActivePage(page);
    setActiveComponent(component);
    setActiveTitle(title);
  };

  const returnToChat = () => {
    handleSetActivePage('chat');
  };

  return (
    <PageContext.Provider value={{ 
      activePage, 
      activeComponent, 
      activeTitle,
      setActivePage: handleSetActivePage,
      returnToChat 
    }}>
      {children}
    </PageContext.Provider>
  );
};

export default PageProvider;
