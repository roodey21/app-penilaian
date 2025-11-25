import React from 'react';

const PageHeader = ({ title, subtitle, actions }) => {
  return (
    <div className="px-6 py-4 bg-base-100 border-b">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{title}</h2>
          {subtitle && <p className="mt-1 text-sm text-base-content/60">{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center space-x-3">{actions}</div>}
      </div>
    </div>
  );
};

export default PageHeader;
