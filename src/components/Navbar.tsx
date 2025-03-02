import React from 'react';
import { Menu } from 'lucide-react';

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            {/* <button
              type="button"
              className="text-gray-500 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 p-2"
              onClick={toggleSidebar}
            >
              <Menu size={24} />
            </button> */}
            <div className="ml-4 text-xl font-semibold text-blue-600">Emergency Medical Intervention System</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;