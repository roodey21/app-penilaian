import React from 'react';
import clsx from 'clsx';

export default function Table({ children, className }) {
  return (
    <div className={clsx('overflow-hidden', className)}>
      <table className="min-w-full divide-y divide-gray-200">{children}</table>
    </div>
  );
}
