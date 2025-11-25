import React from 'react';

const StatCard = ({ title, value, icon: Icon, onClick, valueColor = 'text-base-content' }) => {
  return (
    <div
      onClick={onClick}
      className={`card card-compact bg-base-100 shadow-sm border ${onClick ? 'cursor-pointer hover:shadow-lg transition' : ''}`}
    >
      <div className="card-body">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-base-content/60">{title}</p>
            <p className={`mt-2 text-3xl font-bold ${valueColor}`}>{value}</p>
          </div>
          {Icon && (
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary-focus shadow-md">
              <Icon className="w-6 h-6 text-white" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
