import React from 'react';
import { LogOut } from 'lucide-react';
import { menuItems } from '../../constants/menuItems';

const Sidebar = ({ currentPage, onPageChange }) => {
  return (
    <div className="flex flex-col w-64 bg-white border-r border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <img 
            src="https://lpphotel.com/wp-content/uploads/2023/03/logo-lpp.png" 
            alt="LPP" 
            className="object-contain w-10 h-10" 
          />
          <div>
            <h1 className="text-sm font-bold text-gray-900">360° Best Employee Survey</h1>
            <p className="text-xs text-gray-500">LPP Hotel & MICE Group</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button 
              key={item.id} 
              onClick={() => onPageChange(item.id)} 
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                isActive 
                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center px-4 py-3 space-x-3 rounded-lg bg-gray-50">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-sky-500">
            <span className="text-sm font-semibold text-white">SA</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">Super Admin</p>
            <p className="text-xs text-gray-500 truncate">admin@lpphotel.com</p>
          </div>
          <button className="text-gray-400 hover:text-gray-600">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
