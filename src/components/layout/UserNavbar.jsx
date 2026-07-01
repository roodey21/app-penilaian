"use client";
import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ClipboardEdit, BarChart3, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const navItems = [
  { id: 'survey', label: 'Isi Survey', href: '/assessment/menilai', icon: ClipboardEdit },
  { id: 'rekap', label: 'Rekap Penilaian', href: '/assessment/rekap', icon: BarChart3 },
];

export default function UserNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleNavigate = (href) => {
    router.push(href);
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl px-4 mx-auto">
        {/* Top row: Logo + User info */}
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img
              src="/logo-life.png"
              alt="LIFE"
              className="object-contain w-8 h-8"
            />
            <div>
              <h1 className="text-sm font-bold text-gray-900 leading-tight">360° Best Employee Survey</h1>
              <p className="text-[10px] text-gray-500 leading-tight">LIFE Ecosystem</p>
            </div>
          </div>

          {/* User info + Logout */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-sky-500">
                <span className="text-xs font-semibold text-white">
                  {(user?.name || 'U').charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-900 leading-tight">{user?.name || 'User'}</p>
                <p className="text-[10px] text-gray-500 leading-tight">{user?.email || ''}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors border border-gray-200 hover:border-red-200"
              title="Logout"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </div>

        {/* Navigation tabs */}
        <div className="flex gap-1 -mb-px">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.href)}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-lg border-b-2 transition-all
                  ${isActive
                    ? 'border-emerald-600 text-emerald-700 bg-emerald-50/60'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50 hover:border-gray-300'
                  }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-gray-400'}`} />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
