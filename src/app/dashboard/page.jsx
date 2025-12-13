"use client";
import React, { useEffect } from 'react';
import DashboardHome from '../../pages/DashboardHome';
import { useAuth } from '../../hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { user, ready, isManager } = useAuth({ requireAuth: true });
  const router = useRouter();

  useEffect(() => {
    if (ready && user && !isManager) {
      router.replace('/assessment');
    }
  }, [ready, user, isManager, router]);

  if (!ready) return null;
  if (!user) return null;
  if (!isManager) return null; // waiting for redirect
  return <DashboardHome user={user} />;
}
