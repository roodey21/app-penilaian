import React from 'react';
import clsx from 'clsx';

export default function Input({ className, ...props }) {
  return <input className={clsx('w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500', className)} {...props} />;
}
