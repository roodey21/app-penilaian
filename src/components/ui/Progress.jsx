import React from 'react';

export default function Progress({ value = 0, className }) {
  return (
    <div className={"w-full h-3 bg-gray-200 rounded-full " + (className || '')}>
      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  );
}
