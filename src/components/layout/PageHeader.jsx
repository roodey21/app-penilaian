import React from 'react';

const PageHeader = ({ title, subtitle, actions }) => {
  return (
    <div className="px-8 py-6 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center space-x-3">{actions}</div>}
      </div>
    </div>
  );
};

export default PageHeader;
