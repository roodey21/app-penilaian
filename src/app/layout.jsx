"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../../src/components/layout/Sidebar';
import '../app/globals.css';

export default function RootLayout({ children }) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState('dashboard');

  const handlePageChange = (id) => {
    setCurrentPage(id);
    const route = id === 'dashboard' ? '/' : `/${id}`;
    router.push(route);
  };

  return (
    <html lang="en" data-theme="lpp">
      <body>
        <div className="min-h-screen flex bg-gray-50">
          <Sidebar currentPage={currentPage} onPageChange={handlePageChange} />
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
