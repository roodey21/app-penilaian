import React from 'react';
import { Users, Calendar, ClipboardCheck, TrendingUp } from 'lucide-react';
import StatCard from '../components/common/StatCard';
import PageHeader from '../components/layout/PageHeader';

const DashboardHome = ({ setCurrentPage }) => {
  const stats = [
    { title: 'Total Karyawan', value: '247', icon: Users, page: 'employees' },
    { title: 'Survey Aktif', value: 'Semester 2 2024', icon: Calendar, page: 'periods' },
    { title: 'Completion Rate', value: '73%', icon: ClipboardCheck, page: 'periods' },
    { title: 'Avg NPS Score', value: '52%', icon: TrendingUp, page: 'reports' }
  ];

  return (
    <div>
      <PageHeader 
        title="Dashboard Overview"
        subtitle="Monitoring survei 360° seluruh property"
      />
      
      <div className="p-8 space-y-8">
        <div className="grid grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <StatCard
              key={i}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              onClick={() => setCurrentPage(stat.page)}
            />
          ))}
        </div>

        <div className="p-6 bg-white border border-gray-200 rounded-xl">
          <h3 className="mb-4 text-lg font-bold text-gray-900">Quick Actions</h3>
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: 'Add Employee', icon: Users, page: 'employees' },
              { label: 'Manage Parameters', icon: ClipboardCheck, page: 'parameters' },
              { label: 'View Reports', icon: TrendingUp, page: 'reports' },
              { label: 'Survey Periods', icon: Calendar, page: 'periods' }
            ].map((action, i) => {
              const Icon = action.icon;
              return (
                <button 
                  key={i} 
                  onClick={() => setCurrentPage(action.page)} 
                  className="p-4 transition-all border-2 border-gray-200 border-dashed rounded-lg hover:border-emerald-400 hover:bg-emerald-50 group"
                >
                  <Icon className="w-6 h-6 mx-auto mb-2 text-gray-400 group-hover:text-emerald-600" />
                  <p className="text-sm font-medium text-gray-600 group-hover:text-gray-900">{action.label}</p>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
