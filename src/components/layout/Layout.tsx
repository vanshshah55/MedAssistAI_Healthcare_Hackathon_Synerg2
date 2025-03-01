import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import NotificationsPanel from './NotificationsPanel';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Header />
      <NotificationsPanel />
      
      <main className="pt-16 md:pl-64">
        <div className="max-w-7xl mx-auto p-4 md:p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;