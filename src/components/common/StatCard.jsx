import React from 'react';

const StatCard = ({ title, value, icon: Icon, page, onClick, valueColor = 'text-gray-900' }) => {
  return (
    <div 
      onClick={onClick}
      className={`p-6 bg-white border border-gray-200 rounded-xl ${onClick ? 'transition-shadow cursor-pointer hover:shadow-lg' : ''}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className={`mt-2 text-3xl font-bold ${valueColor}`}>{value}</p>
        </div>
        {Icon && (
          <div className="flex items-center justify-center w-12 h-12 shadow-lg rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600">
            <Icon className="w-6 h-6 text-white" />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
