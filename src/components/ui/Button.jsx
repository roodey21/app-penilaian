import React from 'react';
import clsx from 'clsx';

const base = 'inline-flex items-center justify-center rounded-md font-medium transition focus:outline-none';

const variants = {
  primary: 'bg-emerald-600 text-white hover:bg-emerald-700',
  ghost: 'bg-transparent text-gray-700 hover:bg-gray-100',
  outline: 'border border-gray-200 text-gray-700 hover:bg-gray-50',
  danger: 'bg-red-600 text-white hover:bg-red-700',
};

const sizes = {
  sm: 'px-2 py-1 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

export default function Button({ children, variant = 'primary', size = 'md', className, ...props }) {
  return (
    <button className={clsx(base, variants[variant], sizes[size], className)} {...props}>
      {children}
    </button>
  );
}
