import './globals.css';
import React from 'react';
import AppShell from '../components/AppShell';

export const metadata = {
  title: 'LPP 360 Survey',
  description: '360° Best Employee Survey - LPP Hotel & MICE Group'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="lpp">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
