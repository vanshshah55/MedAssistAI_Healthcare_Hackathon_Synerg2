import React from 'react';
import { useAppStore } from '../../store';
import { Bell, User } from 'lucide-react';
// import { cn } from '../../utils/cn';

const Header: React.FC = () => {
  const { 
    notificationsOpen, 
    setNotificationsOpen,
    getUnreadNotificationsCount
  } = useAppStore();

  const unreadCount = getUnreadNotificationsCount();

  return (
    <header className="bg-white border-b border-gray-200 fixed top-0 right-0 left-0 z-30 md:left-64">
      <div className="px-4 py-3 flex justify-between items-center">
        <h1 className="text-xl font-semibold text-gray-800 hidden md:block">
          Emergency Response System
        </h1>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <button
              className="p-2 rounded-full hover:bg-gray-100 relative"
              onClick={() => setNotificationsOpen(!notificationsOpen)}
            >
              <Bell className="h-5 w-5 text-gray-600" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-danger-500 rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
          
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
              <User className="h-4 w-4 text-primary-600" />
            </div>
            <div className="ml-2 hidden md:block">
              <p className="text-sm font-medium text-gray-700">Dr. James Johnson</p>
              <p className="text-xs text-gray-500">Emergency Medicine</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;