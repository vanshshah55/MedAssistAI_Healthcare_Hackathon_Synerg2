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
      <Sidebar/>
      <div className="flex flex-col min-h-screen md:pl-64">
        <Header />
        <main className="flex-1 pt-16">
          <div className="max-w-7xl mx-auto p-4 md:p-6">
            {children}
          </div>
        </main>
      </div>
      <NotificationsPanel />
    </div>
  );
};

export default Layout;