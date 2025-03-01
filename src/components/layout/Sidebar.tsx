import React from 'react';
import { useAppStore } from '../../store';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  BarChart, 
  Settings, 
  Menu, 
  X,
  Stethoscope
} from 'lucide-react';
import { cn } from '../../utils/cn';

const Sidebar: React.FC = () => {
  const { 
    activeView, 
    setActiveView, 
    sidebarOpen, 
    setSidebarOpen 
  } = useAppStore();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'patients', label: 'Patients', icon: Users },
    { id: 'resources', label: 'Resources', icon: Package },
    { id: 'analytics', label: 'Analytics', icon: BarChart },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-white shadow-md"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar backdrop for mobile */}
      {sidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/20 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-screen transition-transform bg-white border-r border-gray-200 md:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
          "w-64 md:w-64"
        )}
      >
        <div className="h-full px-3 py-4 overflow-y-auto">
          <div className="flex items-center mb-5 px-2">
            <Stethoscope className="h-8 w-8 text-primary-600 mr-2" />
            <h1 className="text-xl font-bold text-gray-800">MedAI</h1>
          </div>
          <ul className="space-y-2 font-medium">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <button
                    className={cn(
                      "flex items-center w-full p-2 text-gray-900 rounded-lg hover:bg-gray-100",
                      activeView === item.id && "bg-primary-50 text-primary-600"
                    )}
                    onClick={() => {
                      setActiveView(item.id as any);
                      if (window.innerWidth < 768) {
                        setSidebarOpen(false);
                      }
                    }}
                  >
                    <Icon className={cn(
                      "w-5 h-5 transition duration-75",
                      activeView === item.id ? "text-primary-600" : "text-gray-500"
                    )} />
                    <span className="ml-3">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;