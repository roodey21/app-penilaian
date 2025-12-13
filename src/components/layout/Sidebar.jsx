import React from 'react';
import { LogOut } from 'lucide-react';
import { menuItems } from '../../constants/menuItems';

const Sidebar = ({ currentPage, onPageChange, onLogout, user, items }) => {
  const list = items && items.length ? items : menuItems;
  return (
    <aside className="w-64 bg-white border-r">
      <div className="p-4 bg-white border-b">
        <div className="flex items-center space-x-3">
          <img
            src="https://lpphotel.com/wp-content/uploads/2023/03/logo-lpp.png"
            alt="LPP"
            className="object-contain w-10 h-10"
          />
          <div>
            <h1 className="text-sm font-bold">360° Best Employee Survey</h1>
            <p className="text-xs text-base-content/60">LPP Hotel & MICE Group</p>
          </div>
        </div>
      </div>

      <div className="flex-1 p-3 overflow-y-auto">
        <nav className="space-y-1">
          {list.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-2 text-sm rounded-md transition-colors truncate ${isActive ? 'bg-emerald-50 text-emerald-600 font-semibold' : 'text-gray-700 hover:bg-gray-100 hover:text-emerald-600'}`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-600' : 'text-gray-500'}`} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t">
        <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-50">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-sky-500">
            <span className="text-sm font-semibold text-white">{(user?.name || 'U').charAt(0)}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">{user?.name || 'Guest'}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email || 'no-session'}</p>
          </div>
          <button className="p-2 rounded-md hover:bg-gray-100" aria-label="Logout" onClick={onLogout}>
            <LogOut className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
