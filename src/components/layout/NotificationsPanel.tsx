import React from 'react';
import { useAppStore } from '../../store';
import { X, AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { cn } from '../../utils/cn';
import { formatTimeAgo } from '../../utils/format';
import { Notification } from '../../pages/types/index';

const NotificationsPanel: React.FC = () => {
  const { 
    notifications, 
    notificationsOpen, 
    setNotificationsOpen,
    markNotificationAsRead
  } = useAppStore();

  const handleMarkAsRead = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    markNotificationAsRead(id);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'alert':
        return <AlertCircle className="h-5 w-5 text-danger-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-warning-500" />;
      case 'info':
        return <Info className="h-5 w-5 text-primary-500" />;
      default:
        return <Info className="h-5 w-5 text-primary-500" />;
    }
  };

  const getNotificationBgColor = (notification: Notification) => {
    if (notification.read) return 'bg-white';
    
    switch (notification.type) {
      case 'alert':
        return 'bg-danger-50';
      case 'warning':
        return 'bg-warning-50';
      case 'info':
        return 'bg-primary-50';
      default:
        return 'bg-primary-50';
    }
  };

  return (
    <>
      {/* Backdrop */}
      {notificationsOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 md:hidden"
          onClick={() => setNotificationsOpen(false)}
        />
      )}
      
      {/* Notifications Panel */}
      <div className={cn(
        "fixed top-0 right-0 z-50 h-screen w-80 bg-white border-l border-gray-200 transition-transform duration-300 transform",
        notificationsOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">Notifications</h2>
          <button 
            className="p-1 rounded-full hover:bg-gray-100"
            onClick={() => setNotificationsOpen(false)}
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        
        <div className="overflow-y-auto h-[calc(100vh-64px)]">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No notifications
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {notifications.map((notification) => (
                <li 
                  key={notification.id}
                  className={cn(
                    "p-4 hover:bg-gray-50 cursor-pointer transition-colors",
                    getNotificationBgColor(notification)
                  )}
                  onClick={() => markNotificationAsRead(notification.id)}
                >
                  <div className="flex">
                    <div className="flex-shrink-0 mr-3">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{formatTimeAgo(notification.timestamp)}</p>
                    </div>
                    {!notification.read && (
                      <button 
                        className="ml-2 text-xs text-primary-600 hover:text-primary-800"
                        onClick={(e) => handleMarkAsRead(notification.id, e)}
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
};

export default NotificationsPanel;