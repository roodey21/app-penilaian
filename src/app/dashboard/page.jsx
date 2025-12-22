"use client";
import React, { useEffect, useState } from 'react';
import DashboardHome from '../../pages/DashboardHome';
import { useAuth } from '../../hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { user, ready, isManager } = useAuth({ requireAuth: true });
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState('dashboard');

  useEffect(() => {
    if (ready && user && !isManager) {
      router.replace('/assessment');
    }
  }, [ready, user, isManager, router]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    const route = page === 'dashboard' ? '/dashboard' : `/${page}`;
    router.push(route);
  };

  if (!ready) return null;
  if (!user) return null;
  if (!isManager) return null; // waiting for redirect
  return <DashboardHome setCurrentPage={handlePageChange} />;
}
