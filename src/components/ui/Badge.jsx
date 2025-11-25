import React from 'react';
import clsx from 'clsx';

const variants = {
  default: 'bg-gray-100 text-gray-800',
  primary: 'bg-emerald-100 text-emerald-800',
  success: 'bg-green-100 text-green-800',
  warning: 'bg-amber-100 text-amber-800',
  danger: 'bg-red-100 text-red-800',
  secondary: 'bg-sky-100 text-sky-800',
};

export default function Badge({ children, variant = 'default', className }) {
  return (
    <span className={clsx('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold', variants[variant], className)}>
      {children}
    </span>
  );
}
