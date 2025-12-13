"use client";
import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Sidebar from './layout/Sidebar';
import { useAuth } from '../hooks/useAuth';
import { menuItems } from '../constants/menuItems';

export default function AppShell({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, ready, logout, isManager } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');

  // Filter menu items based on manager status
  const visibleMenuItems = isManager ? menuItems : menuItems.filter(m => m.id === 'assessment');

  const isGuestRoute = pathname === '/login' || pathname === '/' ;

  // Redirects are now handled exclusively by pages using useAuth with requireAuth.

  const handlePageChange = (id) => {
    setCurrentPage(id);
    const route = id === 'dashboard' ? '/dashboard' : `/${id}`;
    router.push(route);
  };

  // Adjust current page if user is not manager and current page is restricted
  React.useEffect(() => {
    if (ready && !isManager && currentPage !== 'assessment') {
      setCurrentPage('assessment');
    }
  }, [ready, isManager, currentPage]);

  if (!ready) {
    return <div className="w-full h-screen flex items-center justify-center text-sm text-gray-500">Memuat...</div>;
  }

  if (isGuestRoute) {
    return children;
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar currentPage={currentPage} onPageChange={handlePageChange} onLogout={logout} user={user} items={visibleMenuItems} />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
