"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import Homepage from '../pages/Homepage';

export default function Page() {
  const router = useRouter();
  const setCurrentPage = (p) => {
    const route = p === 'dashboard' ? '/' : `/${p}`;
    router.push(route);
  };

  return (
    <div>
      <Homepage setCurrentPage={setCurrentPage} />
    </div>
  );
}
