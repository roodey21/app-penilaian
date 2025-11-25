import React from 'react';
import clsx from 'clsx';

export default function Card({ children, className }) {
  return (
    <div className={clsx('bg-white border border-gray-200 rounded-lg shadow-sm', className)}>
      {children}
    </div>
  );
}
